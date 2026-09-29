"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useI18n } from "@/lib/i18n/provider";
import { company } from "@/lib/legal/company";

export function Footer() {
  const { t } = useI18n();

  const navLinks = [
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.faq, href: "#faq" },
    { label: t.nav.forEntrepreneurs, href: "/entrepreneurs" },
  ];

  return (
    <footer className="border-t border-border bg-cream">
      <div className="section-shell py-12 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-[42ch] font-sans text-sm leading-relaxed text-muted">
              {t.footer.tagline}
            </p>
            <p className="mt-3 max-w-[42ch] font-sans text-[12px] leading-relaxed text-muted">
              {company.name} · {company.jurisdiction} · {company.legalEmail}
              <br />
              {company.licensing}
            </p>
          </div>

          <nav aria-label={t.nav.footerLabel}>
            <ul className="flex flex-col gap-3 sm:items-end">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("#") ? (
                    <a
                      href={link.href}
                      className="font-sans text-[15px] text-muted transition hover:text-navy"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="font-sans text-[15px] text-muted transition hover:text-navy"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard/explore"
                  className="font-sans text-[15px] text-muted transition hover:text-navy"
                >
                  {t.footer.platform}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="font-sans text-[15px] text-muted transition hover:text-navy">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="font-sans text-[15px] text-muted transition hover:text-navy">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="font-sans text-[15px] text-muted transition hover:text-navy">
                  {t.footer.cookies}
                </Link>
              </li>
              <li>
                <Link href="/legal/refunds" className="font-sans text-[15px] text-muted transition hover:text-navy">
                  {t.footer.refunds}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
