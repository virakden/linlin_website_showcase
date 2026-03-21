/*
 * Telegram Mini App Utilities
 * For LinLin Natural Cosmetic
 *
 * Includes: Mini App functions + Website functions
 */

import { STORE_CONFIG } from "./products";

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
 * WEBSITE FUNCTIONS (used by existing components)
 * ========================================
 */

/**
 * Check if running inside Telegram Web App (alias for compatibility)
 */
export function isTelegramWebApp(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.Telegram?.WebApp?.initDataUnsafe?.user
  );
}

/**
 * Open Telegram chat with pre-filled message
 */
export function openTelegramChat(message?: string): void {
  const username = STORE_CONFIG.telegramUsername;
  let url = `https://t.me/${username}`;

  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }

  // If inside Telegram, use WebApp method
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url);
  } else {
    window.open(url, "_blank");
  }
}

// For personal Telegram contact (using phone number)
export function openTelegramPersonal(message?: string): void {
  const phone = "855969447146";
  let url = `https://t.me/+${phone}`;

  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }

  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url);
  } else {
    window.open(url, "_blank");
  }
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

/*
 * ========================================
 * MINI APP FUNCTIONS (for Order page)
 * ========================================
 */

/**
 * Check if running inside Telegram Mini App
 */
export function isTelegramMiniApp(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.Telegram?.WebApp?.initDataUnsafe?.user
  );
}

/**
 * Initialize Telegram Mini App
 */
export function initTelegramApp(): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
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
