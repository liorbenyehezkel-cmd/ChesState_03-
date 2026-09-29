"use client";

import { cn } from "@/lib/cn";

export function Logo({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/chesstate-king.jpg"
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-[12px] object-cover sm:h-11 sm:w-11"
      />
      <span
        className={cn(
          "font-sans text-[18px] font-semibold tracking-[-0.01em] sm:text-[19px]",
          tone === "navy" ? "text-navy" : "text-white",
        )}
      >
        ChesState
      </span>
    </span>
  );
}
