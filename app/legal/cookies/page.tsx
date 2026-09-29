import { LegalLayout } from "@/components/legal/LegalLayout";
import { company } from "@/lib/legal/company";

export const metadata = { title: "Cookie policy — ChesState" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie policy" updated="29 September 2026">
      <p>
        Cookies are small files stored on your device. ChesState uses them only
        where they are needed to run the site. Contact {company.legalEmail} with
        questions.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Strictly necessary</h2>
      <ul className="list-disc space-y-2 ps-5">
        <li>Language preference.</li>
        <li>Investor or entrepreneur desk role.</li>
        <li>Authentication and security session (when you sign in).</li>
        <li>Waitlist cookie so you can reopen the preview after registering interest.</li>
        <li>Cookie-consent record itself.</li>
        <li>Country check used to apply access rules.</li>
      </ul>
      <p>
        These cookies do not require optional consent. The banner still tells
        you they exist.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Analytics and marketing</h2>
      <p>
        We do not currently set advertising cookies, Facebook pixels, Google
        Analytics, or Hotjar. If that changes, this page and the banner will
        be updated and optional consent will be required.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Local storage</h2>
      <p>
        The investor desk also stores a preview portfolio, accessibility
        settings, and community draft state in local storage on your device.
        That data stays on the device unless you clear it.
      </p>
      <h2 className="font-serif text-[24px] text-navy">How to control cookies</h2>
      <p>
        You can delete cookies in your browser. Blocking strictly necessary
        cookies may stop login, language, and the desk from working.
      </p>
    </LegalLayout>
  );
}
