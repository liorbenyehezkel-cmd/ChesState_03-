import Link from "next/link";
import { newsItems, newsSections } from "@/lib/dashboard/news";

export const metadata = { title: "News" };

export default function NewsPage() {
  const [lead, ...rest] = newsItems;

  return (
    <div className="news-desk">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream/15 pb-3 font-sans text-[12px] uppercase tracking-[0.14em] text-cream/45">
        <span>Saturday, 26 September 2026</span>
        <span>Dubai · Gulf Standard Time</span>
      </div>

      <header className="border-b border-cream/20 py-6 text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.42em] text-gold/70">
          ChesState
        </p>
        <h1 className="mt-2 font-serif text-[52px] leading-none tracking-[-0.02em] text-cream sm:text-[68px]">
          The Emirates Desk
        </h1>
        <p className="mt-3 font-sans text-[13px] text-cream/45">
          Property and proptech · Not investment advice
        </p>
      </header>

      <nav aria-label="Sections" className="flex gap-3 overflow-x-auto border-b border-cream/15 py-3">
        {newsSections.map((section) => (
          <span
            key={section}
            className="whitespace-nowrap rounded-full border border-cream/10 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.16em] text-cream/60"
          >
            {section}
          </span>
        ))}
      </nav>

      <article className="mt-8">
        <Link
          href={`/dashboard/news/${lead.id}`}
          className="news-card group grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="overflow-hidden rounded-sm">
            <img
              src={lead.image}
              alt={lead.title}
              className="aspect-[16/10] w-full object-cover transition duration-500 ease-out hover:scale-[1.02]"
            />
          </div>
          <div>
            <p className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-gold">
              <span className="rounded-full border border-gold/35 px-2.5 py-0.5">{lead.section}</span>
              <span className="text-cream/40">{lead.time}</span>
            </p>
            <h2 className="news-card-title mt-3 font-serif text-[34px] leading-[1.12] tracking-[-0.015em] text-cream transition duration-200 sm:text-[42px]">
              {lead.title}
            </h2>
            <p className="mt-3 font-sans text-[13px] text-cream/45">
              By {lead.byline} · {lead.place} · {lead.date}
            </p>
            <p className="mt-5 font-sans text-[17px] leading-relaxed text-cream/75">{lead.body}</p>
            <p className="mt-4 font-sans text-[12px] uppercase tracking-[0.14em] text-gold">
              Continue reading
            </p>
          </div>
        </Link>
      </article>

      <section className="mt-12 border-t border-cream/15 pt-8">
        <h2 className="font-sans text-[12px] uppercase tracking-[0.2em] text-cream/40">Latest</h2>
        <ul className="mt-5 grid gap-8 sm:grid-cols-2">
          {rest.map((item) => (
            <li key={item.id} className="border-b border-cream/10 pb-8">
              <Link href={`/dashboard/news/${item.id}`} className="news-card group">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[16/9] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-3 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-cream/40">
                  <span className="rounded-full border border-cream/15 px-2 py-0.5 text-gold/80">
                    {item.section}
                  </span>
                  <span>{item.time}</span>
                </p>
                <h3 className="news-card-title mt-2 font-serif text-[24px] leading-snug tracking-[-0.01em] text-cream transition duration-200">
                  {item.title}
                </h3>
                <p className="mt-2 font-sans text-[13px] text-cream/40">
                  {item.byline} · {item.date}
                </p>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-cream/65">{item.body}</p>
                <p className="mt-3 font-sans text-[12px] uppercase tracking-[0.14em] text-gold">
                  Continue reading
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
