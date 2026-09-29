import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = {
  children: ReactNode;
  /** Renders a small mint dot before the label. */
  dot?: boolean;
  tone?: "neutral" | "mint";
  className?: string;
};

export function Badge({
  children,
  dot = false,
  tone = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium",
        tone === "mint"
          ? "border-mint/25 bg-mint/10 text-mint-ink"
          : "border-border bg-white/70 text-muted",
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-mint"
        />
      )}
      {children}
    </span>
  );
}
