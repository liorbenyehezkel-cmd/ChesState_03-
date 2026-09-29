import type { PropertyTypeKey } from "@/lib/i18n/types";

export type Listing = {
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  propertyType: PropertyTypeKey;
  fundingPercent: number;
  minStakeUsd: number;
  stakePercent: string;
  targetUsd: number;
};

/**
 * Sample listings only. Nothing here is a live raise — the FAQ is explicit that
 * ChesState will not take a dollar until licensing is complete.
 */
export const listings: Listing[] = [
  {
    slug: "marina-district-residences",
    name: "Marina District Residences",
    city: "Dubai",
    neighborhood: "Dubai Marina",
    propertyType: "residential_building",
    fundingPercent: 62,
    minStakeUsd: 9.99,
    stakePercent: "0.00042%",
    targetUsd: 4_200_000,
  },
  {
    slug: "al-reem-office-yards",
    name: "Al Reem Office Yards",
    city: "Abu Dhabi",
    neighborhood: "Al Reem Island",
    propertyType: "office",
    fundingPercent: 41,
    minStakeUsd: 9.99,
    stakePercent: "0.00031%",
    targetUsd: 6_800_000,
  },
  {
    slug: "dubai-hills-courtyard",
    name: "Dubai Hills Courtyard",
    city: "Dubai",
    neighborhood: "Dubai Hills Estate",
    propertyType: "villa",
    fundingPercent: 28,
    minStakeUsd: 9.99,
    stakePercent: "0.00019%",
    targetUsd: 3_100_000,
  },
  {
    slug: "yas-harbour-suites",
    name: "Yas Harbour Suites",
    city: "Abu Dhabi",
    neighborhood: "Yas Island",
    propertyType: "hospitality",
    fundingPercent: 74,
    minStakeUsd: 9.99,
    stakePercent: "0.00055%",
    targetUsd: 9_400_000,
  },
];

export function listingBySlug(slug: string): Listing | null {
  return listings.find((listing) => listing.slug === slug) ?? null;
}

export const listingSlugs = listings.map((listing) => listing.slug);
