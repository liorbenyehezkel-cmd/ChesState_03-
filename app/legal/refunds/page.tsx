import { LegalLayout } from "@/components/legal/LegalLayout";
import { company } from "@/lib/legal/company";

export const metadata = { title: "Refund policy — ChesState" };

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund policy" updated="29 September 2026">
      <p>
        {company.licensing} There is therefore no live investment to refund.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Waitlist and preview</h2>
      <p>
        Joining the waitlist, opening the investor desk, or registering an
        investment request does not take a payment. Those actions cannot be
        &quot;refunded&quot; because no money is collected for them.
      </p>
      <h2 className="font-serif text-[24px] text-navy">If a payment is taken in error</h2>
      <p>
        If a card or transfer is charged by mistake while the product is still
        a pilot, write to {company.legalEmail} with the date, amount, and
        reference. We will investigate and return the sum through the original
        payment channel where that is possible.
      </p>
      <h2 className="font-serif text-[24px] text-navy">After licensing</h2>
      <p>
        When ChesState is authorised to accept funds, each live listing will
        state how missed dates, failed raises, and held money are treated. The
        current design intention is that a missed funding date returns the
        hold rather than spending it. That intention is not yet a licensed
        product rule.
      </p>
      <h2 className="font-serif text-[24px] text-navy">Entrepreneur applications</h2>
      <p>
        Creating an entrepreneur account does not require a fee. There is
        nothing to refund for a signup.
      </p>
    </LegalLayout>
  );
}
