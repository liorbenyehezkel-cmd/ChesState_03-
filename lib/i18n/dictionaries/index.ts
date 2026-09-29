import type { Locale } from "../config";
import type { Dictionary } from "../types";
import { ar } from "./ar";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

/**
 * Server-side only. The root layout picks one dictionary per request and hands
 * it to the client provider, so the browser never downloads all four.
 */
export const dictionaries: Record<Locale, Dictionary> = { en, ar, es, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
