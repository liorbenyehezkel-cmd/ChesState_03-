export const locales = ["en", "ar", "es", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "chesstate_locale";

/** Shown in the switcher in the language's own script. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  es: "Español",
  fr: "Français",
};

export const localeShortNames: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
  es: "ES",
  fr: "FR",
};

const rtlLocales: readonly Locale[] = ["ar"];

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

export function directionFor(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
