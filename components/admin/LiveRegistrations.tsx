"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { REGISTRATIONS_TABLE } from "@/lib/supabase/tables";
import { createBrowserSupabase } from "@/lib/supabase/browser";

/**
 * Subscribes to Realtime changes on `public.registrations` (new signups and
 * messages sent via customer service) and re-runs the server render so every
 * table on the page stays in sync. Renders nothing.
 */
export function LiveRegistrations() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 300);
    };

    const channel = supabase
      .channel("admin-registrations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: REGISTRATIONS_TABLE },
        refresh,
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("[admin] registrations realtime:", status, err);
        }
      });

    return () => {
      clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
