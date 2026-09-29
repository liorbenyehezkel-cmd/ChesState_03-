"use client";

import { useMemo, useState } from "react";
import { IndexNote } from "@/components/dashboard/IndexNote";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import type { Project } from "@/lib/dashboard/types";

export function ExploreDesk({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");

  const cities = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((item) => item.city)))],
    [projects],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const cityOk = city === "All" || project.city === city;
      if (!needle) return cityOk;
      const haystack = [
        project.title,
        project.city,
        project.neighborhood,
        project.propertyType,
        project.summary,
      ]
        .join(" ")
        .toLowerCase();
      return cityOk && haystack.includes(needle);
    });
  }, [city, projects, query]);

  return (
    <div>
      <PageHeader eyebrow="Marketplace" title="Explore projects">
        Vetted sample raises in the UAE. Each card is a model of how a listing
        would look after licensing — not a live offer.
      </PageHeader>

      <IndexNote />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, city, or type"
            className="dash-input w-full"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by city">
          {cities.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCity(item)}
              className={`min-h-[40px] shrink-0 rounded-full px-4 font-sans text-[13px] transition duration-200 ${
                city === item
                  ? "bg-cream text-navy"
                  : "border border-cream/15 text-cream/65 hover:border-cream/30 hover:text-cream"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="dash-card mt-8 px-5 py-8">
          <p className="font-serif text-[22px] text-cream">No matching listings</p>
          <p className="mt-2 max-w-[42ch] font-sans text-[14px] leading-relaxed text-cream/55">
            Try another city or clear the search. The sample book is still the
            same five UAE projects.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {visible.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
