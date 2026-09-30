"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { cn } from "@/lib/cn";
import { money, type UserRole } from "@/lib/dashboard/types";
import { ToastStack } from "@/components/dashboard/ToastStack";

const investorLinks = [
  { href: "/dashboard/account", label: "Account" },
  { href: "/dashboard/explore", label: "Explore" },
  { href: "/dashboard/portfolio", label: "My Portfolio" },
  { href: "/dashboard/news", label: "News" },
  { href: "/dashboard/community", label: "Community" },
  { href: "/dashboard/settings", label: "Settings" },
];

const entrepreneurLinks = [
  { href: "/dashboard/studio/payout", label: "Payout" },
  { href: "/dashboard/studio", label: "Studio" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, state, setRole } = useDashboard();
  const links = role === "entrepreneur" ? entrepreneurLinks : investorLinks;
  const isEntrepreneur = role === "entrepreneur";

  return (
    <ToastStack>
    <div
      data-role={role}
      className="dashboard-shell flex min-h-screen flex-col overflow-x-hidden bg-[#081424] text-cream"
    >
      <header className="sticky top-0 z-30 border-b border-cream/10 bg-[#081424]/90 backdrop-blur-md">
        <div className="flex h-[68px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
          <Link
            href={isEntrepreneur ? "/dashboard/studio" : "/dashboard/explore"}
            prefetch={false}
          >
            <Logo tone={isEntrepreneur ? "navy" : "light"} />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <RoleSwitch
              role={role}
              onChange={(next) => {
                setRole(next);
                router.push(next === "entrepreneur" ? "/dashboard/studio" : "/dashboard/explore");
              }}
            />
            {isEntrepreneur ? (
              <div className="hidden min-h-[40px] items-center rounded-full border border-cream/15 bg-cream/[0.04] px-4 sm:flex">
                <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-cream/45">
                  Desk
                </span>
                <span className="ms-3 font-sans text-[14px] text-cream">Entrepreneur</span>
              </div>
            ) : (
              <div className="hidden min-h-[40px] items-center rounded-full border border-cream/15 bg-cream/[0.04] px-4 sm:flex">
                <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-cream/45">
                  Available
                </span>
                <span className="ms-3 font-sans text-[15px] tabular-nums text-cream">
                  {money(state.profile.virtualBalanceUsd)}
                </span>
              </div>
            )}
            <LanguageSwitcher tone={isEntrepreneur ? "navy" : "light"} compact />
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-w-0 w-full max-w-[1280px] flex-1 gap-6 px-3 py-6 sm:px-6 lg:grid-cols-[248px_1fr] lg:py-8">
        <aside className="min-w-0 lg:sticky lg:top-[92px] lg:self-start">
          <p className="mb-3 hidden px-3 font-sans text-[11px] uppercase tracking-[0.12em] text-gold/60 lg:block">
            {isEntrepreneur ? "Project studio" : "Investor desk"}
          </p>
          <nav aria-label="Dashboard">
            <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-2.5 lg:overflow-visible lg:px-0 lg:pb-0">
              {links.map((link) => {
                const active =
                  link.href === "/dashboard/explore"
                    ? pathname === link.href || pathname.startsWith("/dashboard/projects")
                    : link.href === "/dashboard/studio"
                      ? pathname === link.href
                      : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[48px] items-center rounded-full px-4 font-sans text-[18px] tracking-[0.02em] whitespace-nowrap transition duration-200 sm:px-5 sm:text-[19px] lg:min-h-[52px]",
                        active
                          ? "bg-cream/15 text-cream"
                          : "text-cream/55 hover:bg-cream/[0.06] hover:text-cream",
                      )}
                    >
                      {active ? (
                        <span aria-hidden="true" className="me-2 h-1.5 w-1.5 rounded-full bg-gold" />
                      ) : null}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0 pb-8">{children}</main>
      </div>

      <footer className="mt-auto border-t border-cream/10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-x-5 gap-y-2 px-3 py-3 sm:px-6">
          <Link
            href="/"
            prefetch={false}
            className="font-sans text-[12px] text-cream/40 transition hover:text-cream/70"
          >
            Public site
          </Link>
          <Link
            href="/legal/terms"
            prefetch={false}
            className="font-sans text-[12px] text-cream/40 transition hover:text-cream/70"
          >
            Terms
          </Link>
          <Link
            href="/legal/privacy"
            prefetch={false}
            className="font-sans text-[12px] text-cream/40 transition hover:text-cream/70"
          >
            Privacy
          </Link>
          <Link
            href="/legal/cookies"
            prefetch={false}
            className="font-sans text-[12px] text-cream/40 transition hover:text-cream/70"
          >
            Cookies
          </Link>
        </div>
      </footer>
    </div>
    </ToastStack>
  );
}

function RoleSwitch({
  role,
  onChange,
}: {
  role: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div className="flex rounded-full border border-cream/15 p-0.5" role="group" aria-label="Active desk">
      {(
        [
          ["investor", "Investor"],
          ["entrepreneur", "Entrepreneur"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "min-h-[36px] rounded-full px-2.5 font-sans text-[12px] transition duration-200 sm:px-3 sm:text-[13px]",
            role === value ? "bg-cream text-navy" : "text-cream/60 hover:text-cream",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
