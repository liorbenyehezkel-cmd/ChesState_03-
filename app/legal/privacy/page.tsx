import { LegalLayout } from "@/components/legal/LegalLayout";
import { company } from "@/lib/legal/company";

export const metadata = { title: "Privacy policy — ChesState" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy policy" updated="29 September 2026">
      <p>
        This policy explains what personal data ChesState collects, why, and
        how long we keep it. The operator is {company.name}, {company.jurisdiction}.
        Write to {company.legalEmail}.
      </p>
      <h2 className="font-serif text-[24px] text-navy">What we collect</h2>
      <ul className="list-disc space-y-2 ps-5">
        <li>Waitlist: email, mobile number, country dial code, language.</li>
        <li>Entrepreneur applications: email, optional project details, account credentials held by our auth provider.</li>
        <li>Platform use: role (investor or entrepreneur), accessibility settings, registered investment requests stored on your device or, once licensed systems are live, in our ledger.</li>
        <li>Technical: IP-derived country for access rules, security logs, cookie consent.</li>
      </ul>
      <h2 className="font-serif text-[24px] text-navy">Why we collect it</h2>
      <p>
        To run the waitlist, answer entrepreneur applications, keep the preview
        working, meet legal duties, and contact you when early access opens.
        Joining the list does not invest money.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Lawful basis</h2>
      <p>
        We rely on your consent for the waitlist and marketing-style updates,
        on contract steps for entrepreneur accounts, and on legitimate
        interests for security and geofencing. You may withdraw consent by
        emailing {company.legalEmail}.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Who we share with</h2>
      <p>
        Hosting, authentication, and database providers (currently including
        Supabase if configured) process data on our instructions. We do not
        sell personal data. We do not load advertising pixels or third-party
        analytics unless the cookie policy says otherwise.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Retention</h2>
      <p>
        Waitlist rows are kept until you ask for deletion or the product
        launches and you convert to an account. Security logs are kept only as
        long as needed. You can ask for access, correction, or deletion at{" "}
        {company.legalEmail}.
      </p>
      <h2 className="font-serif text-[24px] text-navy">International transfers</h2>
      <p>
        Servers may sit outside the UAE. We use providers that offer
        contractual safeguards. Do not submit the waitlist if you are not
        comfortable with that.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Children</h2>
      <p>The site is not directed at anyone under 18.</p>
    </LegalLayout>
  );
}
