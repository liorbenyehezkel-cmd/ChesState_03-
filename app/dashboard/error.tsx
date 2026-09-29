"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="eyebrow text-cream/45">Platform</p>
      <h1 className="mt-3 font-serif text-[32px] text-cream">Something went wrong</h1>
      <p className="mt-3 font-sans text-[15px] leading-relaxed text-cream/60">
        The page did not load. Try again — your account and waitlist details are
        still saved.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 min-h-[44px] rounded-full bg-cream px-6 font-sans text-[15px] text-navy"
      >
        Try again
      </button>
    </div>
  );
}
