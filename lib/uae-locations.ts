/**
 * Cities and districts across the seven emirates. Not exhaustive — the form
 * also accepts a free-text neighbourhood, so an unlisted district can still be
 * submitted.
 */
export const uaeCities = [
  {
    city: "Dubai",
    neighborhoods: [
      "Downtown Dubai",
      "Dubai Marina",
      "Business Bay",
      "Palm Jumeirah",
      "Jumeirah Village Circle",
      "Jumeirah Lake Towers",
      "Dubai Hills Estate",
      "Arabian Ranches",
      "Deira",
      "Bur Dubai",
      "Al Barsha",
      "Dubai Silicon Oasis",
      "Dubai Creek Harbour",
      "Dubai South",
      "Mirdif",
    ],
  },
  {
    city: "Abu Dhabi",
    neighborhoods: [
      "Al Reem Island",
      "Yas Island",
      "Saadiyat Island",
      "Al Raha Beach",
      "Khalifa City",
      "Al Maryah Island",
      "Masdar City",
      "Al Reef",
      "Mohammed Bin Zayed City",
      "Corniche",
    ],
  },
  {
    city: "Sharjah",
    neighborhoods: [
      "Al Majaz",
      "Al Nahda",
      "Muwailih",
      "Al Khan",
      "Aljada",
      "Tilal City",
      "Al Qasimia",
    ],
  },
  {
    city: "Ajman",
    neighborhoods: [
      "Al Nuaimiya",
      "Ajman Corniche",
      "Al Rashidiya",
      "Emirates City",
      "Al Zorah",
    ],
  },
  {
    city: "Ras Al Khaimah",
    neighborhoods: [
      "Al Marjan Island",
      "Al Hamra Village",
      "Mina Al Arab",
      "Al Nakheel",
    ],
  },
  {
    city: "Fujairah",
    neighborhoods: ["Fujairah City", "Dibba", "Al Faseel", "Sakamkam"],
  },
  {
    city: "Umm Al Quwain",
    neighborhoods: ["Al Salamah", "Al Raas", "Umm Al Quwain Marina"],
  },
] as const;

export type UaeCity = (typeof uaeCities)[number]["city"];

export function neighborhoodsFor(city: string): readonly string[] {
  return uaeCities.find((entry) => entry.city === city)?.neighborhoods ?? [];
}
