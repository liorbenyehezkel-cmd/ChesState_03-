export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6 py-2">
      <div className="h-3 w-24 rounded-full bg-cream/10" />
      <div className="h-9 w-56 rounded-full bg-cream/10" />
      <div className="h-4 max-w-md rounded-full bg-cream/10" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-28 rounded-2xl bg-cream/10" />
        <div className="h-28 rounded-2xl bg-cream/10" />
        <div className="h-28 rounded-2xl bg-cream/10" />
        <div className="h-28 rounded-2xl bg-cream/10" />
        <div className="h-28 rounded-2xl bg-cream/10" />
        <div className="h-28 rounded-2xl bg-cream/10" />
      </div>
      <div className="h-64 rounded-2xl bg-cream/10" />
    </div>
  );
}
