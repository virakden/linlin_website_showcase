/*
 * Telegram integration utilities.
 * Handles both regular web and Telegram Mini App (WebApp) contexts.
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          enable: () => void;
          disable: () => void;
          setParams: (params: { text?: string; color?: string; text_color?: string }) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        colorScheme: "light" | "dark";
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        platform: string;
        sendData: (data: string) => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string) => void;
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp?.initDataUnsafe?.user;
}

export function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

export function initTelegramWebApp() {
  const webapp = getTelegramWebApp();
  if (webapp) {
    webapp.ready();
    webapp.expand();
  }
}

export function openTelegramChat(username: string, message?: string) {
  const encodedMessage = message ? encodeURIComponent(message) : "";
  const url = `https://t.me/${username}${encodedMessage ? `?text=${encodedMessage}` : ""}`;

  const webapp = getTelegramWebApp();
  if (webapp && isTelegramWebApp()) {
    webapp.openTelegramLink(url);
  } else {
    window.open(url, "_blank");
  }
}

export function hapticFeedback(type: "light" | "medium" | "heavy" = "light") {
  try {
    getTelegramWebApp()?.HapticFeedback?.impactOccurred(type);
  } catch {
    // Silently fail if not in Telegram context
  }
}
