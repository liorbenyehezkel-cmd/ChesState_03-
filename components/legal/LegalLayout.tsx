import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WaitlistProvider } from "@/components/WaitlistProvider";
import { company } from "@/lib/legal/company";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <WaitlistProvider>
      <Navbar />
      <main className="section-shell pb-20 pt-12 sm:pt-16">
        <p className="eyebrow text-muted">{company.name}</p>
        <h1 className="mt-3 max-w-[22ch] font-serif text-[32px] leading-tight tracking-[-0.01em] sm:text-[42px]">
          {title}
        </h1>
        <p className="mt-3 font-sans text-[13px] text-muted">Last updated {updated}</p>
        <div className="mt-10 max-w-[68ch] space-y-5 font-sans text-[16px] leading-relaxed text-navy/85">
          {children}
        </div>
        <p className="mt-12 max-w-[68ch] font-sans text-[13px] leading-relaxed text-muted">
          These pages describe how ChesState currently operates. They are not
          legal advice. Have UAE counsel review them before you treat them as
          a binding public filing.{" "}
          <Link href="/legal/terms" className="underline underline-offset-2">
            Terms
          </Link>
          {" · "}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            Privacy
          </Link>
          {" · "}
          <Link href="/legal/cookies" className="underline underline-offset-2">
            Cookies
          </Link>
          {" · "}
          <Link href="/legal/refunds" className="underline underline-offset-2">
            Refunds
          </Link>
        </p>
      </main>
      <Footer />
    </WaitlistProvider>
  );
}
