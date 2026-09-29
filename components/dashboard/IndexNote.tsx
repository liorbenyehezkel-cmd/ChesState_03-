"use client";

import { useState } from "react";
import { indexIntro, indexNotice } from "@/lib/dashboard/indexCopy";

export function IndexNote() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-cream/15 bg-transparent px-5 font-sans text-[16px] text-cream/80 transition duration-200 hover:border-cream/30 hover:text-cream sm:min-h-[52px] sm:px-6 sm:text-[17px]"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full border border-gold/50 font-serif text-[14px] text-gold">
          i
        </span>
        Index Button
      </button>
      {open && (
        <div className="mt-4 max-w-[68ch] rounded-2xl border border-gold/25 bg-gold/[0.06] p-5 sm:p-6">
          <h2 className="font-serif text-[22px] text-cream">Index note</h2>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-cream/75">{indexIntro}</p>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-cream/70">{indexNotice}</p>
        </div>
      )}
    </div>
  );
}
