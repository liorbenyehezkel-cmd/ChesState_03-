import { LiveRegistrations } from "@/components/admin/LiveRegistrations";
import { LocalActions } from "@/components/admin/LocalActions";
import { RemoveRegistrantButton } from "@/components/admin/RemoveRegistrantButton";
import { listRegistrations } from "@/lib/supabase/registrations";
import Link from "next/link";

export const metadata = {
  title: "Registrants SQL — ChesState",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;
type Column = { key: string; label: string; wrap?: boolean };

function asText(value: unknown) {
  return value == null ? "" : String(value);
}

function cell(value: unknown) {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatDate(value: unknown) {
  const text = asText(value);
  if (!text) return "—";
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toISOString().slice(0, 16).replace("T", " ");
}

function formatAmount(value: unknown) {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString("en-US") : String(value);
}

function Table({
  title,
  rows,
  columns,
  removable = false,
}: {
  title: string;
  rows: Row[];
  columns: Column[];
  removable?: boolean;
}) {
  return (
    <section className="dash-card overflow-x-auto p-5">
      <h2 className="font-serif text-[22px] text-cream">{title}</h2>
      <p className="mt-1 font-sans text-[12px] text-cream/40">
        {rows.length} {rows.length === 1 ? "row" : "rows"} · updates live
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 font-sans text-[14px] text-cream/50">No rows yet.</p>
      ) : (
        <table className="mt-4 min-w-[860px] w-full text-start">
          <thead>
            <tr className="border-b border-cream/10 font-sans text-[11px] uppercase tracking-[0.12em] text-cream/40">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 font-medium">
                  {col.label}
                </th>
              ))}
              {removable ? <th className="px-3 py-2" aria-label="Actions" /> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/10">
            {rows.map((row, index) => (
              <tr key={String(row.id ?? row.email ?? index)} className="align-top">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2 font-sans text-[13px] text-cream/80 ${
                      col.wrap ? "min-w-[260px] max-w-[420px] whitespace-pre-line break-words" : ""
                    }`}
                  >
                    {cell(row[col.key])}
                  </td>
                ))}
                {removable && row.id != null ? (
                  <td className="px-3 py-2 text-end">
                    <RemoveRegistrantButton
                      id={String(row.id)}
                      label={asText(row.email) || "this registrant"}
                    />
                  </td>
                ) : removable ? (
                  <td />
                ) : null}
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

  // Newest first (the query already orders this way).
  const records = live.rows.map((row) => ({
    id: row.id,
    created_at: formatDate(row.created_at),
    email: row.email,
    phone: row.phone,
    country: row.country,
    try_to_make_a_purchase: row.try_to_make_a_purchase === true,
    purchase_amount: formatAmount(row.purchase_amount),
    project_title: row.project_title,
    message: row.message,
  }));

  const attempted = records.filter((row) => row.try_to_make_a_purchase);
  const withMessage = records.filter((row) => Boolean(asText(row.message).trim()));

  return (
    <div className="min-h-screen bg-[#081424] px-4 py-10 text-cream sm:px-8">
      <div className="mx-auto max-w-[1100px] space-y-8">
        <LiveRegistrations />
        <header>
          <p className="eyebrow text-gold/70">Operator desk</p>
          <h1 className="mt-3 font-serif text-[36px] tracking-[-0.01em] text-cream">
            Registrants
          </h1>
          <p className="mt-3 max-w-[62ch] font-sans text-[15px] leading-relaxed text-cream/55">
            Live view of <code>public.registrations</code>. Read on the server
            with the service-role key; the page refreshes itself when a row is
            added or changed. This page is not indexed.
          </p>
          <Link href="/" className="mt-4 inline-block font-sans text-[14px] text-cream/50 hover:text-cream">
            Public site
          </Link>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Registrations" value={String(records.length)} />
          <Stat label="Attempted a purchase" value={String(attempted.length)} />
          <Stat label="With a message" value={String(withMessage.length)} />
        </div>

        {live.error === "admin_key_missing" ? (
          <p className="font-sans text-[14px] text-cream/50">
            Live rows stay hidden until <code>SUPABASE_SERVICE_ROLE_KEY</code> is
            set on the server.
          </p>
        ) : live.error === "not_configured" ? (
          <p className="font-sans text-[14px] text-cream/50">
            Supabase is not configured here, so live tables stay empty.
          </p>
        ) : live.error ? (
          <p className="font-sans text-[13px] text-[#F3B0A8]">{live.error}</p>
        ) : null}

        <Table
          title="Registrations"
          rows={records}
          removable={!live.error}
          columns={[
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "country", label: "Country" },
            { key: "try_to_make_a_purchase", label: "Attempted purchase" },
            { key: "purchase_amount", label: "Purchase amount" },
            { key: "project_title", label: "Project" },
            { key: "message", label: "Message", wrap: true },
          ]}
        />

        <Table
          title="Messages & feedback"
          rows={withMessage}
          columns={[
            { key: "created_at", label: "Date (UTC)" },
            { key: "email", label: "Email" },
            { key: "project_title", label: "Project" },
            { key: "message", label: "Message", wrap: true },
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
