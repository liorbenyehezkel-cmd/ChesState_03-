"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import type { Milestone } from "@/lib/platform/types";
import { fieldClass } from "./fields";
import { SaveRow } from "./ProjectEditor";

type Draft = Milestone & { key: string };

type Status = "idle" | "saving" | "saved" | "error";

let nextKey = 0;

function toDraft(milestone: Milestone): Draft {
  return { ...milestone, key: `existing-${milestone.id}` };
}

export function MilestoneEditor({
  milestones,
  isPreview,
}: {
  milestones: Milestone[];
  isPreview: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();

  const [drafts, setDrafts] = useState<Draft[]>(() => milestones.map(toDraft));
  const [status, setStatus] = useState<Status>("idle");

  const allocated = drafts.reduce(
    (total, draft) => total + (Number(draft.releasePercent) || 0),
    0,
  );
  const isOverAllocated = allocated > 100;

  function update(key: string, patch: Partial<Draft>) {
    setDrafts((current) =>
      current.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft)),
    );
  }

  function add() {
    nextKey += 1;
    setDrafts((current) => [
      ...current,
      {
        key: `new-${nextKey}`,
        id: "",
        title: "",
        description: null,
        targetDate: null,
        // Offer whatever is left of the raise, so the total tends toward 100.
        releasePercent: Math.max(0, 100 - allocated),
      },
    ]);
  }

  function remove(key: string) {
    setDrafts((current) => current.filter((draft) => draft.key !== key));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPreview || isOverAllocated) return;

    setStatus("saving");

    try {
      const response = await fetch("/api/platform/milestones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestones: drafts
            .filter((draft) => draft.title.trim() !== "")
            .map((draft) => ({
              title: draft.title.trim(),
              description: draft.description?.trim() || null,
              targetDate: draft.targetDate || null,
              releasePercent: Number(draft.releasePercent) || 0,
            })),
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-cream/12 bg-cream/[0.05] px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-sans text-[14px] text-cream/60">
            {t.platform.milestones.allocated}
          </span>
          <span
            className={`font-sans text-[16px] font-medium tabular-nums ${
              isOverAllocated ? "text-[#F3B0A8]" : "text-cream"
            }`}
          >
            {allocated}%
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream/15">
          <div
            className={`h-full rounded-full transition-all ${
              isOverAllocated ? "bg-[#F3B0A8]" : "bg-cream"
            }`}
            style={{ width: `${Math.min(allocated, 100)}%` }}
          />
        </div>
        {isOverAllocated && (
          <p role="alert" className="mt-3 font-sans text-[14px] text-[#F3B0A8]">
            {t.platform.milestones.over100}
          </p>
        )}
      </div>

      {drafts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cream/20 px-5 py-8 text-center font-sans text-[15px] text-cream/50">
          {t.platform.milestones.empty}
        </p>
      ) : (
        <ol className="space-y-5">
          {drafts.map((draft, index) => (
            <li
              key={draft.key}
              className="rounded-2xl border border-cream/12 bg-cream/[0.05] p-5 sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="eyebrow text-cream/45">
                  {t.platform.milestones.milestoneNumber} {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(draft.key)}
                  className="min-h-[44px] rounded-full px-3 font-sans text-[14px] text-cream/50 transition hover:text-[#F3B0A8]"
                >
                  {t.platform.milestones.remove}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-cream">
                    {t.platform.milestones.titleLabel}
                  </label>
                  <input
                    value={draft.title}
                    onChange={(event) => update(draft.key, { title: event.target.value })}
                    placeholder={t.platform.milestones.titlePlaceholder}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-cream">
                    {t.platform.milestones.descriptionLabel}
                  </label>
                  <input
                    value={draft.description ?? ""}
                    onChange={(event) =>
                      update(draft.key, { description: event.target.value })
                    }
                    placeholder={t.platform.milestones.descriptionPlaceholder}
                    className={fieldClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-sans text-sm font-medium text-cream">
                      {t.platform.milestones.dateLabel}
                    </label>
                    <input
                      type="date"
                      dir="ltr"
                      value={draft.targetDate ?? ""}
                      onChange={(event) =>
                        update(draft.key, { targetDate: event.target.value || null })
                      }
                      className={`${fieldClass} [color-scheme:dark]`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-sans text-sm font-medium text-cream">
                      {t.platform.milestones.releaseLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        dir="ltr"
                        value={draft.releasePercent}
                        onChange={(event) =>
                          update(draft.key, {
                            releasePercent: Number(event.target.value),
                          })
                        }
                        className={`${fieldClass} pe-10`}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 font-sans text-[15px] text-cream/45"
                      >
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={add}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-dashed border-cream/25 font-sans text-[15px] text-cream/70 transition hover:border-cream/50 hover:text-cream"
      >
        <span aria-hidden="true">+</span>
        {t.platform.milestones.add}
      </button>

      <SaveRow status={status} isPreview={isPreview} />
    </form>
  );
}
