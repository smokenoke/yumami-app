interface DashboardStatusStripProps {
  isConfigured: boolean;
  userEmail?: string;
  canMutate: boolean;
}

export function DashboardStatusStrip({
  isConfigured,
  userEmail,
  canMutate,
}: DashboardStatusStripProps) {
  const items = [
    {
      label: "Supabase",
      value: isConfigured ? "Configured" : "Pending",
    },
    {
      label: "User session",
      value: userEmail ? "Signed in" : "Anonymous",
    },
    {
      label: "Task mutations",
      value: canMutate ? "Enabled" : "Read-only/demo",
    },
  ] as const;

  return (
    <section className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm shadow-sm"
        >
          <span className="font-semibold text-slate-900">{item.label}:</span>{" "}
          <span className="text-slate-600">{item.value}</span>
        </div>
      ))}
    </section>
  );
}
