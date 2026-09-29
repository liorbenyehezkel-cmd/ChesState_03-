"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export function InvestNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  const links = [
    { href: "/invest", label: t.invest.nav.projects },
    { href: "/invest/portfolio", label: t.invest.nav.portfolio },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-cream/90 backdrop-blur-md">
      <nav
        aria-label={t.invest.nav.sectionLabel}
        className="section-shell flex h-[72px] items-center justify-between gap-4"
      >
        <Link href="/invest" prefetch={false} aria-label={t.nav.home}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-6 sm:flex">
          {links.map((link) => {
            const isActive =
              link.href === "/invest"
                ? pathname === "/invest" ||
                  (pathname.startsWith("/invest/") &&
                    !pathname.startsWith("/invest/portfolio"))
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "font-sans text-[15px] transition",
                    isActive ? "text-navy" : "text-muted hover:text-navy",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/invest/portfolio"
            className="font-sans text-[15px] text-muted sm:hidden"
          >
            {t.invest.nav.portfolio}
          </Link>
          <LanguageSwitcher />
          <Link
            href="/"
            className="hidden min-h-[44px] items-center rounded-full border border-border px-4 font-sans text-[15px] text-navy transition hover:border-navy/40 md:inline-flex"
          >
            {t.invest.nav.backToSite}
          </Link>
        </div>
      </nav>
    </header>
  );
}
