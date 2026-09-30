"use client";

import { useState, type FormEvent } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { loadContact } from "@/lib/dashboard/contact";
import type { KycStatus } from "@/lib/dashboard/types";

const ID_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "emirates_id", label: "Emirates ID" },
  { value: "national_id", label: "National ID" },
] as const;

type IdType = (typeof ID_TYPES)[number]["value"];

function StatusBadge({ status }: { status: KycStatus }) {
  const map: Record<KycStatus, { label: string; className: string }> = {
    unverified: {
      label: "Not verified",
      className: "bg-cream/10 text-cream/60",
    },
    pending: {
      label: "Under review",
      className: "bg-gold/15 text-gold",
    },
    verified: {
      label: "Verified",
      className: "bg-mint/15 text-mint",
    },
    rejected: {
      label: "Rejected",
      className: "bg-[#F3B0A8]/15 text-[#F3B0A8]",
    },
  };
  const { label, className } = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-[12px] font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function KycPanel() {
  const { state, kyc } = useDashboard();
  const kycStatus = state.profile.kycStatus;

  const [phase, setPhase] = useState<"idle" | "form">(
    kycStatus === "unverified" || kycStatus === "rejected" ? "idle" : "idle",
  );
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [idType, setIdType] = useState<IdType>("passport");
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState("");

  function openForm() {
    setFullName("");
    setDateOfBirth("");
    setNationality("");
    setIdType("passport");
    setIdNumber("");
    setError("");
    setPhase("form");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!fullName.trim() || !dateOfBirth || !nationality.trim() || !idNumber.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");

    const fields = {
      fullName: fullName.trim(),
      dateOfBirth,
      nationality: nationality.trim(),
      idType,
      idNumber: idNumber.trim(),
    };

    kyc(fields);

    const contact = loadContact();
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "kyc_submission",
        email: contact?.email ?? null,
        detail: { idType: fields.idType, nationality: fields.nationality },
      }),
    });

    setPhase("idle");
  }

  return (
    <section className="space-y-4 rounded-2xl border border-cream/10 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-[22px] text-cream">Identity verification</h2>
        <StatusBadge status={kycStatus} />
      </div>

      {kycStatus === "verified" && (
        <p className="font-sans text-[14px] leading-relaxed text-cream/60">
          Your identity has been verified. You have full access to the platform.
        </p>
      )}

      {kycStatus === "pending" && (
        <p className="font-sans text-[14px] leading-relaxed text-cream/60">
          Your documents are under review. We&apos;ll notify you as soon as verification
          is complete — typically within 1–2 business days.
        </p>
      )}

      {(kycStatus === "unverified" || kycStatus === "rejected") && phase === "idle" && (
        <>
          {kycStatus === "rejected" && (
            <p className="font-sans text-[14px] leading-relaxed text-[#F3B0A8]/80">
              Your previous submission was not approved. Please check your details and
              try again.
            </p>
          )}
          {kycStatus === "unverified" && (
            <p className="font-sans text-[14px] leading-relaxed text-cream/60">
              Verify your identity to unlock investing. We only ask for the basics —
              no document uploads in the pilot.
            </p>
          )}
          <button
            type="button"
            onClick={openForm}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-cream px-6 font-sans text-[14px] font-medium text-navy transition hover:bg-white"
          >
            {kycStatus === "rejected" ? "Resubmit details" : "Start verification"}
          </button>
        </>
      )}

      {(kycStatus === "unverified" || kycStatus === "rejected") && phase === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-sans text-sm text-cream/70">
            Full name
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="As it appears on your ID"
              className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.04] px-4 font-sans text-[14px] text-cream placeholder:text-cream/35 focus:outline-none focus:ring-1 focus:ring-cream/40"
            />
          </label>

          <label className="block font-sans text-sm text-cream/70">
            Date of birth
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.04] px-4 font-sans text-[14px] text-cream focus:outline-none focus:ring-1 focus:ring-cream/40"
            />
          </label>

          <label className="block font-sans text-sm text-cream/70">
            Nationality
            <input
              type="text"
              autoComplete="country-name"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="e.g. Emirati, British, Indian"
              className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.04] px-4 font-sans text-[14px] text-cream placeholder:text-cream/35 focus:outline-none focus:ring-1 focus:ring-cream/40"
            />
          </label>

          <fieldset className="border-0 p-0">
            <legend className="font-sans text-sm text-cream/70">ID type</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ID_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIdType(value)}
                  className={`min-h-[44px] rounded-full px-5 font-sans text-[14px] transition ${
                    idType === value
                      ? "bg-cream text-navy"
                      : "border border-cream/20 text-cream hover:border-cream/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block font-sans text-sm text-cream/70">
            ID number
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Document number"
              className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.04] px-4 font-sans text-[14px] text-cream placeholder:text-cream/35 focus:outline-none focus:ring-1 focus:ring-cream/40"
            />
          </label>

          {error && (
            <p role="alert" className="font-sans text-[13px] text-[#F3B0A8]">
              {error}
            </p>
          )}

          <p className="font-sans text-[12px] leading-relaxed text-cream/40">
            This is a pilot submission. No documents are sent anywhere — your details
            are stored locally until live verification is enabled.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-cream px-6 font-sans text-[14px] font-medium text-navy transition hover:bg-white"
            >
              Submit for review
            </button>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-cream/20 px-6 font-sans text-[14px] text-cream transition hover:border-cream/40"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
