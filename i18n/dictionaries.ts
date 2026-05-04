/**
 * Lightweight i18n scaffold.
 *
 * The site is intentionally bilingual throughout the UI (zh-TW labels with
 * English subtitles in most places), so this dictionary exists to centralize
 * strings that *don't* already appear in both languages — and to make future
 * locale-prefixed routing straightforward without a heavy runtime library.
 *
 * Usage:
 *   import { t } from "@/i18n/dictionaries";
 *   t("nav.browse", "zh-TW");  // "元件庫"
 */

export type Locale = "zh-TW" | "en";

export const DEFAULT_LOCALE: Locale = "zh-TW";
export const LOCALES: Locale[] = ["zh-TW", "en"];

type Dict = Record<string, string>;

export const DICTIONARIES: Record<Locale, Dict> = {
  "zh-TW": {
    "nav.home": "首頁",
    "nav.browse": "元件庫",
    "nav.docs": "元件文件",
    "nav.form": "表單範例",
    "nav.changelog": "變更日誌",
    "nav.contributing": "貢獻指南",
    "nav.submit": "提交元件",
    "footer.tagline": "專為台灣數位服務打造的開源 React 元件庫。",
    "footer.copyright": "© 2026 Forge. MIT License.",
    "action.copy": "複製",
    "action.copied": "已複製！",
    "status.stable": "穩定",
    "status.beta": "測試版",
    "status.planned": "規劃中",
  },
  en: {
    "nav.home": "Home",
    "nav.browse": "Components",
    "nav.docs": "Docs",
    "nav.form": "Form example",
    "nav.changelog": "Changelog",
    "nav.contributing": "Contributing",
    "nav.submit": "Submit",
    "footer.tagline": "Open-source React components for Taiwan digital services.",
    "footer.copyright": "© 2026 Forge. MIT License.",
    "action.copy": "Copy",
    "action.copied": "Copied!",
    "status.stable": "Stable",
    "status.beta": "Beta",
    "status.planned": "Planned",
  },
};

export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return DICTIONARIES[locale]?.[key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key;
}

/** Parse Accept-Language header and pick the best supported locale. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const tokens = acceptLanguage
    .split(",")
    .map((s) => s.trim().split(";")[0].toLowerCase());
  for (const tok of tokens) {
    if (tok.startsWith("zh")) return "zh-TW";
    if (tok.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}
