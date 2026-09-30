/**
 * server/adsReport.ts — Meta Ads reports posted to the ADS REPORT Telegram group.
 *
 * Separate group from STAFF_GROUP_ID, so mini-app order traffic and ads
 * reporting don't mix. Uses the same bot token as the rest of the server.
 *
 * Schedule (Cambodia time):
 *   DAILY    23:00 every night           -> today's numbers
 *   CYCLE    23:30, only on a night when a campaign's end date is today
 *                                        -> that campaign run's full period
 *   MONTHLY  23:45 on the last day of the month -> whole month
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
  TZ: "Asia/Phnom_Penh",
};

/** Only the two consolidated page accounts are counted. */
const ACCOUNTS: Array<{ id: string; page: string }> = [
  { id: "4235427433442640", page: "Page-Sros" },
  { id: "881911254490142", page: "Page-Jam" },
];

type Period = "daily" | "cycle" | "monthly";

interface MetaAction { action_type: string; value: string }
interface Insight { spend?: string; actions?: MetaAction[]; action_values?: MetaAction[] }

interface PageRow {
  page: string; purchases: number; messages: number;
  spend: number; revenue: number; failed: boolean;
}

/* ─────────────────────────── dates (Cambodia) ─────────────────────────── */

const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Cambodia-local calendar date, regardless of the server's own timezone. */
function ppParts(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: ADS.TZ, year: "numeric", month: "2-digit", day: "2-digit",
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
    timeZone: ADS.TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(ts));
}

/* ──────────────────────────── Meta Graph API ──────────────────────────── */

/** Messenger purchases — what Ads Manager shows as "Meta Purchase". */
const PURCHASE_TYPES = ["onsite_conversion.purchase", "omni_purchase", "purchase"];

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
    const hit = list.find((a) => a.action_type === t);
    if (hit) return Number(hit.value) || 0;
  }
  return 0;
}

async function graph(path: string, params: Record<string, string>): Promise<any> {
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
    page: acct.page, purchases: 0, messages: 0, spend: 0, revenue: 0, failed: false,
  };
  try {
    const json = await graph(`act_${acct.id}/insights`, {
      level: "account",
      fields: "spend,actions,action_values",
      time_range: JSON.stringify({ since, until }),
    });
    const row: Insight | undefined = json.data?.[0];
    if (!row) return base;                    // no delivery in this window
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
 * Campaigns whose end date is today, and the earliest start among them.
 * This is what makes the cycle report follow the 7-day rescheduling habit
 * instead of a fixed weekday.
 */
async function campaignsEndingToday(): Promise<{ ending: boolean; since: string }> {
  const today = ppParts(0).iso;
  let earliest: string | null = null;
  let ending = false;

  for (const acct of ACCOUNTS) {
    try {
      const json = await graph(`act_${acct.id}/campaigns`, {
        fields: "name,start_time,stop_time",
        limit: "200",
      });
      for (const c of json.data || []) {
        if (!c.stop_time || toPPDate(c.stop_time) !== today) continue;
        ending = true;
        if (c.start_time) {
          const start = toPPDate(c.start_time);
          if (!earliest || start < earliest) earliest = start;
        }
      }
    } catch (err) {
      console.error(`❌ [adsReport] campaign scan ${acct.page}:`, err);
    }
  }
  return { ending, since: earliest || ppParts(-6).iso };
}

/* ───────────────────────────── formatting ─────────────────────────────── */

const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  const head = period === "cycle" ? "Weekly" : "Monthly";

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
  if (!json.ok) throw new Error(`Telegram rejected the message: ${json.description}`);
}

/* ──────────────────────────────── public ──────────────────────────────── */

export async function sendAdsReport(period: Period): Promise<void> {
  if (!ADS.BOT_TOKEN || !ADS.GROUP_ID || !ADS.META_TOKEN) {
    console.error("❌ [adsReport] missing TELEGRAM_BOT_TOKEN, ADS_REPORT_GROUP_ID or META_ACCESS_TOKEN");
    return;
  }

  const today = ppParts(0);
  let since = today.iso;
  let label = pretty(today);

  if (period === "cycle") {
    const { since: s } = await campaignsEndingToday();
    since = s;
    const [sy, sm, sd] = s.split("-");
    const sameMonth = sm === today.month && sy === today.year;
    label = sameMonth
      ? `${sd}-${today.day}/${today.mon}/${today.year}`
      : `${sd}/${MON[Number(sm) - 1]}-${today.day}/${today.mon}/${today.year}`;
  } else if (period === "monthly") {
    since = `${today.year}-${today.month}-01`;
    label = `${today.mon} ${today.year}`;
  }

  const rows = await Promise.all(ACCOUNTS.map((a) => fetchPage(a, since, today.iso)));

  try {
    await sendToAdsGroup(buildMessage(period, label, rows));
    console.log(`✅ [adsReport] ${period} sent (${label})`);
  } catch (err) {
    console.error("❌ [adsReport] send failed:", err);
  }
}

export function startAdsReportScheduler(): void {
  if (!ADS.GROUP_ID) {
    console.warn("⚠️  [adsReport] ADS_REPORT_GROUP_ID not set — scheduler idle");
    return;
  }

  cron.schedule("0 23 * * *", () => void sendAdsReport("daily"), { timezone: ADS.TZ });

  cron.schedule("30 23 * * *", async () => {
    const { ending } = await campaignsEndingToday();
    if (ending) await sendAdsReport("cycle");
    else console.log("ℹ️  [adsReport] no campaign ends today — skipping cycle report");
  }, { timezone: ADS.TZ });

  cron.schedule("45 23 * * *", async () => {
    if (isLastDayOfMonth()) await sendAdsReport("monthly");
  }, { timezone: ADS.TZ });

  console.log(`✅ [adsReport] armed → group ${ADS.GROUP_ID} | daily 23:00, cycle on campaign end, monthly on last day (${ADS.TZ})`);
}
