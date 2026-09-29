import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "cream";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center rounded-full font-sans font-medium transition duration-200 ease-out hover:scale-[1.02] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 disabled:hover:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy/90",
  secondary:
    "border border-navy/25 text-navy hover:border-navy/50 hover:bg-navy/[0.03]",
  // For the inverted navy surfaces on the entrepreneur pages.
  cream: "bg-cream text-navy hover:bg-white",
};

const sizes: Record<Size, string> = {
  // min-h keeps tap targets at 44px on touch devices
  sm: "min-h-[44px] px-5 text-sm",
  md: "min-h-[44px] px-6 py-3 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} prefetch={false} className={classes}>
      {children}
    </Link>
  );
}
