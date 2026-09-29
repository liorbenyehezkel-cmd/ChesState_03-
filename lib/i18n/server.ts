import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

export function getLocale(): Locale {
  const cookieValue = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(cookieValue) ? cookieValue : defaultLocale;
}

export function getTranslations() {
  const locale = getLocale();
  return { locale, dictionary: getDictionary(locale) };
}
