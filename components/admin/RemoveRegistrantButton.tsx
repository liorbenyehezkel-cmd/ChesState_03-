"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeRegistrant } from "@/app/admin/registrants/actions";

export function RemoveRegistrantButton({ id, label }: { id: string; label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    if (!window.confirm(`Remove ${label}? This permanently deletes the row.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await removeRegistrant(id);
      if (!result.ok) {
        setError(result.error ?? "Could not remove");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-md border border-[#F3B0A8]/30 px-2.5 py-1 font-sans text-[12px] text-[#F3B0A8] transition hover:border-[#F3B0A8]/70 hover:bg-[#F3B0A8]/10 disabled:opacity-50"
      >
        {pending ? "Removing…" : "Remove"}
      </button>
      {error ? <p className="mt-1 font-sans text-[11px] text-[#F3B0A8]">{error}</p> : null}
    </div>
  );
}
