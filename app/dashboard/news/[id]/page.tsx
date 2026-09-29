import Link from "next/link";
import { notFound } from "next/navigation";
import { newsById, newsItems } from "@/lib/dashboard/news";

export function generateStaticParams() {
  return newsItems.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const item = newsById(params.id);
  return {
    title: item ? `${item.title} — The Emirates Desk` : "News — ChesState",
  };
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const item = newsById(params.id);
  if (!item) notFound();

  const related = newsItems.filter((story) => story.id !== item.id).slice(0, 3);
  const [lead, ...rest] = item.article;
  const pull = rest[2] ?? rest[0];

  return (
    <article className="news-desk">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream/15 pb-3 font-sans text-[12px] uppercase tracking-[0.14em] text-cream/45">
        <span>{item.date}</span>
        <span>
          {item.place} · {item.time}
        </span>
      </div>

      <p className="pt-6 text-center font-sans text-[11px] uppercase tracking-[0.42em] text-gold/70">
        The Emirates Desk
      </p>
      <Link
        href="/dashboard/news"
        className="mt-3 inline-block font-sans text-[13px] text-cream/50 transition hover:text-cream"
      >
        All stories
      </Link>

      <p className="mt-8 inline-flex rounded-full border border-gold/35 px-2.5 py-0.5 font-sans text-[11px] uppercase tracking-[0.18em] text-gold">
        {item.section}
      </p>
      <h1 className="mt-3 max-w-[22ch] font-serif text-[36px] leading-[1.12] text-cream sm:text-[52px]">
        {item.title}
      </h1>
      <p className="mt-5 max-w-[62ch] font-serif text-[20px] leading-snug text-cream/70">{item.body}</p>
      <p className="mt-5 font-sans text-[13px] text-cream/45">
        By {item.byline} · {item.place} · {item.date}
      </p>

      <img
        src={item.image}
        alt={item.title}
        className="mt-8 aspect-[16/8] w-full rounded-sm object-cover"
      />
      <p className="mt-2 font-sans text-[12px] italic text-cream/40">
        {item.place}. File photograph · ChesState desk
      </p>

      <div className="mx-auto mt-10 max-w-[68ch] space-y-5 font-sans text-[17px] leading-[1.75] text-cream/80">
        <p className="first-letter:float-start first-letter:me-2 first-letter:font-serif first-letter:text-[58px] first-letter:leading-[0.8] first-letter:text-cream">
          {lead}
        </p>
        {rest.map((paragraph, index) => (
          <div key={paragraph}>
            {index === 2 && (
              <blockquote className="my-8 border-s-2 border-gold ps-5 font-serif text-[22px] leading-snug text-cream">
                {pull}
              </blockquote>
            )}
            <p>{paragraph}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-[68ch] border-t border-cream/15 pt-6 font-sans text-[13px] leading-relaxed text-cream/40">
        This desk reports on property and proptech in the UAE. Nothing here is an
        offer, a solicitation, or investment advice. A busy market is not a safe
        one, and a fraction moves with the building.
      </p>

      <section className="mt-14 border-t border-cream/15 pt-8">
        <h2 className="font-sans text-[12px] uppercase tracking-[0.2em] text-cream/40">
          More from the desk
        </h2>
        <ul className="mt-5 grid gap-6 sm:grid-cols-3">
          {related.map((story) => (
            <li key={story.id}>
              <Link href={`/dashboard/news/${story.id}`} className="news-card group">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="aspect-[16/10] w-full object-cover transition duration-500"
                  />
                </div>
                <p className="mt-3 inline-flex rounded-full border border-cream/15 px-2 py-0.5 font-sans text-[11px] uppercase tracking-[0.14em] text-gold/80">
                  {story.section}
                </p>
                <p className="news-card-title mt-2 font-serif text-[18px] leading-snug text-cream transition duration-200">
                  {story.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
