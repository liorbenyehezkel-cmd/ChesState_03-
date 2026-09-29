import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/entrepreneurs/LoginForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo";
import { getTranslations } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const { dictionary } = getTranslations();
  return { title: `${dictionary.auth.loginTitle} — ChesState` };
}

export default function EntrepreneurLoginPage() {
  const { dictionary: t } = getTranslations();

  return (
    <div className="entrepreneur-sheet min-h-screen bg-cream text-navy">
      <header className="border-b border-navy/10">
        <div className="section-shell flex h-[72px] items-center justify-between gap-4">
          <Link href="/" prefetch={false} aria-label={t.nav.home}>
            <Logo tone="navy" />
          </Link>
          <LanguageSwitcher tone="navy" />
        </div>
      </header>

      <main className="section-shell flex items-center justify-center py-20 sm:py-28">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-[30px] leading-tight sm:text-[36px]">
            {t.auth.loginTitle}
          </h1>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-cream/65">
            {t.auth.loginIntro}
          </p>

          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
