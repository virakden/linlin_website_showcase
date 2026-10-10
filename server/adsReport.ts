/**
 * server/adsReport.ts — Meta Ads reports posted to the ADS REPORT Telegram group.
 *
 * Separate group from STAFF_GROUP_ID, so mini-app order traffic and ads
 * reporting don't mix. Uses the same bot token as the rest of the server.
 *
 * Schedule — all times Cambodia (Asia/Phnom_Penh):
 *   DAILY    22:00 every night           -> today's numbers
 *   CYCLE    23:00, only on a night when a campaign's end date is today
 *            (end-of-boost review)       -> the LAST 7 DAYS from today
 *   MONTHLY  23:30 on the last day of the month -> the LAST 30 DAYS from today
 *
 * Both the weekly and monthly windows are rolling: they count back from
 * today, not from a campaign's start date and not from the 1st of the month.
 *
 * Wire-up in server/index.ts:
 *   import { startAdsReportScheduler, sendAdsReport } from "./adsReport";
 *   ...inside server.listen(): startAdsReportScheduler();
 *
 * Railway variables:
 *   ADS_REPORT_GROUP_ID   the new group's chat id, e.g. -1001234567890
 *   META_ACCESS_TOKEN     Meta System User token with ads_read
 *   META_GRAPH_VERSION    optional, default v21.0
 *   TELEGRAM_BOT_TOKEN    already set
 */

import cron from "node-cron";

const ADS = {
  BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  GROUP_ID: process.env.ADS_REPORT_GROUP_ID || "",
  THREAD_ID: process.env.ADS_REPORT_THREAD_ID || "", // optional, forum topics
  META_TOKEN: process.env.META_ACCESS_TOKEN || "",
  GRAPH: process.env.META_GRAPH_VERSION || "v21.0",
  TRIGGER_KEY: process.env.ADS_REPORT_KEY || "",
  TZ: "Asia/Phnom_Penh",
};

/** Only the two consolidated page accounts are counted. */
const ACCOUNTS: Array<{ id: string; page: string }> = [
  { id: "4235427433442640", page: "Page-Sros" },
  { id: "881911254490142", page: "Page-Jam" },
];

type Period = "daily" | "cycle" | "monthly";

interface MetaAction {
  action_type: string;
  value: string;
}
interface Insight {
  spend?: string;
  actions?: MetaAction[];
  action_values?: MetaAction[];
}

interface PageRow {
  page: string;
  purchases: number;
  messages: number;
  spend: number;
  revenue: number;
  failed: boolean;
}

/* ─────────────────────────── dates (Cambodia) ─────────────────────────── */

const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Cambodia-local calendar date, regardless of the server's own timezone. */
function ppParts(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: ADS.TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const [year, month, day] = iso.split("-");
  return { iso, day, month, year, mon: MON[Number(month) - 1] };
}

const pretty = (p: ReturnType<typeof ppParts>) => `${p.day}/${p.mon}/${p.year}`;

/** Today is the month's last day if tomorrow falls in a different month. */
const isLastDayOfMonth = () => ppParts(0).month !== ppParts(1).month;

/** Cambodia-local YYYY-MM-DD for any timestamp Meta returns. */
function toPPDate(ts: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ADS.TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ts));
}

/* ──────────────────────────── Meta Graph API ──────────────────────────── */

/** Messenger purchases — what Ads Manager shows as "Meta Purchase". */
const PURCHASE_TYPES = [
  "onsite_conversion.purchase",
  "omni_purchase",
  "purchase",
];

/** Conversations started — the "Messenger" count. Meta names this
 *  differently across accounts, so try the known variants in order. */
const MESSAGE_TYPES = [
  "onsite_conversion.messaging_conversation_started_7d",
  "onsite_conversion.total_messaging_connection",
  "messaging_conversation_started_7d",
];

