import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";
import { Shell } from "@/components/dashboard/Shell";
import { ROLE_COOKIE, type UserRole } from "@/lib/dashboard/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "ChesState",
    template: "%s · ChesState",
  },
  applicationName: "ChesState",
  metadataBase: new URL("https://chesstate.com"),
  alternates: { canonical: "https://chesstate.com" },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const roleCookie = cookies().get(ROLE_COOKIE)?.value;
  const role: UserRole = roleCookie === "entrepreneur" ? "entrepreneur" : "investor";

  return (
    <DashboardProvider initialRole={role}>
      <Shell>{children}</Shell>
    </DashboardProvider>
  );
}
