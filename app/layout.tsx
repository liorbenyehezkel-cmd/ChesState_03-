import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import type { Metadata } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { AttributionCapture } from "@/components/AttributionCapture";
import { directionFor } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { getTranslations } from "@/lib/i18n/server";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export function generateMetadata(): Metadata {
  const { locale } = getTranslations();

  const byLocale: Record<string, { title: string; description: string }> = {
    en: {
      title:
        "ChesState — Own a Slice of Real Estate, Starting at $9.99 | Early Access, UAE",
      description:
        "ChesState is building fractional access to vetted property projects in the UAE — no crypto wallet, no jargon, no six-figure minimum. Register your interest today.",
    },
    ar: {
      title:
        "ChesState — امتلك حصة من العقارات بدءاً من 9.99 دولار | وصول مبكر، الإمارات",
      description:
        "تبني ChesState وصولاً جزئياً إلى مشاريع عقارية مدروسة في الإمارات — دون محفظة رقمية، ودون مصطلحات معقدة، ودون حد أدنى من ستة أرقام. سجّل اهتمامك اليوم.",
    },
    es: {
      title:
        "ChesState — Posee una parte del sector inmobiliario desde 9,99 $ | Acceso anticipado, EAU",
      description:
        "ChesState está construyendo el acceso fraccionado a proyectos inmobiliarios verificados en los EAU: sin monedero cripto, sin tecnicismos y sin mínimos de seis cifras. Registra tu interés hoy.",
    },
    fr: {
      title:
        "ChesState — Possédez une part d'immobilier dès 9,99 $ | Accès anticipé, EAU",
      description:
        "ChesState construit un accès fractionné à des projets immobiliers vérifiés aux EAU : sans portefeuille crypto, sans jargon, sans ticket d'entrée à six chiffres. Manifestez votre intérêt.",
    },
  };

  const copy = byLocale[locale] ?? byLocale.en;

  return {
    metadataBase: new URL("https://chesstate.com"),
    applicationName: "ChesState",
    alternates: { canonical: "https://chesstate.com" },
    title: {
      default: copy.title,
      template: "%s · ChesState",
    },
    description: copy.description,
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const { locale, dictionary } = getTranslations();

  return (
    <html
      lang={locale}
      dir={directionFor(locale)}
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <I18nProvider locale={locale} dictionary={dictionary}>
          {children}
          <CookieConsent />
          <AttributionCapture />
        </I18nProvider>
      </body>
    </html>
  );
}
