import { redirect } from "next/navigation";

export default function InvestProjectRedirect({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/dashboard/projects/${params.slug}`);
}
