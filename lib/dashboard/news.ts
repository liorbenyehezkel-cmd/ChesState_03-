export type NewsItem = {
  id: string;
  date: string;
  time: string;
  place: string;
  section: string;
  byline: string;
  image: string;
  title: string;
  body: string;
  article: string[];
};

export const newsItems: NewsItem[] = [
  {
    id: "dld-phase-2",
    date: "20 February 2026",
    time: "09:40 GST",
    place: "Dubai",
    section: "Dubai",
    byline: "Mariam Al Hashimi",
    image: "/news/news-dld.png",
    title: "Dubai Land Department opened a controlled resale market for property fractions",
    body: "Phase 2 of the DLD tokenisation pilot, run with PRYPCO Mint and licensed by VARA, made about 7.8 million property-backed units eligible for regulated resale. Purchases in the pilot were in dirhams. It is still a pilot, not an open exchange.",
    article: [
      "DUBAI — On a Thursday morning in February, the Dubai Land Department did something the city’s property market has talked about for three years and almost never done: it let a limited set of already-issued property fractions change hands again, on a book the department can see.",
      "Phase 2 of the tokenisation pilot, run with PRYPCO Mint and licensed by the Virtual Assets Regulatory Authority, opened a controlled resale window for about 7.8 million property-backed units. The figure is the department’s own. It is not a market capitalisation, and it is not a promise that a buyer will be waiting at the price a holder wants.",
      "Purchases in the pilot were settled in dirhams. That detail matters more than the marketing around “on-chain ownership.” The units are recorded digitally, but the money that moved was local currency, through channels the Land Department and VARA already know how to supervise. Nobody in the room described it as a crypto exchange.",
      "Officials were careful with the language. The window is a pilot. Eligibility is narrow. The buildings in the first cohort were chosen in advance, and the investors who received units in Phase 1 were the only names allowed to post a sell order. A member of the public cannot open an app this weekend and bid on a slice of a tower in Business Bay.",
      "That restraint is the story. Dubai has spent a decade telling the world it wants to digitise title, cut the paper, and let smaller tickets into buildings that used to require a seven-figure cheque. The temptation, once the first tokens exist, is to declare a secondary market and let liquidity do the rest. Phase 2 did the opposite. It published a rule for who may sell, to whom, at what hours, and under whose audit.",
      "Lawyers who work the VARA beat said the design looks more like a tightly run over-the-counter desk than a stock exchange. There is a register. There is a cooling period. There is a requirement that the buyer already sit inside the same licensed perimeter. If a trade fails those tests, it does not print.",
      "For a platform such as ChesState, which is being built toward that perimeter rather than around it, the February notice is useful and incomplete. Useful, because it shows the Land Department is willing to treat a fraction as something that can move after the first sale. Incomplete, because the pilot still does not answer the question a cautious holder will ask: if I need the money in ninety days, is there a bid?",
      "The honest answer, this week, is that nobody knows. The book is open in a technical sense. The first prints will tell us whether the 7.8 million units are a market or a museum exhibit with a ticker.",
      "A DLD spokesperson said the department will publish aggregate volumes, not names, and that any expansion beyond the first cohort will need a further VARA sign-off. Until that happens, Phase 2 should be read as a controlled experiment in resale — not as proof that property fractions in Dubai are liquid.",
    ],
  },
  {
    id: "vara-arva",
    date: "2025–2026",
    time: "Desk brief",
    place: "Dubai",
    section: "Regulation",
    byline: "The Emirates Desk",
    image: "/news/news-skyline.png",
    title: "VARA treats property-linked tokens as asset-referenced virtual assets",
    body: "Issuers in this category need a Category 1 licence, a published white paper, and ongoing capital and audit duties. That is the rulebook ChesState is being built toward — not a shortcut around it.",
    article: [
      "DUBAI — The shortest way to misunderstand Dubai’s tokenised-property experiment is to call the tokens “crypto.” The Virtual Assets Regulatory Authority does not. In the rulebook that now governs this work, a token that points at a building, a rental claim, or a documented share of a special-purpose vehicle is an asset-referenced virtual asset — an ARVA — and the duties that follow are closer to a fund prospectus than to a meme-coin launch.",
      "An issuer in this category needs a Category 1 licence. It needs a white paper that VARA has accepted, not merely filed. It needs capital that stays in the business while the tokens are outstanding, and an auditor who will say, in writing, that the asset still sits where the paper said it would. Those are not marketing points. They are the conditions under which a dirham is allowed to move.",
      "The classification is doing real work. If the token were treated as a payment instrument, the conversation would be about wallets and travel rules. If it were treated as a security in the old sense, the conversation would move to a different regulator and a different offering document. VARA’s ARVA bucket is an attempt to keep the product inside a virtual-asset perimeter while tying it, legally, to something you can walk into and photograph.",
      "That tie is the hard part. A villa in Dubai Hills is not a stablecoin. Its value moves with interest rates, with a crane on the next plot, with a delay at the municipality. The white paper has to say so in language a retail holder can read. The firms that have tried to paper over that sentence have not received a licence.",
      "Counsel who have sat in the pre-application meetings describe the same three questions. Who holds the title on the day a token is minted? What happens to the holder if the developer misses a date? Who has the power to pause a transfer if the underlying asset is frozen by a court? An issuer that cannot answer those in a paragraph does not get to the next meeting.",
      "ChesState is being built toward that rulebook, not around it. The public site says as much: no dollar is meant to be invested until the licences are in place. The ARVA path is slower than a Telegram group and more expensive than a simple website. It is also the only path the Land Department has shown any interest in recognising.",
      "Readers should keep the distinction in mind when a new “tokenised building” appears in a press release. If there is no Category 1 licence, no accepted white paper, and no named auditor, the product is a story. It is not yet an ARVA. And a story, however handsome the render, is not something this desk will treat as a market.",
    ],
  },
  {
    id: "dld-target",
    date: "Policy target",
    time: "Analysis",
    place: "Dubai",
    section: "Market",
    byline: "Hassan Qureshi",
    image: "/news/news-market.png",
    title: "DLD’s stated aim is AED 60 billion of tokenised property by 2033",
    body: "That is about 7% of transactions, on the department’s own figures. It is a policy direction, not a promise that any single project will be listed or that a buyer will be waiting.",
    article: [
      "DUBAI — The number that keeps getting repeated in conference halls is AED 60 billion. That is the Dubai Land Department’s published aim for tokenised property by 2033 — roughly 7 percent of the transactions the department expects to see by then, on its own arithmetic. It is a serious figure. It is also a policy direction, and those two things are not the same.",
      "A target of that size tells developers, banks, and the software shops that serve them that the government wants a share of the city’s property tape to live on a digital register. It does not tell a holder that their particular slice of a particular building will be on that register. It does not tell them a bid will exist on a Tuesday in 2029 when they want to sell.",
      "The 7 percent is worth sitting with. It means the department is not imagining that the whole market moves on-chain. Most transfers in 2033, if the target is hit, will still look like the transfers of 2024: a title, a trustee, a cheque or a bank transfer, a trip to the service centre or its website. Tokenisation, in this telling, is a lane — not the highway.",
      "How the AED 60 billion would be counted is less clear. Is it the value of the buildings that have any tokens outstanding, or only the value of the tokens themselves? Does a villa that is 4 percent tokenised and 96 percent held by one family count at the full price, or at the 4 percent? Officials have used both framings in public remarks. Until the methodology is published, the headline number should be treated as a north star, not a spreadsheet.",
      "The more useful question is what has to be true for the target to be more than a slide. Secondary trading has to work for someone other than the original friends-and-family list. Banks have to decide whether a tokenised fraction is collateral, a curiosity, or a compliance headache. And the Land Department has to keep doing the unglamorous work of matching a token to a title so that a court, if it ever has to, can find the asset.",
      "None of that is a reason to ignore the target. Dubai has a habit of publishing a number, then spending a decade building the plumbing until the number looks less ambitious than it did on the day it was announced. The Metro, the airport, the free zones — the pattern is familiar.",
      "It is a reason to keep the sentence complete. AED 60 billion by 2033 is what the department says it wants the lane to carry. It is not a forecast for any project on this platform, and it is not a guarantee that a fraction bought in 2026 will find a buyer in 2027. Those are different claims. Only the first one has been made.",
    ],
  },
  {
    id: "q1-market",
    date: "Q1 2026",
    time: "14:15 GST",
    place: "Dubai",
    section: "Market",
    byline: "Leila Nasser",
    image: "/news/news-skyline.png",
    title: "Dubai logged AED 252 billion of property transactions in the first quarter",
    body: "Transaction value was up about 31% on the year before, across 60,303 deals. A busy market is not the same as a safe one: prices can still fall, and a fraction moves with the building.",
    article: [
      "DUBAI — The first quarter of 2026 was loud. The Dubai Land Department recorded AED 252 billion of property transactions, across 60,303 deals, a rise of about 31 percent on the same months a year earlier. Off-plan still did most of the talking. Ready homes did enough of it to keep the brokers from sounding nervous.",
      "Those are the facts as the department published them. The temptation, in a city that loves a record, is to stop there and call the market healthy. This desk will not. A busy tape is a description of volume. It is not a verdict on price, on leverage, or on what a slice of a building is worth if the next four quarters are quieter.",
      "The mix inside the AED 252 billion matters. A large share of the value sat in a relatively small number of waterfront and branded schemes. The median deal is not the average deal. A reader who hears “quarter of a trillion” and imagines every neighbourhood moving in lockstep is reading a press release, not a market.",
      "Yields, where they are disclosed at all, remain a story about asking rents and yesterday’s purchase price. They are not a forecast. Several of the buildings that printed the highest ticket sizes in January and February are still cranes and hoardings. The rent that appears in a brochure is a picture of a future that has not arrived.",
      "For anyone looking at a fraction rather than a whole unit, the quarter’s noise is a reminder of the old rule: the piece moves with the building. If the tower’s values slip 10 percent, the fraction slips 10 percent. Liquidity does not change that arithmetic. It only changes how quickly you can discover it.",
      "Brokers said cash buyers from India, the United Kingdom, and the wider Gulf were still present, and that mortgage use ticked up as rates eased from last year’s peak. Both observations can be true without making a small ticket safe. A AED 9.99 slice does not inherit the safety of a large down payment. It inherits the building.",
      "The Land Department will publish the April and May figures in due course. If the pace holds, 2026 will be another year of records. If it cools, the first-quarter number will be the one that gets remembered in the brochures. Either way, a fraction is not a hedge against a busy market turning quiet. It is a smaller way to take the same risk.",
    ],
  },
  {
    id: "uae-wider",
    date: "Ongoing",
    time: "Regional",
    place: "UAE",
    section: "Abu Dhabi",
    byline: "Omar Faris",
    image: "/news/news-villas.png",
    title: "Abu Dhabi and Sharjah are watching the same fractional model",
    body: "The live regulatory work is concentrated in Dubai under VARA and the Land Department. Other emirates are part of the wider property market ChesState is mapping, but they do not share Dubai’s token rulebook.",
    article: [
      "ABU DHABI — Drive an hour from the Dubai Land Department and the conversation about fractions changes register. In Abu Dhabi the buildings are as serious, the capital is as patient, and the appetite for a smaller ticket is real. What is not real, not yet, is a rulebook that looks like VARA’s.",
      "Officials on the Abu Dhabi side have not been shy about studying the Dubai pilot. They have been shy about copying it. ADGM has its own virtual-asset framework, written for funds and exchanges that already live on Al Maryah Island. A villa on Saadiyat, or an office floor on Al Reem, does not automatically sit inside that framework just because someone has issued a token that mentions the address.",
      "Sharjah’s position is more practical still. The emirate has spent the last several years filling out Aljada and the older districts with product that a first-time buyer can actually reach. Developers there talk about payment plans, not white papers. When they are asked about tokenisation, the honest ones say they will follow whatever register the relevant department is prepared to recognise — and that no such register, for a fraction, exists in Sharjah today.",
      "This is the map ChesState is working from. The live regulatory work — the licences, the audits, the resale window — is concentrated in Dubai. The wider UAE property market is the thing being mapped: prices, neighbourhoods, the difference between a marina tower and a garden walk in Sharjah. Mapping is not listing. A project that sits on this platform as an illustrative file is not, by that fact, a token the law in Abu Dhabi or Sharjah knows how to transfer.",
      "Investors who treat “the UAE” as a single rule should stop. Title is an emirate matter. Virtual-asset licensing, for the moment, is a tale of two free-zone-adjacent systems that do not automatically honour each other’s paper. A token that is tidy in Dubai can be a stranger in Abu Dhabi the same afternoon.",
      "None of this is an argument against looking north or east of the creek. It is an argument for reading the letterhead. If the offering document names VARA and the Dubai Land Department, the conversation is about an ARVA and a Dubai title. If it names ADGM, the conversation is about a different perimeter. If it names neither, the conversation is not yet a regulated product.",
      "The emirates will, in time, decide how much of Dubai’s experiment they want. Until they do, this desk will keep the sentence accurate: Abu Dhabi and Sharjah are watching the same model. They have not adopted it. A fraction that assumes they have is a story ahead of its law.",
    ],
  },
  {
    id: "escrow-fractions",
    date: "8 March 2026",
    time: "11:05 GST",
    place: "Dubai",
    section: "Regulation",
    byline: "Noura Al Maktoum",
    image: "/news/news-dld.png",
    title: "Escrow for a fraction is being written as if the buyer still bought a whole floor",
    body: "RERA’s off-plan accounts were built for a unit and a developer milestone. The token pilots are trying to reuse that plumbing for tickets the size of a coffee. The fit is imperfect, and the lawyers know it.",
    article: [
      "DUBAI — The Real Estate Regulatory Agency’s escrow rules were written for a familiar object: a buyer, a unit, a developer, and a set of construction milestones that release money when a floor exists. The object in the token pilots is smaller and stranger. It is a claim on a slice, sometimes of a unit that has not been poured, held by a person who may never visit the site.",
      "That mismatch is now a drafting problem. Counsel working the first VARA-licensed cohorts say the easy move — pour the small tickets into the same escrow account as the whole-floor buyers — is the move the auditors like least. A thousand holders at AED 40 each are not, legally, the same as one holder at AED 40,000. If the building misses a date, the question is not only who is repaid. It is who has standing to ask.",
      "RERA has not published a new code for fractions. What exists, as of this month, is guidance in the form of letters to the licensed trustees: keep the tokenised money identifiably separate; do not release it on a milestone the white paper did not name; and be prepared to return it, holder by holder, if the raise fails. That is a memo, not a statute. Memos get rewritten.",
      "The trustees themselves are split. Some argue that a separate sub-account for each token series is the only way to sleep. Others say that way lies a thousand unused IBANs and a reconciliation nightmare. The compromise in the current pilots is a series-level account — one pot per tokenised project, not per person — with a register that says who is owed what if the pot has to be emptied.",
      "For a retail holder the distinction is not academic. If the money sits in a series pot, a delay that hits the building hits every fraction at once. There is no version of the story in which your AED 9.99 is safer than the next holder’s because you clicked earlier. The pot does not know your name until someone has to write a cheque.",
      "Developers, for their part, want the old rhythm back: market the project, collect, hit a slab, draw. The token wrap makes the collect step noisier and the draw step slower. A milestone that used to unlock a tranche after a site visit now also needs a notice to the virtual-asset auditor. That extra week is showing up in construction calendars, quietly, as “regulatory hold.”",
      "ChesState’s public language — that a missed date is meant to return the hold, not spend it — is the sentence this new paperwork is trying to make true. Until RERA puts that sentence in a rule, it remains a design intention. Holders should read the project page for the milestone list, and they should assume that a memo to trustees is not the same as a right they can take to court.",
      "A RERA official, asked whether a dedicated fraction-escrow regulation is coming this year, said only that the agency is “aligned with the Land Department’s pilot” and that buyer protection remains the point of the account. Alignment is not a date. The desk will treat the escrow of a fraction as unfinished law until a circular says otherwise.",
    ],
  },
  {
    id: "thin-resale-book",
    date: "22 March 2026",
    time: "16:20 GST",
    place: "Dubai",
    section: "Market",
    byline: "Yusuf Rahman",
    image: "/news/news-market.png",
    title: "A year after the first tokenised villa, the resale book is still thin",
    body: "The building is finished. The tokens exist. The buyers who wanted a way out are discovering that a register is not the same thing as a queue of bids. Liquidity, so far, is a word ahead of a market.",
    article: [
      "DUBAI — The villa was handed over on a bright Friday last spring. The tokens that represent a slice of it have been sitting in licensed wallets ever since. What has not appeared, except in handfuls, is a second buyer. A year on, the resale book for the first widely publicised tokenised villa in Dubai is thin enough that the people who keep it will say so on the record.",
      "“Thin” here is not a metaphor. On most days the book shows no bid. On the days it does, the size is a rounding error against the number of units that were minted. A holder who wants to exit a position the size of a month’s grocery bill can sometimes do it. A holder who wants to exit a position the size of a used car is waiting.",
      "This is the part the launch films skipped. Tokenisation can record a claim cleanly. It can cut the time it takes to update a register. It cannot invent a person who wants the other side of your trade. That person has to exist in the ordinary way: they have to like the villa, the neighbourhood, the price, and the idea of owning a piece rather than a key.",
      "Brokers who were happy to stand on the lawn at handover are more cautious now. They say the product is easy to explain to a first buyer and hard to explain to a second. The first buyer is buying a story about access. The second buyer is buying a used fraction in a villa they may never sleep in, from a stranger, through a desk that still feels like a pilot. That is a longer conversation.",
      "VARA’s Phase 2 window, opened in February, was supposed to be the answer. It made resale possible inside the licensed perimeter. Possible is not busy. Several of the names who received units in the first cohort have not posted a single offer. They said, when this desk called, that they had bought to hold, and that a thin book does not trouble a hold they never planned to break.",
      "The holders who did plan to break it are the ones writing to customer service. Their emails, shared with the desk on the condition that the names stay out, are polite and repetitive. They want a bid. They want to know when a bid is likely. They want to know whether the issuer will stand in as a buyer of last resort. The answer, so far, is no. A register is not a market-maker.",
      "None of this makes the villa a failure. The building is occupied. The title is clean. The tokens still match the register. What it makes thin is the claim, common a year ago, that a fraction would be “easier to exit than a whole house.” It may be easier to transfer. It has not been easier to sell.",
      "Readers who come to a platform such as ChesState for a small ticket should take the year as data, not as atmosphere. A fraction can be the right size for a first look at a building. It is still a look at a building. If you need the money on a date you can circle, this is the wrong object. The book will tell you that, most mornings, by showing you nothing at all.",
    ],
  },
];

export function newsById(id: string) {
  return newsItems.find((item) => item.id === id) ?? null;
}

export const newsSections = ["Dubai", "Regulation", "Market", "Abu Dhabi"];
