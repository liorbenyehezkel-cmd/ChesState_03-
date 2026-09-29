export type CommunityPerson = {
  id: string;
  name: string;
  handle: string;
  city: string;
  initials: string;
  from: string;
  to: string;
  bio: string;
  photo: string;
  investments: Array<{ project: string; amountUsd: number }>;
};

export type CommunityMessage = {
  id: string;
  personId: string;
  body: string;
  at: string;
  image?: string;
};

export const communityPeople: CommunityPerson[] = [
  {
    id: "layla",
    name: "Layla Hassan",
    handle: "layla.hassan",
    city: "Dubai Marina",
    initials: "LH",
    from: "#7BA3C9",
    to: "#0B1D33",
    photo: "/community/layla.png",
    bio: "Reads the Land Department notes before she looks at a yield chart.",
    investments: [
      { project: "Marina District Residences", amountUsd: 250 },
      { project: "Dubai Hills Courtyard", amountUsd: 80 },
    ],
  },
  {
    id: "omar",
    name: "Omar Haddad",
    handle: "omar.h",
    city: "Al Reem Island",
    initials: "OH",
    from: "#1F6E5A",
    to: "#0B1D33",
    photo: "/community/omar.png",
    bio: "Only looks at raises that return the hold if the date is missed.",
    investments: [{ project: "Al Reem Office Yards", amountUsd: 400 }],
  },
  {
    id: "noor",
    name: "Noor El Sayed",
    handle: "noor.e",
    city: "Downtown Dubai",
    initials: "NE",
    from: "#C4A574",
    to: "#5C4632",
    photo: "/community/noor.png",
    bio: "Keeps stakes small until the pilot language is clearer.",
    investments: [
      { project: "Marina District Residences", amountUsd: 50 },
      { project: "Yas Harbour Suites", amountUsd: 25 },
    ],
  },
  {
    id: "james",
    name: "James Okonkwo",
    handle: "james.o",
    city: "Dubai Hills",
    initials: "JO",
    from: "#D7A441",
    to: "#6B4A12",
    photo: "/community/james.png",
    bio: "Watching construction risk on the villa file.",
    investments: [{ project: "Dubai Hills Courtyard", amountUsd: 120 }],
  },
  {
    id: "fatima",
    name: "Fatima Al Suwaidi",
    handle: "fatima.s",
    city: "Sharjah",
    initials: "FA",
    from: "#8C5A7A",
    to: "#1A1020",
    photo: "/community/fatima.png",
    bio: "Asked customer service how a missed date is handled.",
    investments: [
      { project: "Aljada Garden Walk", amountUsd: 90 },
      { project: "Al Reem Office Yards", amountUsd: 40 },
    ],
  },
  {
    id: "daniel",
    name: "Daniel Cohen",
    handle: "daniel.c",
    city: "Business Bay",
    initials: "DC",
    from: "#F8F6F0",
    to: "#8A867C",
    photo: "/community/daniel.png",
    bio: "New to the room. Still comparing the project page with the questions.",
    investments: [{ project: "Marina District Residences", amountUsd: 15 }],
  },
];

export const starterMessages: CommunityMessage[] = [
  {
    id: "m1",
    personId: "layla",
    body: "Has anyone read the Dubai Land Department note on the resale pilot? I am treating it as a pilot, not a market I can exit.",
    at: "2026-09-18T09:12:00.000Z",
    image: "/community/chat-marina.png",
  },
  {
    id: "m2",
    personId: "omar",
    body: "Layla — same. I only look at projects where the hold returns the money if the raise misses the date.",
    at: "2026-09-18T09:40:00.000Z",
  },
  {
    id: "m3",
    personId: "noor",
    body: "Omar, that is why I stayed with the Marina block. The date on the card is December, and the yield line is labelled as not a forecast.",
    at: "2026-09-18T10:05:00.000Z",
  },
  {
    id: "m4",
    personId: "james",
    body: "Noor, the Hills villas are the file I keep opening. Construction risk is the part I do not love. This is the view from the sample I keep comparing.",
    at: "2026-09-18T11:18:00.000Z",
    image: "/community/chat-coffee.png",
  },
  {
    id: "m5",
    personId: "fatima",
    body: "James, I asked customer service the same thing. They said a missed date is meant to return the hold, not spend it. I still want that on the page, not only in a reply.",
    at: "2026-09-18T12:02:00.000Z",
  },
  {
    id: "m6",
    personId: "daniel",
    body: "Fatima, is that written on the project page or only in the questions on the public site?",
    at: "2026-09-18T13:26:00.000Z",
  },
  {
    id: "m7",
    personId: "layla",
    body: "Daniel — both, if you open more on the project. I still treat every yield as a picture, not a plan.",
    at: "2026-09-18T14:11:00.000Z",
  },
  {
    id: "m8",
    personId: "omar",
    body: "Agreed with Layla. I am not adding another request until the pilot wording is this plain on every card.",
    at: "2026-09-18T15:44:00.000Z",
  },
];

export function personById(id: string) {
  return communityPeople.find((person) => person.id === id) ?? null;
}

export function memberTotal(person: CommunityPerson) {
  return person.investments.reduce((sum, item) => sum + item.amountUsd, 0);
}

export function memberLevel(person: CommunityPerson) {
  const total = memberTotal(person);
  if (total <= 0) return 0;
  return Math.min(100, Math.max(1, Math.round(total / 10)));
}

const weights = [0.08, 0.1, 0.14, 0.2, 0.18, 0.16, 0.14];

export function memberSeries(person: CommunityPerson, range: "weekly" | "monthly" | "max") {
  const total = memberTotal(person);
  const labels =
    range === "weekly"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : range === "monthly"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const used = labels.map((_, index) => weights[index % weights.length]);
  const scale = used.reduce((sum, value) => sum + value, 0);
  return labels.map((label, index) => ({
    label,
    value: Math.round((total * used[index]) / scale),
  }));
}
