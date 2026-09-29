import type { Project } from "./types";

/**
 * Vetted sample book. Swap for `public.projects` once Supabase is connected.
 * Yield figures are illustrations, never forecasts.
 */
export const catalog: Project[] = [
  {
    id: "proj-marina",
    slug: "marina-district-residences",
    image: "/projects/marina.png",
    title: "Marina District Residences",
    summary: "48 long-let apartments two streets back from Dubai Marina.",
    description:
      "A residential block bought at shell stage and finished for long-let tenancy. Income is modelled from rent after handover.",
    story:
      "The block sits two streets back from the Marina promenade, so the model assumes long-let rent rather than short-stay tourism. The sample raise covers remaining fit-out: kitchens, bathrooms, and the shared floors. Title was checked against Land Department records, and no charge was sitting on the plot in that file. None of this is a forecast of rent, occupancy, or a future sale price. If a real raise missed its date, the product is designed so held money is returned rather than spent. The building on the public site is the same illustration.",
    city: "Dubai",
    neighborhood: "Dubai Marina",
    propertyType: "Residential building",
    targetAmount: 4_200_000,
    currentAmount: 294_000,
    minStakeUsd: 9.99,
    expectedYield: 6.4,
    status: "live",
    endDate: "2026-12-18",
    investorCount: 18,
    yieldSeries: [
      { year: "Y1", estimate: 4.8 },
      { year: "Y2", estimate: 5.9 },
      { year: "Y3", estimate: 6.4 },
      { year: "Y4", estimate: 6.7 },
      { year: "Y5", estimate: 7.1 },
    ],
    updates: [
      {
        id: "u-marina-1",
        title: "Fit-out package signed",
        body: "The contractor for kitchens and bathrooms is locked. Work starts after the next funding gate.",
        createdAt: "2026-09-02",
      },
      {
        id: "u-marina-2",
        title: "Title search complete",
        body: "Land department records match the seller's file. No charges sit on the plot.",
        createdAt: "2026-08-14",
      },
    ],
  },
  {
    id: "proj-reem",
    slug: "al-reem-office-yards",
    image: "/projects/reem.png",
    title: "Al Reem Office Yards",
    summary: "A floor of occupied Grade-A offices on Al Reem Island.",
    description:
      "The raise refinances an occupied floor rather than opening a building site. The main modelled risks are vacancy and rent, not construction delay.",
    story:
      "Three tenants cover most of the floor, and the shortest remaining term in the sample file is 22 months. The illustration assumes those leases continue and that rent resets stay inside a narrow band. Vacancy, a tenant leaving, or a softer office market in Abu Dhabi would move the result the other way. The chart is a picture of that file, not a promise that the tenants stay or that the floor holds its value. ChesState is not yet licensed to take this money.",
    city: "Abu Dhabi",
    neighborhood: "Al Reem Island",
    propertyType: "Office",
    targetAmount: 6_800_000,
    currentAmount: 272_000,
    minStakeUsd: 9.99,
    expectedYield: 7.1,
    status: "live",
    endDate: "2026-11-30",
    investorCount: 9,
    yieldSeries: [
      { year: "Y1", estimate: 6.2 },
      { year: "Y2", estimate: 6.8 },
      { year: "Y3", estimate: 7.1 },
      { year: "Y4", estimate: 7.3 },
      { year: "Y5", estimate: 7.4 },
    ],
    updates: [
      {
        id: "u-reem-1",
        title: "Lease file reviewed",
        body: "Three tenants cover 91% of the floor. The shortest remaining term is 22 months.",
        createdAt: "2026-09-08",
      },
    ],
  },
  {
    id: "proj-hills",
    slug: "dubai-hills-courtyard",
    image: "/projects/hills.png",
    title: "Dubai Hills Courtyard",
    summary: "Four family villas on one plot in Dubai Hills Estate.",
    description:
      "The raise covers remaining construction and fit-out, not land. Designed as a long hold with two-year family tenancies.",
    story:
      "Four family villas share one plot in Dubai Hills Estate. In the sample, the land is already held and the money would go to structure, finishes, and the first tenancies. Construction can slip, a contractor can cost more than the file, and a family market can cool before the villas are let. The engineer visit mentioned in the updates is part of the illustration, not a site you can visit through ChesState. Treat the yield bars as a sketch of that plan, not as income you should expect.",
    city: "Dubai",
    neighborhood: "Dubai Hills Estate",
    propertyType: "Villa",
    targetAmount: 3_100_000,
    currentAmount: 372_000,
    minStakeUsd: 9.99,
    expectedYield: 5.8,
    status: "live",
    endDate: "2027-01-22",
    investorCount: 14,
    yieldSeries: [
      { year: "Y1", estimate: 3.4 },
      { year: "Y2", estimate: 5.1 },
      { year: "Y3", estimate: 5.8 },
      { year: "Y4", estimate: 6.0 },
      { year: "Y5", estimate: 6.2 },
    ],
    updates: [
      {
        id: "u-hills-1",
        title: "Structure inspection booked",
        body: "The engineer visits in the first week of October. Photos will be posted after sign-off.",
        createdAt: "2026-09-11",
      },
    ],
  },
  {
    id: "proj-yas",
    slug: "yas-harbour-suites",
    image: "/projects/yas.png",
    title: "Yas Harbour Suites",
    summary: "Serviced suites on the Yas Island waterfront.",
    description:
      "Income is modelled from short stays, not annual leases, so it would move with tourism. Shown here as a different risk shape — not as a promise.",
    story:
      "The suites face Yas Harbour. In the model, income comes from short stays, so it rises and falls with tourism, events, and whoever operates the building. A draft term sheet with an operator is part of the sample and is not signed. A busy year in the chart is not a busy year you can count on, and a quiet season would show up in the same place. This listing exists to show a different risk shape from a long-let apartment block.",
    city: "Abu Dhabi",
    neighborhood: "Yas Island",
    propertyType: "Hospitality",
    targetAmount: 9_400_000,
    currentAmount: 846_000,
    minStakeUsd: 9.99,
    expectedYield: 8.2,
    status: "live",
    endDate: "2026-10-28",
    investorCount: 22,
    yieldSeries: [
      { year: "Y1", estimate: 7.0 },
      { year: "Y2", estimate: 7.8 },
      { year: "Y3", estimate: 8.2 },
      { year: "Y4", estimate: 8.0 },
      { year: "Y5", estimate: 8.3 },
    ],
    updates: [
      {
        id: "u-yas-1",
        title: "Operator term sheet agreed",
        body: "The hospitality operator has accepted the draft terms. The agreement is not signed until funding closes.",
        createdAt: "2026-09-05",
      },
    ],
  },
  {
    id: "proj-aljada",
    slug: "aljada-garden-walk",
    image: "/projects/aljada.png",
    title: "Aljada Garden Walk",
    summary: "Ground-floor retail along the Aljada linear park in Sharjah.",
    description:
      "Ground-floor shops along a linear park. The sample assumes passing footfall from the neighbourhood, not a destination mall.",
    story:
      "The retail sits on the ground floor of Aljada’s garden walk in Sharjah. The illustration depends on the park staying busy and on the shop leases being signed after the raise. A quiet stretch of the walk, or a tenant that never opens, would change the picture. Sharjah does not use Dubai’s token rulebook, so this card is a property sketch only. It is not a live shop, not a completed raise, and not an offer.",
    city: "Sharjah",
    neighborhood: "Aljada",
    propertyType: "Retail",
    targetAmount: 2_400_000,
    currentAmount: 432_000,
    minStakeUsd: 9.99,
    expectedYield: 6.9,
    status: "live",
    endDate: "2026-09-01",
    investorCount: 27,
    yieldSeries: [
      { year: "Y1", estimate: 5.5 },
      { year: "Y2", estimate: 6.4 },
      { year: "Y3", estimate: 6.9 },
      { year: "Y4", estimate: 7.0 },
      { year: "Y5", estimate: 7.1 },
    ],
    updates: [
      {
        id: "u-aljada-1",
        title: "Target reached",
        body: "The raise closed at the target. Payout to the project account can now be requested.",
        createdAt: "2026-09-01",
      },
    ],
  },
];

export function projectBySlug(slug: string) {
  return catalog.find((project) => project.slug === slug) ?? null;
}

export function liveCatalog() {
  return catalog.filter((project) => project.status === "live" || project.status === "funded");
}
