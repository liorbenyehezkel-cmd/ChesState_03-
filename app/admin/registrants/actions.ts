"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAdminAuthorization } from "@/lib/admin/auth";
import { deleteRegistration } from "@/lib/supabase/registrations";

export async function removeRegistrant(id: string) {
  // The middleware already guards /admin, but a server action changes data,
  // so check the password again here.
  if (!isAdminAuthorization(headers().get("authorization"))) {
    return { ok: false as const, error: "Not authorized" };
  }
  if (typeof id !== "string" || !id.trim()) {
    return { ok: false as const, error: "Missing registrant id" };
  }

  const result = await deleteRegistration(id);
  if (result.ok) revalidatePath("/admin/registrants");
  return result;
}