function pickFirst(list: MetaAction[] | undefined, types: string[]): number {
  if (!list) return 0;
  for (const t of types) {
    const hit = list.find(a => a.action_type === t);
    if (hit) return Number(hit.value) || 0;
  }
  return 0;
}

async function graph(
  path: string,
  params: Record<string, string>
): Promise<any> {
  const url = new URL(`https://graph.facebook.com/${ADS.GRAPH}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", ADS.META_TOKEN);

  const res = await fetch(url.toString());
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json;
}

async function fetchPage(
  acct: { id: string; page: string },
  since: string,
  until: string
): Promise<PageRow> {
  const base: PageRow = {
    page: acct.page,
    purchases: 0,
    messages: 0,
    spend: 0,
    revenue: 0,
    failed: false,
  };
  try {
    const json = await graph(`act_${acct.id}/insights`, {
      level: "account",
      fields: "spend,actions,action_values",
      time_range: JSON.stringify({ since, until }),
    });
    const row: Insight | undefined = json.data?.[0];
    if (!row) return base; // no delivery in this window
    return {
      page: acct.page,
      purchases: pickFirst(row.actions, PURCHASE_TYPES),
      messages: pickFirst(row.actions, MESSAGE_TYPES),
      spend: Number(row.spend) || 0,
      revenue: pickFirst(row.action_values, PURCHASE_TYPES),
      failed: false,
    };
  } catch (err) {
    console.error(`❌ [adsReport] ${acct.page}:`, err);
    return { ...base, failed: true };
  }
}

/**
 * True when at least one campaign's end date is today. This decides WHETHER
 * the cycle report fires tonight, so the review follows the rescheduling
 * habit instead of a fixed weekday. It does not decide the date window —
 * that is always the last 7 days from today (see sendAdsReport).
 */
async function campaignsEndingToday(): Promise<boolean> {
  const today = ppParts(0).iso;

  for (const acct of ACCOUNTS) {
    try {
      const json = await graph(`act_${acct.id}/campaigns`, {
        fields: "name,stop_time",
        limit: "200",
      });
      for (const c of json.data || []) {
        if (c.stop_time && toPPDate(c.stop_time) === today) return true;
      }
    } catch (err) {
      console.error(`❌ [adsReport] campaign scan ${acct.page}:`, err);
    }
  }
  return false;
}

/* ───────────────────────────── formatting ─────────────────────────────── */

const money = (n: number) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function buildMessage(period: Period, label: string, rows: PageRow[]): string {
  const lines: string[] = [];

  if (period === "daily") {
    lines.push(`📊 <b>Date: ${label}</b>`, "");
    for (const r of rows) {
      lines.push(`<b>${r.page}:</b>`);
      if (r.failed) {
        lines.push("   ⚠️ could not read this account");
      } else {
        lines.push(`   Purchase: <b>${r.purchases}</b>`);
        lines.push(`   Messenger: <b>${r.messages}</b>`);
      }
      lines.push("");
    }
    return lines.join("\n").trimEnd();
  }

  const spend = rows.reduce((a, r) => a + r.spend, 0);
  const revenue = rows.reduce((a, r) => a + r.revenue, 0);
  const head =
    period === "cycle" ? "Weekly (last 7 days)" : "Monthly (last 30 days)";

  lines.push(`📈 <b>${head}: ${label}</b>`, "");
  for (const r of rows) {
    lines.push(`<b>${r.page}:</b> (Pur: ${r.purchases}, Mess: ${r.messages})`);
  }
  lines.push("");
  lines.push(`<b>Totals_Budget:</b> ${money(spend)}`);
  lines.push(`<b>Totals_Revenue:</b> ${money(revenue)}`);
  if (spend > 0) lines.push(`<b>ROAS:</b> ${(revenue / spend).toFixed(2)}×`);
  return lines.join("\n");
}

/* ─────────────────────────────── Telegram ─────────────────────────────── */

async function sendToAdsGroup(text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${ADS.BOT_TOKEN}/sendMessage`;
  const body: Record<string, unknown> = {
    chat_id: ADS.GROUP_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (ADS.THREAD_ID) body.message_thread_id = Number(ADS.THREAD_ID);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok)
    throw new Error(`Telegram rejected the message: ${json.description}`);
}

/* ──────────────────────────────── public ──────────────────────────────── */

export async function sendAdsReport(period: Period): Promise<void> {
  if (!ADS.BOT_TOKEN || !ADS.GROUP_ID || !ADS.META_TOKEN) {
    console.error(
      "❌ [adsReport] missing TELEGRAM_BOT_TOKEN, ADS_REPORT_GROUP_ID or META_ACCESS_TOKEN"
    );
    return;
  }

  const today = ppParts(0);
  let since = today.iso;
  let label = pretty(today);

  // Rolling windows counted back from today — NOT from a campaign start
  // date and NOT from the 1st of the month. Weekly = the last 7 days
  // (today plus the 6 before it); monthly = the last 30 days.
  if (period === "cycle" || period === "monthly") {
    const days = period === "cycle" ? 7 : 30;
    const start = ppParts(-(days - 1));
    since = start.iso;
    const sameMonth = start.month === today.month && start.year === today.year;
    // "02-08/Oct/2026" inside one month, "09/Sep-08/Oct/2026" across two.
    label = sameMonth
      ? `${start.day}-${today.day}/${today.mon}/${today.year}`
      : `${start.day}/${start.mon}-${today.day}/${today.mon}/${today.year}`;
  }

  const rows = await Promise.all(
    ACCOUNTS.map(a => fetchPage(a, since, today.iso))
  );

  try {
    await sendToAdsGroup(buildMessage(period, label, rows));
    console.log(`✅ [adsReport] ${period} sent (${label})`);
  } catch (err) {
    console.error("❌ [adsReport] send failed:", err);
  }
}

/* ───────────────────────── issue scan ─────────────────────────────────
 * Rule-based health check over the last 7 days. It catches the mechanical
 * faults that have actually cost money on this account: ads blocked by
 * Meta, audiences shown too often, spend with no sales, and ad sets losing
 * money. Each issue carries an estimated weekly waste so it is obvious
 * whether fixing it is worth the time.
 * ------------------------------------------------------------------- */

const RULES = {
  deadSpend: 15, // USD spent with zero purchases over the window
  minToJudge: 30, // USD before ROAS is taken seriously
  roasFloor: 2.0, // below this and the ad set is barely paying for itself
  freqHigh: 8.0, // same people seeing the ads too often
};

interface AdSetRow {
  id: string;
  name: string;
  campaign: string;
  status: string;
  spend: number;
  purchases: number;
  roas: number;
  frequency: number;
  deliveryStatus: string;
  deliverySub: string;
}

interface Issue {
  title: string;
  detail: string;
  fix: string;
  worth: string;
  /** Set only for issues /gotofix may act on. Pausing is reversible; nothing else is attempted. */
  auto?: { accountId: string; adsetId: string; label: string };
}

async function fetchAdSets(
  acct: { id: string; page: string },
  since: string,
  until: string
): Promise<AdSetRow[]> {
  try {
    const json = await graph(`act_${acct.id}/insights`, {
      level: "adset",
      fields: "adset_id,adset_name,campaign_name,spend,frequency,actions",
      time_range: JSON.stringify({ since, until }),
      limit: "100",
    });
    const rows: AdSetRow[] = [];
    for (const r of json.data || []) {
      const spend = Number(r.spend) || 0;
      const purchases = pickFirst(r.actions, PURCHASE_TYPES);
      rows.push({
        id: r.adset_id,
        name: r.adset_name || "?",
        campaign: r.campaign_name || "",
        spend,
        purchases,
        roas: 0,
        frequency: Number(r.frequency) || 0,
        status: "",
        deliveryStatus: "",
        deliverySub: "",
      });
    }
    // revenue needs a second pass through action_values
    const vj = await graph(`act_${acct.id}/insights`, {
      level: "adset",
      fields: "adset_id,action_values",
      time_range: JSON.stringify({ since, until }),
      limit: "100",
    });
    const rev = new Map<string, number>();
    for (const r of vj.data || [])
      rev.set(r.adset_id, pickFirst(r.action_values, PURCHASE_TYPES));
    for (const row of rows) {
      const v = rev.get(row.id) || 0;
      row.roas = row.spend > 0 ? v / row.spend : 0;
    }
    return rows;
  } catch (err) {
    console.error(`❌ [adsIssues] ${acct.page}:`, err);
    return [];
  }
}

/** Ad sets whose delivery is in error — their ads cannot run at all. */
async function fetchBrokenAdSets(acct: {
  id: string;
  page: string;
}): Promise<string[]> {
  try {
    const json = await graph(`act_${acct.id}/adsets`, {
      fields: "name,effective_status,status",
      filtering: JSON.stringify([
        {
          field: "effective_status",
          operator: "IN",
          value: ["WITH_ISSUES", "DISAPPROVED"],
        },
      ]),
      limit: "100",
    });
    return (json.data || []).map((a: any) => a.name as string);
  } catch {
    return [];
  }
}

function scan(
  page: string,
  accountId: string,
  rows: AdSetRow[],
  broken: string[]
): Issue[] {
  const out: Issue[] = [];

  for (const name of broken) {
    out.push({
      title: `${page} · ${name} — ads blocked`,
      detail: "Meta has flagged the ads in this ad set, so it cannot deliver.",
      fix: "Open the ad set in Ads Manager, read the error on each ad, then rebuild the ads by duplicating a working one.",
      worth:
        "High — this ad set is producing nothing while its budget sits idle.",
    });
  }

  for (const r of rows) {
    if (r.spend >= RULES.deadSpend && r.purchases === 0) {
      out.push({
        title: `${page} · ${r.name} — spending with no sales`,
        detail: `$${r.spend.toFixed(2)} spent, 0 purchases in 7 days.`,
        fix: "Turn this ad set off, or swap in creative that is already working elsewhere.",
        worth: `Saves about $${r.spend.toFixed(0)} a week.`,
        auto: { accountId, adsetId: r.id, label: `${page} · ${r.name}` },
      });
      continue;
    }
    if (r.frequency >= RULES.freqHigh) {
      out.push({
        title: `${page} · ${r.name} — audience worn out`,
        detail: `Frequency ${r.frequency.toFixed(1)} — the same people keep seeing the ads.`,
        fix: "Widen the audience, merge it with a similar one, or cut this campaign's budget.",
        worth:
          r.roas < RULES.roasFloor
            ? `High — also running at ${r.roas.toFixed(2)}x, so it is losing money.`
            : "Medium — still profitable, but it will decline if left alone.",
        // Only auto-pausable when it is BOTH worn out and losing money.
        ...(r.roas > 0 && r.roas < RULES.roasFloor
          ? { auto: { accountId, adsetId: r.id, label: `${page} · ${r.name}` } }
          : {}),
      });
      continue;
    }
    if (r.spend >= RULES.minToJudge && r.roas > 0 && r.roas < RULES.roasFloor) {
      const waste = r.spend - r.spend * r.roas;
      out.push({
        title: `${page} · ${r.name} — below ${RULES.roasFloor.toFixed(1)}x`,
        detail: `$${r.spend.toFixed(2)} spent at ${r.roas.toFixed(2)}x.`,
        fix: "Give it one more week, then turn it off if it has not improved. Do not add new creative here.",
        worth:
          waste > 0
            ? `Roughly $${waste.toFixed(0)} a week below break-even.`
            : "Low — close to break-even.",
      });
    }
  }
  return out;
}

/** Issues /gotofix may act on, from the most recent scan. Expires after 2h. */
let pendingFixes: { at: number; items: NonNullable<Issue["auto"]>[] } = {
  at: 0,
  items: [],
};

export async function sendAdsIssues(): Promise<void> {
  if (!ADS.BOT_TOKEN || !ADS.GROUP_ID || !ADS.META_TOKEN) {
    console.error("❌ [adsIssues] missing config");
    return;
  }

  const until = ppParts(0).iso;
  const since = ppParts(-6).iso;
  const all: Issue[] = [];

  for (const acct of ACCOUNTS) {
    const [rows, broken] = await Promise.all([
      fetchAdSets(acct, since, until),
      fetchBrokenAdSets(acct),
    ]);
    all.push(...scan(acct.page, acct.id, rows, broken));
  }

  pendingFixes = {
    at: Date.now(),
    items: all.map(i => i.auto).filter(Boolean) as NonNullable<Issue["auto"]>[],
  };

  const lines: string[] = [
    `🔎 <b>Daily check — ${pretty(ppParts(0))}</b>`,
    "<i>Last 7 days</i>",
    "",
  ];

  if (!all.length) {
    lines.push("✅ <b>Everything smooth — no issues found.</b>");
  } else {
    lines.push(`Found <b>${all.length}</b> issue(s):`, "");
    all.slice(0, 8).forEach((i, n) => {
      lines.push(`<b>${n + 1}. ${i.title}</b>`);
      lines.push(`   ${i.detail}`);
      lines.push(`   🔧 <b>Fix:</b> ${i.fix}`);
      lines.push(`   💰 <b>Worth it?</b> ${i.worth}`);
      lines.push("");
    });
    if (all.length > 8) lines.push(`…and ${all.length - 8} more.`);

    if (pendingFixes.items.length) {
      lines.push("");
      lines.push(
        `🤖 <b>${pendingFixes.items.length} of these can be fixed automatically</b> (by turning the ad set off).`
      );
      lines.push(
        "Send <code>/gotofix</code> to see exactly what would change."
      );
    } else {
      lines.push("");
      lines.push(
        "🖐 <b>These all need manual work</b> — nothing safe to automate."
      );
    }
  }

  try {
    await sendToAdsGroup(lines.join("\n").trimEnd());
    console.log(`✅ [adsIssues] sent (${all.length} issues)`);
  } catch (err) {
    console.error("❌ [adsIssues] send failed:", err);
  }
}

/**
 * /gotofix — pauses the ad sets the last scan flagged as clearly wasteful.
 *
 * Pausing only. Targeting edits are deliberately NOT automated: overwriting
 * a targeting object silently drops fields Ads Manager sets, which has
 * broken live ad sets on this account before. Those stay manual.
 *
 * Two steps: /gotofix lists what would change, /gotofix yes applies it.
 */
export async function handleGoToFix(confirmed: boolean): Promise<string> {
  const age = Date.now() - pendingFixes.at;
  if (!pendingFixes.items.length || age > 2 * 60 * 60 * 1000) {
    return "Nothing queued. Run <code>/report</code> first so the check is fresh, then <code>/gotofix</code>.";
  }

  if (!confirmed) {
    const l = ["\u{1F916} <b>These would be turned off:</b>", ""];
    pendingFixes.items.forEach((f, n) => l.push(`${n + 1}. ${f.label}`));
    l.push("");
    l.push(
      "Pausing only \u2014 nothing is deleted and you can switch them back on any time."
    );
    l.push("Send <code>/gotofix yes</code> to apply.");
    return l.join("\n");
  }

  const done: string[] = [];
  const failed: string[] = [];

  for (const f of pendingFixes.items) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/${ADS.GRAPH}/${f.adsetId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "PAUSED",
            access_token: ADS.META_TOKEN,
          }),
        }
      );
      const json = (await res.json()) as {
        success?: boolean;
        error?: { message: string; code?: number; error_subcode?: number };
      };
      if (json.error) {
        const e = json.error;
        const codes = [e.code, e.error_subcode].filter(Boolean).join("/");
        failed.push(
          `${f.label} \u2014 ${e.message}${codes ? ` (code ${codes})` : ""}`
        );
        continue;
      }
      done.push(f.label);
    } catch (err) {
      failed.push(`${f.label} \u2014 ${String(err)}`);
    }
  }

  pendingFixes = { at: 0, items: [] };

  const l: string[] = [];
  if (done.length) {
    l.push(`\u2705 <b>Turned off ${done.length}:</b>`);
    done.forEach(d => l.push(`   \u2022 ${d}`));
  }
  if (failed.length) {
    l.push("");
    l.push(`\u26A0\uFE0F <b>Could not change ${failed.length}:</b>`);
    failed.forEach(d => l.push(`   \u2022 ${d}`));
    l.push("");
    l.push(
      "Send <code>/whoami</code> to see exactly what this token is allowed to do."
    );
  }
  l.push("");
  l.push("Budget moves to the remaining ad sets. Check tomorrow's report.");
  return l.join("\n");
}

