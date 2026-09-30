import Link from "next/link";
import { notFound } from "next/navigation";
import { YieldBars } from "@/components/dashboard/Charts";
import { InvestFlow } from "@/components/dashboard/InvestFlow";
import { ProjectCover } from "@/components/dashboard/ProjectCard";
import { ProjectDescription } from "@/components/dashboard/ProjectDescription";
import { projectBySlug } from "@/lib/dashboard/projects";
import { daysLeft, fundingPercent, money } from "@/lib/dashboard/types";

export function generateStaticParams() {
  return [
    { slug: "marina-district-residences" },
    { slug: "al-reem-office-yards" },
    { slug: "dubai-hills-courtyard" },
    { slug: "yas-harbour-suites" },
    { slug: "aljada-garden-walk" },
  ];
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projectBySlug(params.slug);
  if (!project) notFound();

  const funded = fundingPercent(project);

  return (
    <div className="space-y-8">
      <Link href="/dashboard/explore" className="font-sans text-[14px] text-cream/50 hover:text-cream">
        All projects
      </Link>

      <ProjectCover title={project.title} city={project.city} image={project.image} size="detail" />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-sans text-[12px] uppercase tracking-[0.12em] text-gold/70">
            {project.neighborhood}, {project.city} · {project.propertyType}
          </p>
          <h1 className="mt-2 font-serif text-[34px] leading-tight tracking-[-0.015em] text-cream">
            {project.title}
          </h1>
          <ProjectDescription description={project.description} story={project.story} />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Fact label="Raised" value={`${funded}%`} />
            <Fact label="Target" value={money(project.targetAmount)} />
            <Fact label="Days left" value={String(daysLeft(project.endDate))} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Fact label="From" value={money(project.minStakeUsd)} />
            <Fact label="Illustrated yield" value={`${project.expectedYield}%`} />
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-cream/10">
            <div className="h-full rounded-full bg-cream" style={{ width: `${funded}%` }} />
          </div>

          <section className="mt-10">
            <h2 className="font-serif text-[22px] text-cream">Illustrated returns</h2>
            <p className="mt-2 font-sans text-[14px] text-cream/50">
              Modelled yearly figures for this sample. They are estimates, not a
              target or a guarantee.
            </p>
            <div className="mt-4 rounded-2xl border border-cream/10 p-4">
              <YieldBars data={project.yieldSeries} />
            </div>
            <div className="mt-4 flex gap-3 rounded-2xl border border-gold/30 bg-gold/[0.06] p-4">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-gold">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14.928 14H1.072L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <div className="space-y-1">
                <p className="font-sans text-[13px] font-medium text-gold">
                  These figures are future estimates, not guarantees.
                </p>
                <p className="font-sans text-[13px] leading-relaxed text-cream/65">
                  All return figures shown are illustrative models based on historical
                  UAE real estate data. They are not a forecast, a promise, or a
                  financial target. Real estate can lose value, projects can miss
                  their dates, and past market conditions do not predict future
                  performance. Do not treat any figure on this page as a plan.
                  Read the full risk disclosures on our public site before registering
                  a request.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-[22px] text-cream">Project updates</h2>
            <ol className="mt-4 space-y-3">
              {project.updates.map((update) => (
                <li key={update.id} className="dash-card p-4">
                  <p className="font-sans text-[12px] text-cream/40">{update.createdAt}</p>
                  <p className="mt-1 font-sans text-[16px] text-cream">{update.title}</p>
                  <p className="mt-2 font-sans text-[14px] leading-relaxed text-cream/55">
                    {update.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div>
          <InvestFlow project={project} />
          <p className="mt-4 text-center font-sans text-[12px] italic text-cream/40">
            Sample listing — not an available investment.
          </p>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="dash-card px-4 py-3">
      <p className="font-sans text-[12px] text-cream/45">{label}</p>
      <p className="mt-1 font-sans text-[18px] text-cream">{value}</p>
    </div>
  );
}
