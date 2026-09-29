"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { directionFor, LOCALE_COOKIE, type Locale } from "./config";
import type { Dictionary } from "./types";

type I18nValue = {
  locale: Locale;
  t: Dictionary;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  isSwitching: boolean;
};

const I18nContext = createContext<I18nValue | null>(null);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isSwitching, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
      // The server layout reads the cookie, so a refresh swaps the dictionary
      // and the html lang/dir attributes in one pass.
      startTransition(() => router.refresh());
    },
    [locale, router],
  );

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      t: dictionary,
      dir: directionFor(locale),
      setLocale,
      isSwitching,
    }),
    [locale, dictionary, setLocale, isSwitching],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside an I18nProvider");
  }
  return context;
}
