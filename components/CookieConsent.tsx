"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "chesstate_cookie_consent_v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  at: string;
};

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function writeConsent(analytics: boolean) {
  const value: Consent = {
    necessary: true,
    analytics: false,
    at: new Date().toISOString(),
  };
  void analytics;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(!readConsent());
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
        <p className="min-w-0 flex-1 font-sans text-[13px] leading-snug text-muted">
          Necessary cookies only — language, session, and security.{" "}
          <Link href="/legal/cookies" className="text-navy underline underline-offset-2">
            Cookie policy
          </Link>
        </p>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => {
            writeConsent(false);
            setOpen(false);
          }}
        >
          OK
        </Button>
      </div>
    </div>,
    document.body,
  );
}
