import { notFound } from "next/navigation";
import { MemberProfile } from "@/components/dashboard/MemberProfile";
import { communityPeople, personById } from "@/lib/dashboard/community";

export function generateStaticParams() {
  return communityPeople.map((person) => ({ id: person.id }));
}

export default function MemberPage({ params }: { params: { id: string } }) {
  const person = personById(params.id);
  if (!person) notFound();
  return <MemberProfile person={person} />;
}
