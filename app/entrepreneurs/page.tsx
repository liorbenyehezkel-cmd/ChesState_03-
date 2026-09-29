import Link from "next/link";
import type { Metadata } from "next";
import { EntrepreneurForm } from "@/components/entrepreneurs/EntrepreneurForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo";
import { getTranslations } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const { dictionary } = getTranslations();
  return {
    title: dictionary.entrepreneurs.metaTitle,
    description: dictionary.entrepreneurs.metaDescription,
  };
}

export default function EntrepreneursPage() {
  const { dictionary: t } = getTranslations();

  return (
    // The palette is inverted here: navy becomes the surface, cream the ink.
    <div className="entrepreneur-sheet min-h-screen bg-cream text-navy">
      <header className="border-b border-navy/10">
        <div className="section-shell flex h-[72px] items-center justify-between gap-4">
          <Link href="/" prefetch={false} aria-label={t.nav.home}>
            <Logo tone="navy" />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher tone="navy" />
            <Link
              href="/"
              prefetch={false}
              className="hidden min-h-[44px] items-center rounded-full border border-navy/20 px-5 font-sans text-[15px] text-navy transition hover:border-navy/40 sm:inline-flex"
            >
              {t.entrepreneurs.backHome}
            </Link>
          </div>
        </div>
      </header>

      <main className="section-shell pb-24 pt-14 sm:pt-20">
        <div className="max-w-[46rem]">
          <span className="eyebrow text-cream">{t.entrepreneurs.eyebrow}</span>
          <h1 className="mt-5 max-w-[20ch] font-serif text-[32px] leading-[1.1] tracking-[-0.01em] sm:text-[44px] lg:text-[50px]">
            {t.entrepreneurs.title}
          </h1>
          <p className="mt-6 max-w-[58ch] font-sans text-[16px] leading-relaxed text-cream/65 sm:text-[17px]">
            {t.entrepreneurs.intro}
          </p>
        </div>

        <div className="mt-14 max-w-[40rem]">
          <EntrepreneurForm />
        </div>
      </main>
    </div>
  );
}