/* ───────────────────────── token self-check ───────────────────────────
 * /whoami — answers "why can't the bot change anything?" without anyone
 * pasting a token anywhere.
 *
 * There are three separate things that must all be true before a PAUSE
 * works, and Meta returns the same useless "Permissions error" for all
 * three. This separates them:
 *
 *   1. The running process must hold the NEW token. Railway reads env
 *      vars once at boot, so editing the variable without a redeploy
 *      leaves the old token in memory. -> "Token identity" / "Expires"
 *   2. The token must carry the ads_management scope.  -> "ads_management"
 *   3. The token's user must hold MANAGE or ADVERTISE on THAT ad account.
 *      A scope is not a role: ads_management with only ANALYZE on the
 *      account reads fine and writes nothing — which is exactly the
 *      "reports work, /gotofix fails" symptom.      -> the per-account line
 */
export async function handleWhoAmI(): Promise<string> {
  if (!ADS.META_TOKEN)
    return "❌ No <code>META_ACCESS_TOKEN</code> set on the server.";

  const l: string[] = ["\u{1F511} <b>Meta token check</b>", ""];

  try {
    const me = await graph("me", { fields: "id,name" });
    l.push(
      `<b>Token belongs to:</b> ${me.name || "(unnamed)"} · <code>${me.id}</code>`
    );
  } catch (err) {
    l.push(`<b>Token belongs to:</b> ❌ ${String(err)}`);
  }

  try {
    const dbg = await graph("debug_token", { input_token: ADS.META_TOKEN });
    const d = (dbg.data || {}) as {
      scopes?: string[];
      expires_at?: number;
      data_access_expires_at?: number;
    };
    const scopes = d.scopes || [];
    const exp = !d.expires_at
      ? "never"
      : new Date(d.expires_at * 1000)
          .toISOString()
          .slice(0, 16)
          .replace("T", " ") + " UTC";
    l.push(`<b>Expires:</b> ${exp}`);
    l.push(
      `<b>ads_read:</b> ${scopes.includes("ads_read") ? "✅" : "❌ missing"}`
    );
    l.push(
      `<b>ads_management:</b> ${scopes.includes("ads_management") ? "✅" : "❌ missing"}`
    );
  } catch (err) {
    l.push(`<b>Scopes:</b> could not read — ${String(err)}`);
  }

  l.push("", "<b>Allowed on each account:</b>");
  for (const acct of ACCOUNTS) {
    try {
      const a = await graph(`act_${acct.id}`, { fields: "name,user_tasks" });
      const tasks: string[] = a.user_tasks || [];
      const canWrite = tasks.includes("MANAGE") || tasks.includes("ADVERTISE");
      l.push(
        `   • ${acct.page}: ${tasks.join(", ") || "(none)"} ${canWrite ? "✅" : "❌ read-only"}`
      );
    } catch (err) {
      l.push(`   • ${acct.page}: ❌ ${String(err)}`);
    }
  }

  l.push("");
  l.push("Pausing needs <b>MANAGE</b> or <b>ADVERTISE</b> on the account.");
  l.push(
    "If ads_management is ✅ but an account says read-only, the fix is the asset assignment in Business Settings — not the token."
  );
  return l.join("\n");
}

