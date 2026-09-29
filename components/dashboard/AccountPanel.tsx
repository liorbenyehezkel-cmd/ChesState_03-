"use client";

import { useEffect, useState } from "react";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import {
  avatarPresets,
  defaultAccount,
  loadAccount,
  saveAccount,
  usernameOf,
  type AccountProfile,
} from "@/lib/dashboard/account";
import { loadContact, type SavedContact } from "@/lib/dashboard/contact";
import { countryByIso, flagSrc } from "@/lib/phone";

import { SITE_URL } from "@/lib/site";

const SHARE_TEXT =
  "Join me on ChesState — fractional access to vetted property projects in the UAE.";

export function AccountPanel() {
  const { role, state } = useDashboard();
  const [profile, setProfile] = useState<AccountProfile>(defaultAccount);
  const [contact, setContact] = useState<SavedContact | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setProfile(loadAccount());
    setContact(loadContact());
    setReady(true);
  }, []);

  function update(next: AccountProfile) {
    setProfile(next);
    saveAccount(next);
  }

  const country = countryByIso(contact?.iso);
  const flag = country ? flagSrc(country.iso) : null;
  const showingFlag = !profile.photo && profile.avatarId === "flag" && Boolean(flag);
  const preset = avatarPresets.find((item) => item.id === profile.avatarId) ?? avatarPresets[0];
  const username = usernameOf(profile);
  const initials = username
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    const photo = await resizePhoto(file);
    update({ ...profile, photo, avatarId: "upload" });
  }

  async function shareSite() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ChesState",
          text: SHARE_TEXT,
          url: SITE_URL,
        });
        return;
      }
    } catch {
      /* user cancelled or share failed */
    }

    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${SITE_URL}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:?subject=${encodeURIComponent("Join me on ChesState")}&body=${encodeURIComponent(`${SHARE_TEXT} ${SITE_URL}`)}`;
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold/70">
          {role === "entrepreneur" ? "Entrepreneur desk" : "Investor desk"}
        </p>
        <h1 className="mt-3 font-serif text-[32px] tracking-[-0.01em] text-cream sm:text-[38px]">
          Account
        </h1>
      </header>

      <section className="space-y-4 rounded-2xl border border-cream/10 p-5 sm:p-6">
        <h2 className="font-serif text-[22px] text-cream">Profile</h2>
        <label className="block font-sans text-sm text-cream/70">
          Username
          <input
            value={ready ? profile.name : ""}
            onChange={(event) => update({ ...profile, name: event.target.value })}
            placeholder="Choose a username"
            className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-cream/[0.04] px-4 text-cream placeholder:text-cream/35"
          />
        </label>
        <p className="font-sans text-[13px] leading-relaxed text-cream/45">
          This is how other members will see you in Community and across the platform.
        </p>
        <div>
          <p className="font-sans text-sm text-cream/70">Who can open this profile</p>
          <div className="mt-2 flex gap-2">
            {(["public", "private"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ ...profile, visibility: value })}
                className={`min-h-[44px] rounded-full px-5 font-sans text-[14px] capitalize ${
                  profile.visibility === value
                    ? "bg-cream text-navy"
                    : "border border-cream/20 text-cream"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-5 rounded-2xl border border-cream/10 p-5">
        <div>
          <p className="eyebrow text-cream/45">You</p>
          <div className="mt-3 flex flex-wrap items-center gap-5">
            {showingFlag && flag ? (
              <img
                src={flag}
                alt=""
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            ) : (
              <AvatarMark
                initials={initials}
                from={preset.from}
                to={preset.to}
                photo={profile.photo}
                size={72}
              />
            )}
            <div>
              <p className="font-serif text-[24px] text-cream">{username}</p>
              <p className="font-sans text-[14px] text-cream/50">
                {contact?.email || state.profile.email}
              </p>
              <p className="mt-1 font-sans text-[13px] text-cream/45">
                {country
                  ? country.name
                  : "Country flag appears after you add a mobile number"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-cream/10 p-5 sm:p-6">
        <h2 className="font-serif text-[22px] text-cream">Picture</h2>
        <p className="font-sans text-[14px] leading-relaxed text-cream/55">
          {country
            ? `The default is the ${country.name} flag, from the country code on your mobile number.`
            : "Add a mobile number when you register and your country flag becomes the default picture."}
        </p>
        {flag && (
          <button
            type="button"
            aria-pressed={showingFlag}
            onClick={() => update({ ...profile, avatarId: "flag", photo: null })}
            className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 ${
              showingFlag ? "border-cream" : "border-cream/20"
            }`}
          >
            <img src={flag} alt="" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-sans text-[14px] text-cream">{country?.name} flag</span>
          </button>
        )}
        <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-cream/20 px-5 font-sans text-[14px] text-cream">
          Upload from your gallery
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              void onPhoto(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {profile.photo && (
          <button
            type="button"
            onClick={() => update({ ...profile, photo: null, avatarId: "flag" })}
            className="ms-3 font-sans text-[13px] text-cream/50 underline underline-offset-4"
          >
            Use country flag
          </button>
        )}
        <div className="flex flex-wrap gap-3">
          {avatarPresets.map((item) => {
            const selected = profile.avatarId === item.id && !profile.photo;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={selected}
                onClick={() => update({ ...profile, avatarId: item.id, photo: null })}
                className={`rounded-full p-1 ${selected ? "ring-2 ring-cream" : ""}`}
              >
                <AvatarMark initials={item.label.slice(0, 1)} from={item.from} to={item.to} size={48} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-cream/10 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-[22px] text-cream">Level 0</h2>
          <p className="font-sans text-[13px] text-cream/45">0–100</p>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-cream/10"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-label="Investor level"
        >
          <div className="h-full w-0 rounded-full bg-cream" />
        </div>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-cream/70">
          Let&apos;s start investing to level up your account.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-cream/10 p-5 sm:p-6">
        <h2 className="font-serif text-[22px] text-cream">Share ChesState</h2>
        <p className="font-sans text-[14px] leading-relaxed text-cream/55">
          Send the site link — {SITE_URL.replace("https://", "")} — to someone on
          your phone or by email.
        </p>
        <button
          type="button"
          onClick={() => void shareSite()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-cream px-6 font-sans text-[14px] font-medium text-navy transition hover:bg-white"
        >
          Send site link
        </button>
        {copied ? (
          <p role="status" className="font-sans text-[13px] text-cream/70">
            Link copied: {SITE_URL}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function resizePhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        const scale = Math.max(size / image.width, size / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
