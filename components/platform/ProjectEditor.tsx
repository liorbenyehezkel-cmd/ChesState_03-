"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type FormEvent } from "react";
import { FundingField } from "@/components/entrepreneurs/FundingField";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { propertyTypeKeys } from "@/lib/i18n/types";
import type { Project } from "@/lib/platform/types";
import { neighborhoodsFor, uaeCities } from "@/lib/uae-locations";
import { FieldShell, fieldClass, selectClass, SelectChevron } from "./fields";

type Status = "idle" | "saving" | "saved" | "error";

export function ProjectEditor({
  project,
  isPreview,
}: {
  project: Project;
  isPreview: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();

  const [projectName, setProjectName] = useState(project.projectName ?? "");
  const [description, setDescription] = useState(project.description ?? "");
  const [propertyType, setPropertyType] = useState(project.propertyType ?? "");
  const [funding, setFunding] = useState(
    project.fundingTargetUsd === null ? "" : String(project.fundingTargetUsd),
  );
  const [totalValue, setTotalValue] = useState(
    project.totalValueUsd === null ? "" : String(project.totalValueUsd),
  );
  const [timeline, setTimeline] = useState(
    project.timelineMonths === null ? "" : String(project.timelineMonths),
  );
  const [city, setCity] = useState(project.city ?? "");
  const [neighborhood, setNeighborhood] = useState(project.neighborhood ?? "");
  const [status, setStatus] = useState<Status>("idle");

  const nameId = useId();
  const descriptionId = useId();
  const propertyTypeId = useId();
  const totalValueId = useId();
  const timelineId = useId();
  const cityId = useId();
  const neighborhoodId = useId();

  const neighborhoods = useMemo(() => neighborhoodsFor(city), [city]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPreview) return;

    setStatus("saving");

    try {
      const response = await fetch("/api/platform/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectName.trim() || null,
          description: description.trim() || null,
          propertyType: propertyType || null,
          fundingTargetUsd: funding === "" ? null : Number(funding),
          totalValueUsd: totalValue === "" ? null : Number(totalValue),
          timelineMonths: timeline === "" ? null : Number(timeline),
          city: city || null,
          neighborhood: neighborhood || null,
        }),
      });

      if (!response.ok) throw new Error("save failed");

      setStatus("saved");
      router.refresh();
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FieldShell label={t.platform.project.nameLabel} htmlFor={nameId}>
        <input
          id={nameId}
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          placeholder={t.platform.project.namePlaceholder}
          className={fieldClass}
        />
      </FieldShell>

      <FieldShell
        label={t.platform.project.descriptionLabel}
        htmlFor={descriptionId}
        help={t.platform.project.descriptionHelp}
      >
        <textarea
          id={descriptionId}
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t.platform.project.descriptionPlaceholder}
          className="w-full rounded-2xl border border-cream/20 bg-cream/[0.06] px-4 py-3 text-start font-sans text-[15px] leading-relaxed text-cream placeholder:text-cream/35 focus:border-cream/50 focus:bg-cream/10"
        />
      </FieldShell>

      <FieldShell
        label={t.entrepreneurs.propertyTypeLabel}
        htmlFor={propertyTypeId}
      >
        <div className="relative">
          <select
            id={propertyTypeId}
            value={propertyType}
            onChange={(event) => setPropertyType(event.target.value)}
            className={selectClass}
          >
            <option value="">{t.entrepreneurs.propertyTypePlaceholder}</option>
            {propertyTypeKeys.map((key) => (
              <option key={key} value={key}>
                {t.entrepreneurs.propertyTypes[key]}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
      </FieldShell>

      <FundingField value={funding} onChange={setFunding} showOptional={false} />

      <div className="grid gap-8 sm:grid-cols-2">
        <FieldShell
          label={t.platform.project.totalValueLabel}
          htmlFor={totalValueId}
          help={t.platform.project.totalValueHelp}
        >
          <input
            id={totalValueId}
            type="number"
            min={0}
            step={50_000}
            dir="ltr"
            value={totalValue}
            onChange={(event) => setTotalValue(event.target.value)}
            placeholder="11,500,000"
            className={fieldClass}
          />
        </FieldShell>

        <FieldShell
          label={t.platform.project.timelineLabel}
          htmlFor={timelineId}
          help={t.platform.project.timelineHelp}
        >
          <input
            id={timelineId}
            type="number"
            min={1}
            max={600}
            dir="ltr"
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            placeholder="24"
            className={fieldClass}
          />
        </FieldShell>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <FieldShell label={t.entrepreneurs.cityLabel} htmlFor={cityId}>
          <div className="relative">
            <select
              id={cityId}
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                setNeighborhood("");
              }}
              className={selectClass}
            >
              <option value="">{t.entrepreneurs.cityPlaceholder}</option>
              {uaeCities.map((entry) => (
                <option key={entry.city} value={entry.city}>
                  {entry.city}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FieldShell>

        <FieldShell
          label={t.entrepreneurs.neighborhoodLabel}
          htmlFor={neighborhoodId}
        >
          <div className="relative">
            <select
              id={neighborhoodId}
              value={neighborhood}
              disabled={city === ""}
              onChange={(event) => setNeighborhood(event.target.value)}
              className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">
                {city === ""
                  ? t.entrepreneurs.neighborhoodPickCityFirst
                  : t.entrepreneurs.neighborhoodPlaceholder}
              </option>
              {neighborhoods.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FieldShell>
      </div>

      <SaveRow status={status} isPreview={isPreview} />
    </form>
  );
}

export function SaveRow({
  status,
  isPreview,
}: {
  status: "idle" | "saving" | "saved" | "error";
  isPreview: boolean;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-cream/10 pt-6">
      <Button type="submit" variant="cream" disabled={isPreview || status === "saving"}>
        {status === "saving" ? t.platform.saving : t.platform.save}
      </Button>

      {isPreview && (
        <p className="font-sans text-[14px] text-cream/50">
          {t.platform.readOnlyInPreview}
        </p>
      )}
      {status === "saved" && (
        <p role="status" className="font-sans text-[14px] text-[#8FD8C2]">
          {t.platform.saved}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="font-sans text-[14px] text-[#F3B0A8]">
          {t.platform.saveError}
        </p>
      )}
    </div>
  );
}