/**
 * HTTP trigger. Railway can sleep an idle service, and node-cron never fires
 * while the process is asleep — so an external cron service calls this URL
 * instead. The request itself wakes the service, then the report sends.
 *
 *   GET /api/ads-report?key=<ADS_REPORT_KEY>&period=daily|cycle|monthly
 *
 * period=cycle still checks whether a campaign actually ends today and skips
 * if not, so it is safe to call every night.
 */
export async function handleAdsReportRequest(
  req: any,
  res: any
): Promise<void> {
  const key = String(req.query?.key || "");
  if (!ADS.TRIGGER_KEY || key !== ADS.TRIGGER_KEY) {
    res.status(403).json({ ok: false, error: "forbidden" });
    return;
  }

  const raw = String(req.query?.period || "daily");
  if (raw === "issues") {
    await sendAdsIssues();
    res.json({ ok: true, sent: "issues" });
    return;
  }
  const period: Period =
    raw === "cycle" ? "cycle" : raw === "monthly" ? "monthly" : "daily";

  if (period === "cycle") {
    if (!(await campaignsEndingToday())) {
      res.json({ ok: true, skipped: "no campaign ends today" });
      return;
    }
  }
  if (period === "monthly" && !isLastDayOfMonth()) {
    res.json({ ok: true, skipped: "not the last day of the month" });
    return;
  }

  await sendAdsReport(period);
  res.json({ ok: true, sent: period });
}

