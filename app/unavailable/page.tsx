import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Service unavailable in your region — ChesState",
};

export default function UnavailablePage() {
  return (
    <main className="flex min-h-screen flex-col bg-navy text-cream">
      <div className="section-shell flex h-[72px] items-center">
        <Link href="/" aria-label="ChesState home">
          <Logo tone="light" />
        </Link>
      </div>
      <div className="section-shell flex flex-1 items-center pb-24">
        <div className="max-w-xl">
          <span className="eyebrow text-cream/50">Region</span>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.1] text-cream sm:text-[44px]">
            ChesState is not available in your region.
          </h1>
          <p className="mt-6 font-sans text-[16px] leading-relaxed text-cream/65">
            We only operate where we can do so under the rules we are building
            for — the UAE and Europe. We do not offer the product to people in
            the United States.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-cream px-6 font-sans text-[15px] font-medium text-navy"
          >
            Back to the public site
          </Link>
        </div>
      </div>
    </main>
  );
}
