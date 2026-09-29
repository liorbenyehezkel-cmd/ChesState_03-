"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export function PlatformNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  const links = [
    { href: "/platform", label: t.platform.nav.overview, icon: GridIcon },
    { href: "/platform/project", label: t.platform.nav.project, icon: BuildingIcon },
    {
      href: "/platform/milestones",
      label: t.platform.nav.milestones,
      icon: FlagIcon,
    },
    { href: "/platform/settings", label: t.platform.nav.settings, icon: GearIcon },
  ];

  return (
    <nav aria-label={t.platform.nav.sectionLabel}>
      {/* Horizontal strip on mobile, vertical rail from lg up. */}
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/platform" ? pathname === href : pathname.startsWith(href);

          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-full px-4 font-sans text-[15px] transition lg:w-full",
                  isActive
                    ? "bg-cream/15 text-cream"
                    : "text-cream/60 hover:bg-cream/[0.07] hover:text-cream",
                )}
              >
                <Icon />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const iconProps = {
  width: 17,
  height: 17,
  viewBox: "0 0 20 20",
  fill: "none",
  "aria-hidden": true,
  className: "shrink-0",
} as const;

function GridIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M3.5 17.5V4.2c0-.4.3-.7.7-.7h7c.4 0 .7.3.7.7v13.3M11.9 8.5h4.4c.4 0 .7.3.7.7v8.3M2 17.5h16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 7h3M6 10.5h3M6 14h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M4.5 17.5V3.2M4.5 4.2h9.8l-1.8 3.3 1.8 3.3H4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 2.5l1.2 1.9 2.2-.5.4 2.2 2 1-1 2 1 2-2 1-.4 2.2-2.2-.5L10 17.5l-1.2-1.9-2.2.5-.4-2.2-2-1 1-2-1-2 2-1 .4-2.2 2.2.5L10 2.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