/** Posts one line to the group at boot, so a deploy proves the wiring works. */
export async function pingAdsGroup(): Promise<void> {
  if (!ADS.GROUP_ID || !ADS.BOT_TOKEN) return;
  const now = new Intl.DateTimeFormat("en-GB", {
    timeZone: ADS.TZ,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
  try {
    await sendToAdsGroup(
      `🟢 <b>Ads report service started</b>\n${now} (Cambodia)\nDaily 22:00 · Boost-end 23:00 · Monthly 23:30`
    );
    console.log("✅ [adsReport] startup ping delivered");
  } catch (err) {
    console.error("❌ [adsReport] startup ping failed:", err);
  }
}

export function startAdsReportScheduler(): void {
  if (!ADS.GROUP_ID) {
    console.warn(
      "⚠️  [adsReport] ADS_REPORT_GROUP_ID not set — scheduler idle"
    );
    return;
  }

  // 22:00 — every night, today's numbers.
  cron.schedule("0 22 * * *", () => void sendAdsReport("daily"), {
    timezone: ADS.TZ,
  });

  // 22:05 — the issue check, just after the daily numbers.
  cron.schedule("5 22 * * *", () => void sendAdsIssues(), { timezone: ADS.TZ });

  // 23:00 — end-of-boost review, only on a night when a campaign ends today.
  cron.schedule(
    "0 23 * * *",
    async () => {
      if (await campaignsEndingToday()) await sendAdsReport("cycle");
      else
        console.log(
          "ℹ️  [adsReport] no campaign ends today — skipping cycle report"
        );
    },
    { timezone: ADS.TZ }
  );

  // 23:30 — only on the last day of the month.
  cron.schedule(
    "30 23 * * *",
    async () => {
      if (isLastDayOfMonth()) await sendAdsReport("monthly");
    },
    { timezone: ADS.TZ }
  );

  console.log(
    `✅ [adsReport] armed → group ${ADS.GROUP_ID} | daily 22:00 + check 22:05, boost-end review 23:00, monthly 23:30 (${ADS.TZ})`
  );
}
