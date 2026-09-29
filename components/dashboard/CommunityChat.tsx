"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import {
  avatarPresets,
  defaultAccount,
  loadAccount,
  usernameOf,
  type AccountProfile,
} from "@/lib/dashboard/account";
import {
  personById,
  starterMessages,
  type CommunityMessage,
} from "@/lib/dashboard/community";

const KEY = "chesstate_community_v3";

type StoredMessage = CommunityMessage & { mine?: boolean; body: string };

export function CommunityChat() {
  const [messages, setMessages] = useState<StoredMessage[]>(starterMessages);
  const [draft, setDraft] = useState("");
  const [account, setAccount] = useState<AccountProfile>(defaultAccount);

  useEffect(() => {
    setAccount(loadAccount());
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setMessages(JSON.parse(saved) as StoredMessage[]);
    } catch {
      /* starter thread */
    }
  }, []);

  function send(event: FormEvent) {
    event.preventDefault();
  }

  const preset = avatarPresets.find((item) => item.id === account.avatarId) ?? avatarPresets[0];
  const username = usernameOf(account);
  const youInitials = username
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow text-gold/70">Investor desk</p>
        <h1 className="mt-3 font-serif text-[32px] tracking-[-0.01em] text-cream sm:text-[38px]">
          Community
        </h1>
        <p className="mt-3 max-w-[56ch] font-sans text-[15px] text-cream/55">
          A sample room for the pilot. The names, messages, and holdings below
          are illustrative — not real investors or reviews.
        </p>
      </header>

      <ol className="space-y-4" aria-label="Messages">
        {messages.map((message) => {
          if (message.mine || message.personId === "you") {
            return (
              <li key={message.id} className="dash-card px-5 py-5">
                <MessageHead
                  name={username}
                  at={message.at}
                  initials={youInitials}
                  from={preset.from}
                  to={preset.to}
                  photo={account.photo}
                  href={account.visibility === "public" ? "/dashboard/account" : undefined}
                />
                <p className="mt-4 font-sans text-[15px] leading-relaxed text-cream">{message.body}</p>
              </li>
            );
          }

          const person = personById(message.personId);
          if (!person) return null;
          return (
            <li key={message.id} className="dash-card px-5 py-5">
              <MessageHead
                name={person.name}
                at={message.at}
                initials={person.initials}
                from={person.from}
                to={person.to}
                photo={person.photo}
                href={`/dashboard/community/people/${person.id}`}
              />
              <p className="mt-4 font-sans text-[15px] leading-relaxed text-cream">{message.body}</p>
              {message.image && (
                <img
                  src={message.image}
                  alt="Sample community photograph"
                  className="mt-3 max-h-64 w-full rounded-xl object-cover"
                />
              )}
            </li>
          );
        })}
      </ol>

      <form onSubmit={send} className="relative">
        <label className="sr-only" htmlFor="community-draft">
          Message
        </label>
        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-cream/70" aria-hidden>
          <LockIcon />
        </span>
        <input
          id="community-draft"
          value={draft}
          disabled
          readOnly
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Locked , Make your first purchase to unlock the chat"
          className="min-h-[52px] w-full rounded-full border border-cream/20 bg-cream/[0.04] ps-12 pe-4 text-[13px] text-cream opacity-70 placeholder:text-cream/55 sm:text-[15px]"
        />
      </form>
    </div>
  );
}

function MessageHead({
  name,
  at,
  initials,
  from,
  to,
  photo,
  href,
}: {
  name: string;
  at: string;
  initials: string;
  from: string;
  to: string;
  photo?: string | null;
  href?: string;
}) {
  const stamp = new Date(at).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const body = (
    <span className="flex items-center gap-3">
      <AvatarMark initials={initials} from={from} to={to} photo={photo} />
      <span>
        <span className="block font-sans text-[15px] text-cream">{name}</span>
        <span className="block font-sans text-[12px] text-cream/65">{stamp}</span>
      </span>
    </span>
  );

  if (!href) return body;
  return (
    <Link href={href} className="inline-flex rounded-full hover:opacity-80">
      {body}
    </Link>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 8V5.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
