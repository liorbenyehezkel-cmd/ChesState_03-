import { redirect } from "next/navigation";

/** The dashboard grew into the platform; keep old links working. */
export default function EntrepreneurDashboardPage() {
  redirect("/dashboard/studio");
}
