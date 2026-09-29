import { LocalActions } from "@/components/admin/LocalActions";
import { listRegistrations } from "@/lib/supabase/registrations";
import Link from "next/link";

export const metadata = {
  title: "Registrants SQL — ChesState",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function cell(value: unknown) {
  if (value == null || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function asText(value: unknown) {
  return value == null ? "" : String(value);
}

function Table({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: Row[];
  columns: Array<{ key: string; label: string }>;
}) {
  return (
    <section className="dash-card overflow-x-auto p-5">
      <h2 className="font-serif text-[22px] text-cream">{title}</h2>
      <p className="mt-1 font-sans text-[12px] text-cream/40">{rows.length} rows</p>
      {rows.length === 0 ? (
        <p className="mt-3 font-sans text-[14px] text-cream/50">No rows yet.</p>
      ) : (
        <table className="mt-4 min-w-[720px] w-full text-start">
          <thead>
            <tr className="border-b border-cream/10 font-sans text-[11px] uppercase tracking-[0.12em] text-cream/40">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/10">
            {rows.map((row, index) => (
              <tr key={String(row.id ?? row.email ?? index)}>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 font-sans text-[13px] text-cream/80">
                    {cell(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default async function RegistrantsPage() {
  const live = await listRegistrations();
  const rows = live.rows;

  const signups = rows;
  const uniqueSignups = new Map<string, Row>();
  for (const row of [...signups].reverse()) {
    const email = asText(row.email).toLowerCase();
    if (email && !uniqueSignups.has(email)) uniqueSignups.set(email, row);
  }
  const signupList = [...uniqueSignups.values()].sort((a, b) =>
    asText(b.created_at).localeCompare(asText(a.created_at)),
  );

  const purchases = rows.filter(
    (row) => row.try_to_make_a_purchase === true || row.purchase_amount != null,
  );
  const feedback = rows.filter((row) => Boolean(row.message));
  const uniqueBuyers = new Set(
    purchases.map((row) => asText(row.email).toLowerCase()).filter(Boolean),
  );

  const registrantRows = signupList.map((row) => {
    const email = asText(row.email).toLowerCase();
    const theirs = purchases.filter(
      (event) => asText(event.email).toLowerCase() === email,
    );
    const last = theirs[0];
    return {
      email: row.email,
      signup_at: row.created_at,
      phone: row.phone,
      country: row.country,
      arrival_source: row.source || "Direct",
      purchase_attempts: theirs.length,
      last_intended_amount_usd: last?.purchase_amount ?? null,
    };
  });

  return (
    <div className="min-h-screen bg-[#081424] px-4 py-10 text-cream sm:px-8">
      <div className="mx-auto max-w-[1100px] space-y-8">
        <header>
          <p className="eyebrow text-gold/70">Operator desk</p>
          <h1 className="mt-3 font-serif text-[36px] tracking-[-0.01em] text-cream">
            Registrants SQL
          </h1>
          <p className="mt-3 max-w-[62ch] font-sans text-[15px] leading-relaxed text-cream/55">
            Connected to <code>public.registrations</code>. The public site can
            only insert. This page reads with the server service-role key, not
            the publishable key. Run <code>supabase/registrations.sql</code> in
            the SQL editor, then put the secret key in{" "}
            <code>.env.local</code> as <code>SUPABASE_SERVICE_ROLE_KEY</code>.
            This page is not indexed.
          </p>
          <Link href="/" className="mt-4 inline-block font-sans text-[14px] text-cream/50 hover:text-cream">
            Public site
          </Link>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Register interest signups" value={String(signupList.length)} />
          <Stat label="Users who came to purchase" value={String(uniqueBuyers.size)} />
          <Stat
            label="Purchase attempts (before notice)"
            value={String(purchases.length)}
          />
        </div>

        <pre className="overflow-x-auto rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 font-sans text-[12px] leading-relaxed text-cream/70">
{`select count(distinct email) as signup_count from public.registrations;
select created_at, email, phone, country, source from public.registrations
  order by created_at desc;
select * from public.registrations
  where try_to_make_a_purchase is true or purchase_amount is not null;
select * from public.registrations
  where message is not null;`}
        </pre>

        {live.error === "admin_key_missing" ? (
          <p className="font-sans text-[14px] text-cream/50">
            Live rows stay hidden until <code>SUPABASE_SERVICE_ROLE_KEY</code> is
            set on the server. Signups still write with the publishable key.
            Local browser rows appear below.
          </p>
        ) : live.error === "not_configured" ? (
          <p className="font-sans text-[14px] text-cream/50">
            Supabase is not configured here, so live tables stay empty. Local
            browser rows still appear below.
          </p>
        ) : live.error ? (
          <p className="font-sans text-[13px] text-[#F3B0A8]">{live.error}</p>
        ) : null}

        <Table
          title="Waitlist (date, email, phone, country, source)"
          rows={signupList.map((row) => ({
            signup_at: row.created_at,
            email: row.email,
            phone: row.phone,
            country: row.country,
            arrival_source: row.source || "Direct",
          }))}
          columns={[
            { key: "signup_at", label: "Signup date" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "country", label: "Country" },
            { key: "arrival_source", label: "Arrival source" },
          ]}
        />

        <Table
          title="Intended purchases"
          rows={purchases.map((row) => ({
            attempted_at: row.created_at,
            email: row.email,
            phone: row.phone,
            country: row.country,
            arrival_source: row.source || "Direct",
            intended_amount_usd: row.purchase_amount,
            project_title: row.project_title,
          }))}
          columns={[
            { key: "attempted_at", label: "Attempted" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "country", label: "Country" },
            { key: "arrival_source", label: "Source" },
            { key: "intended_amount_usd", label: "Intended amount (USD)" },
            { key: "project_title", label: "Project" },
          ]}
        />

        <Table
          title="Registrant report"
          rows={registrantRows}
          columns={[
            { key: "email", label: "Email" },
            { key: "signup_at", label: "Signup date" },
            { key: "phone", label: "Phone" },
            { key: "country", label: "Country" },
            { key: "arrival_source", label: "Source" },
            { key: "purchase_attempts", label: "Purchase attempts" },
            { key: "last_intended_amount_usd", label: "Last intended $" },
          ]}
        />

        <Table
          title="Product feedback"
          rows={feedback.map((row) => ({
            created_at: row.created_at,
            email: row.email,
            message: row.message,
            project_title: row.project_title,
          }))}
          columns={[
            { key: "created_at", label: "Date" },
            { key: "email", label: "Email" },
            { key: "message", label: "Suggestion" },
            { key: "project_title", label: "Project" },
          ]}
        />

        <LocalActions />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="dash-card p-5">
      <p className="font-sans text-[12px] uppercase tracking-[0.12em] text-cream/40">
        {label}
      </p>
      <p className="mt-2 font-serif text-[32px] text-cream">{value}</p>
    </div>
  );
}
