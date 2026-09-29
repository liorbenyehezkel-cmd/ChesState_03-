"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useDashboard } from "@/components/dashboard/DashboardProvider";

const KEY = "chesstate_a11y";

type A11y = {
  text: "default" | "large" | "xlarge";
  contrast: boolean;
  motion: boolean;
  links: boolean;
  spacing: boolean;
  focus: boolean;
  readable: boolean;
};

const defaults: A11y = {
  text: "default",
  contrast: false,
  motion: false,
  links: false,
  spacing: false,
  focus: true,
  readable: false,
};

function apply(prefs: A11y) {
  const root = document.documentElement;
  root.dataset.a11yText = prefs.text;
  root.dataset.a11yContrast = prefs.contrast ? "on" : "off";
  root.dataset.a11yMotion = prefs.motion ? "reduce" : "off";
  root.dataset.a11yLinks = prefs.links ? "on" : "off";
  root.dataset.a11ySpacing = prefs.spacing ? "roomy" : "off";
  root.dataset.a11yFocus = prefs.focus ? "strong" : "off";
  root.dataset.a11yFont = prefs.readable ? "readable" : "off";
}

export function SettingsPanel() {
  const { role, state } = useDashboard();
  const [prefs, setPrefs] = useState<A11y>(defaults);
  const [topic, setTopic] = useState("account");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = { ...defaults, ...(JSON.parse(saved) as A11y) };
        setPrefs(parsed);
        apply(parsed);
        return;
      }
    } catch {
      /* keep defaults */
    }
    apply(defaults);
  }, []);

  function update(next: A11y) {
    setPrefs(next);
    apply(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function submitSupport(event: FormEvent) {
    event.preventDefault();
    const tickets = JSON.parse(localStorage.getItem("chesstate_support") ?? "[]") as unknown[];
    tickets.unshift({ topic, message, at: new Date().toISOString(), email: state.profile.email });
    localStorage.setItem("chesstate_support", JSON.stringify(tickets.slice(0, 20)));
    setSent(true);
    setMessage("");
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow text-gold/70">
          {role === "entrepreneur" ? "Entrepreneur desk" : "Investor desk"}
        </p>
        <h1 className="mt-3 font-serif text-[32px] tracking-[-0.01em] text-cream sm:text-[38px]">
          Settings
        </h1>
      </header>

      <section className="space-y-4 rounded-2xl border border-cream/10 p-5 sm:p-6">
        <h2 className="font-serif text-[22px] text-cream">Accessibility</h2>
        <p className="font-sans text-[14px] leading-relaxed text-cream/55">
          Built for low vision, motion sensitivity, and easier reading. These
          sit on top of keyboard access and visible focus, which stay on.
        </p>

        <fieldset className="border-0 p-0">
          <legend className="font-sans text-sm text-cream/70">Text size</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["default", "Default"],
                ["large", "Large"],
                ["xlarge", "Larger"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ ...prefs, text: value })}
                className={`min-h-[44px] rounded-full px-4 font-sans text-[14px] ${
                  prefs.text === value ? "bg-cream text-navy" : "border border-cream/20 text-cream"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <Toggle
          label="High contrast"
          help="Stronger cream on near-black, for low vision."
          checked={prefs.contrast}
          onChange={(contrast) => update({ ...prefs, contrast })}
        />
        <Toggle
          label="Readable type"
          help="Switches body text to Verdana, which many low-vision readers find clearer than a thin sans."
          checked={prefs.readable}
          onChange={(readable) => update({ ...prefs, readable })}
        />
        <Toggle
          label="Roomier spacing"
          help="More line height and space between lines of copy."
          checked={prefs.spacing}
          onChange={(spacing) => update({ ...prefs, spacing })}
        />
        <Toggle
          label="Underline links"
          help="Links stay obvious without relying on colour alone."
          checked={prefs.links}
          onChange={(links) => update({ ...prefs, links })}
        />
        <Toggle
          label="Reduce motion"
          help="Turns off chart and page animation. Also respects your system setting."
          checked={prefs.motion}
          onChange={(motion) => update({ ...prefs, motion })}
        />
        <Toggle
          label="Strong focus ring"
          help="A thick outline on the control you are on, for keyboard and switch users."
          checked={prefs.focus}
          onChange={(focus) => update({ ...prefs, focus })}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-cream/10 p-5 sm:p-6">
        <h2 className="font-serif text-[22px] text-cream">Customer service</h2>
        <p className="font-sans text-[14px] text-cream/55">
          Write to us at support@chesstate.com, or send a note here. We aim to
          reply within two working days, Sunday to Thursday, Gulf time.
        </p>
        {sent ? (
          <p className="font-sans text-[15px] text-cream">Received. We will reply to {state.profile.email}.</p>
        ) : (
          <form onSubmit={submitSupport} className="space-y-3">
            <label className="block font-sans text-sm text-cream/70">
              Topic
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="mt-2 min-h-[44px] w-full rounded-full border border-cream/20 bg-[#081424] px-4 text-cream"
              >
                <option value="account">Account</option>
                <option value="payment">Payments</option>
                <option value="project">A project</option>
                <option value="access">Accessibility</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <label className="block font-sans text-sm text-cream/70">
              Message
              <textarea
                required
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-cream/20 bg-cream/[0.04] px-4 py-3 text-cream"
              />
            </label>
            <button
              type="submit"
              className="min-h-[44px] rounded-full bg-cream px-6 font-sans text-[15px] font-medium text-navy"
            >
              Send
            </button>
          </form>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-cream/10 p-5 sm:p-6">
        <h2 className="font-serif text-[22px] text-cream">Preferences</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-sans text-[15px] text-cream">Language</p>
            <p className="font-sans text-[13px] text-cream/45">Applies across the public site and this platform.</p>
          </div>
          <LanguageSwitcher tone="light" />
        </div>
        <Toggle
          label="Email updates"
          help="Project news and account messages. You can turn this off any time."
          checked={notify}
          onChange={setNotify}
        />
        <p className="font-sans text-[13px] leading-relaxed text-cream/40">
          This preview keeps your balance, stakes, and settings on this device
          only. Nothing is sold. ChesState does not offer the product in the
          United States.{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            Privacy
          </Link>
          {" · "}
          <Link href="/legal/terms" className="underline underline-offset-2">
            Terms
          </Link>
          {" · "}
          <Link href="/admin/registrants" className="underline underline-offset-2">
            Registrants SQL
          </Link>
        </p>
      </section>
    </div>
  );
}

function Toggle({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-start justify-between gap-4 py-1">
      <span>
        <span className="block font-sans text-[15px] text-cream">{label}</span>
        <span className="mt-1 block font-sans text-[13px] leading-relaxed text-cream/45">{help}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-cream"
      />
    </label>
  );
}
