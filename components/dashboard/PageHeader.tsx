import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header>
      <p className="eyebrow text-gold/70">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-[32px] tracking-[-0.01em] text-cream sm:text-[38px]">
        {title}
      </h1>
      {children ? (
        <div className="mt-3 max-w-[56ch] font-sans text-[15px] leading-relaxed text-cream/55">
          {children}
        </div>
      ) : null}
    </header>
  );
}
