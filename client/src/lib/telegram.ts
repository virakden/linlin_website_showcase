/*
 * Telegram Mini App Utilities
 * For LinLin Natural Cosmetic
 *
 * Includes: Mini App functions + Website functions
 */

import { STORE_CONFIG } from "./store-config";

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (
            style: "light" | "medium" | "heavy" | "rigid" | "soft"
          ) => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
          };
          start_param?: string;
        };
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (
          message: string,
          callback?: (confirmed: boolean) => void
        ) => void;
        showPopup: (
          params: {
            title?: string;
            message: string;
            buttons?: Array<{
              id?: string;
              type?: "default" | "ok" | "close" | "cancel" | "destructive";
              text?: string;
            }>;
          },
          callback?: (buttonId: string) => void
        ) => void;
        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme: "light" | "dark";
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
      };
    };
  }
}

/*
 * ========================================
 * LINK OPENING FUNCTIONS
 * ========================================
 */

/**
 * Open any Telegram link (channel, bot, user, etc.)
 * Uses openTelegramLink - opens directly in Telegram app
 */
export function openTelegramLink(url: string): void {
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    // Create anchor and click it - guaranteed new tab
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Open any external link (website, social media, etc.)
 * Uses openLink - opens in browser
 */
export function openExternalLink(url: string): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url);
  } else {
    // Create anchor and click it - guaranteed new tab
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/*
 * ========================================
 * QUICK ACCESS FUNCTIONS (using STORE_CONFIG)
 * ========================================
 */

/**
 * Open Telegram bot chat
 */
export function openTelegramBot(message?: string): void {
  let url = `https://t.me/${STORE_CONFIG.telegramUsername}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  openTelegramLink(url);
}

/**
 * Open personal Telegram contact (phone number)
 */
export function openTelegramPersonal(message?: string): void {
  let url = STORE_CONFIG.telegramContact;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  openTelegramLink(url);
}

/**
 * Open Telegram channel
 */
export function openTelegramChannel(): void {
  openTelegramLink(STORE_CONFIG.telegramChannel);
}

/**
 * Open Mini App shop
 */
export function openTelegramShop(): void {
  openTelegramLink(STORE_CONFIG.telegramMiniApp);
}

/**
 * Open Facebook page
 */
export function openFacebook(): void {
  openExternalLink(STORE_CONFIG.facebook);
}

/**
 * Open TikTok page
 */
export function openTikTok(): void {
  openExternalLink(STORE_CONFIG.tiktok);
}

/**
 * Open Instagram page
 */
export function openInstagram(): void {
  openExternalLink(STORE_CONFIG.instagram);
}

/**
 * Open All Links page
 */
export function openAllLinks(): void {
  openExternalLink(STORE_CONFIG.allLinks);
}

/**
 * Open Website
 */
export function openWebsite(): void {
  openExternalLink(STORE_CONFIG.website);
}

/*
 * ========================================
 * LEGACY FUNCTIONS (for compatibility)
 * ========================================
 */

/**
 * Open Telegram chat with pre-filled message (legacy - use openTelegramBot)
 */
export function openTelegramChat(message?: string): void {
  openTelegramBot(message);
}

/*
 * ========================================
 * MINI APP CORE FUNCTIONS
 * ========================================
 */

/**
 * Check if running inside Telegram Web App
 */
export function isTelegramWebApp(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.Telegram?.WebApp?.initDataUnsafe?.user
  );
}

/**
 * Check if running inside Telegram Mini App (alias)
 */
export function isTelegramMiniApp(): boolean {
  return isTelegramWebApp();
}

/**
 * Initialize Telegram Mini App
 */
export function initTelegramApp(): void {
  if (window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.ready();
    setTimeout(() => {
      webApp.expand();
    }, 100);
  }
}

/**
 * Get Telegram user info
 */
export function getTelegramUser() {
  if (!window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return null;
  }
  return window.Telegram.WebApp.initDataUnsafe.user;
}

/**
 * Trigger haptic feedback
 */
export function hapticFeedback(
  type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light"
): void {
  if (!window.Telegram?.WebApp?.HapticFeedback) return;

  const haptic = window.Telegram.WebApp.HapticFeedback;

  if (type === "success" || type === "warning" || type === "error") {
    haptic.notificationOccurred(type);
  } else {
    haptic.impactOccurred(type);
  }
}

/**
 * Show Telegram alert
 */
export function showTelegramAlert(
  message: string,
  callback?: () => void
): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message, callback);
  } else {
    alert(message);
    callback?.();
  }
}

/**
 * Show Telegram confirm dialog
 */
export function showTelegramConfirm(
  message: string,
  callback: (confirmed: boolean) => void
): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showConfirm(message, callback);
  } else {
    const result = confirm(message);
    callback(result);
  }
}

/**
 * Close Mini App
 */
export function closeMiniApp(): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
  }
}

/**
 * Get color scheme (light/dark)
 */
export function getTelegramColorScheme(): "light" | "dark" {
  return window.Telegram?.WebApp?.colorScheme || "light";
}
