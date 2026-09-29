"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useWaitlist } from "@/components/WaitlistProvider";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useWaitlist();
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.faq, href: "#faq" },
    { label: t.nav.forEntrepreneurs, href: "/entrepreneurs" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 isolate bg-cream transition duration-300",
        scrolled
          ? "border-b border-border shadow-nav"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label={t.nav.mainLabel}
        className="relative section-shell flex h-[72px] items-center justify-between gap-4"
      >
        <Link href="/" prefetch={false} aria-label={t.nav.home}>
          <Logo />
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <ul className="hidden items-center gap-7 md:flex">
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
          </ul>

          <LanguageSwitcher />

          <Button size="sm" onClick={open}>
            {t.nav.registerInterest}
          </Button>
        </div>
      </nav>
    </header>
  );
}
