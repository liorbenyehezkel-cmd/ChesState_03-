import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Page not found — ChesState" };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-navy">
      <header className="border-b border-border">
        <div className="section-shell flex h-[72px] items-center">
          <Link href="/" aria-label="ChesState home">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="section-shell flex flex-1 flex-col justify-center py-20">
        <p className="eyebrow text-muted">404</p>
        <h1 className="mt-3 max-w-[16ch] font-serif text-[36px] leading-tight tracking-[-0.01em] sm:text-[48px]">
          This page is not on the board.
        </h1>
        <p className="mt-4 max-w-[48ch] font-sans text-[16px] leading-relaxed text-muted">
          The address may have moved, or it was never a live listing. Go back
          to the public site or open the platform preview.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Public site</ButtonLink>
          <ButtonLink href="/dashboard/explore" variant="secondary">
            Platform
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
