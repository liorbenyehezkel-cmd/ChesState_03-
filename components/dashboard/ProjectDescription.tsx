"use client";

import { useState } from "react";

export function ProjectDescription({
  description,
  story,
}: {
  description: string;
  story: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <p className="font-sans text-[16px] leading-relaxed text-cream/65">{description}</p>
      {open && (
        <p className="mt-3 max-w-[68ch] font-sans text-[16px] leading-relaxed text-cream/75">
          {story}
        </p>
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="mt-2 font-sans text-[14px] text-cream/70 underline decoration-cream/30 underline-offset-4 hover:text-cream"
      >
        {open ? "less" : "more…"}
      </button>
    </div>
  );
}
