"use client";

import Link from "next/link";
import { daysLeft, fundingPercent, money, type Project } from "@/lib/dashboard/types";

export function ProjectCard({ project }: { project: Project }) {
  const funded = fundingPercent(project);
  const remaining = daysLeft(project.endDate);

  return (
    <Link
      href={`/dashboard/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.04] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-cream/25 hover:bg-cream/[0.06] hover:shadow-[0_18px_40px_-24px_rgba(248,246,240,0.28)]"
    >
      <ProjectCover title={project.title} city={project.city} image={project.image} />
      <div className="flex flex-1 flex-col p-5">
        <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-cream/55">
          {project.neighborhood}, {project.city}
        </p>
        <h2 className="mt-2 font-serif text-[22px] leading-tight tracking-[-0.01em] text-cream">
          {project.title}
        </h2>
        <p className="mt-2 flex-1 font-sans text-[14px] leading-relaxed text-cream/60">
          {project.summary}
        </p>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-cream/10 pt-4">
          <Metric label="From" value={money(project.minStakeUsd)} />
          <Metric label="Illustrated yield" value={`${project.expectedYield}%`} />
          <Metric label="Time left" value={remaining === 0 ? "Closed" : `${remaining}d`} />
        </dl>

        <div className="mt-4">
          <div className="flex justify-between font-sans text-[12px] text-cream/50">
            <span>
              {funded}% of {money(project.targetAmount)}
            </span>
            <span>{project.propertyType}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
            <div
              className="h-full rounded-full bg-cream transition-[width] duration-500"
              style={{ width: `${funded}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-[11px] uppercase tracking-[0.08em] text-cream/40">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-[14px] tabular-nums text-cream">{value}</dd>
    </div>
  );
}

export function ProjectCover({
  title,
  city,
  image,
  size = "card",
}: {
  title: string;
  city: string;
  image?: string;
  size?: "card" | "detail";
}) {
  return (
    <div
      className={`relative overflow-hidden bg-navy ${
        size === "detail" ? "h-56 sm:h-72" : "h-52 sm:h-56"
      }`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={`${title} in ${city}`}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-[#081424] via-[#081424]/25 to-transparent" />
      <div className="absolute bottom-4 start-5">
        <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-gold/80">
          {city}
        </p>
        {size === "detail" ? (
          <p className="mt-1 max-w-[28ch] font-serif text-[22px] text-cream">{title}</p>
        ) : null}
      </div>
    </div>
  );
}
