import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Public operator details. Do not invent a trade licence, registered office,
 * or company number — those must be filled from the real UAE registration.
 */
export const company = {
  name: SITE_NAME,
  website: SITE_URL,
  jurisdiction: "United Arab Emirates",
  legalEmail: "legal@chesstate.com",
  supportEmail: "hello@chesstate.com",
  registeredOffice: "United Arab Emirates",
  licensing:
    "ChesState is not currently authorised to accept investment funds in the UAE. Listings, yields, and balances on this site are illustrative of a planned product.",
} as const;
