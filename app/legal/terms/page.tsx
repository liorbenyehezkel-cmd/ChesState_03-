import { LegalLayout } from "@/components/legal/LegalLayout";
import { company } from "@/lib/legal/company";

export const metadata = { title: "Terms of use — ChesState" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of use" updated="29 September 2026">
      <p>
        These terms govern use of {company.website} and the ChesState platform
        preview, including waitlist signup, the investor desk, and the
        entrepreneur studio. By using the site you agree to this document and
        the privacy, cookie, and refund policies.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Who we are</h2>
      <p>
        {company.name} operates from the {company.jurisdiction}. Contact{" "}
        {company.legalEmail}. {company.licensing}
      </p>
      <h2 className="font-serif text-[24px] text-navy">What this site is</h2>
      <p>
        The marketplace, yields, funding bars, balances, community members, and
        news desk are a model of a planned product. They are not a live offer
        of securities, tokens, or property fractions. Registering interest or
        sending an investment request does not invest money and does not create
        a binding subscription.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Accounts and waitlist</h2>
      <p>
        You must give accurate contact details. We may refuse, suspend, or
        delete a waitlist entry or entrepreneur application. You are
        responsible for keeping login details confidential.
      </p>
      <h2 className="font-serif text-[24px] text-navy">No advice</h2>
      <p>
        Nothing on the site is investment, legal, or tax advice. Property values
        can fall. Illustrated yields are not forecasts or guarantees.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Acceptable use</h2>
      <p>
        Do not misuse the site, scrape it aggressively, impersonate others, or
        post unlawful content. Sample community messages are labelled as
        sample content and are not reviews by real investors.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Intellectual property</h2>
      <p>
        The ChesState name, king mark, layout, and copy are owned by ChesState
        or used under licence. Project, news, and community images are
        illustrative file photographs for the pilot. They are not photographs
        of live, investable assets. Do not reuse them as if they were.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Liability</h2>
      <p>
        To the extent permitted by UAE law, ChesState is not liable for losses
        arising from reliance on illustrative figures, from unavailability of
        the preview, or from acts outside our reasonable control. This does
        not exclude liability that cannot be excluded by law.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Governing law</h2>
      <p>
        These terms are governed by the laws of the {company.jurisdiction}.
        Courts of the UAE have jurisdiction, without limiting any mandatory
        consumer protections that apply to you.
      </p>
    </LegalLayout>
  );
}
