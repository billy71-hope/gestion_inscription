import type { ReactNode } from "react";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Badge({ label, className }: { label: string; className: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${className}`}>{label}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-ink/15 bg-card/60 p-10 text-center text-ink-soft">{children}</p>;
}

export function Loading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Chargement">
      <div className="h-10 w-64 rounded-xl bg-ink/10" />
      <div className="h-4 w-96 max-w-full rounded bg-ink/10" />
      <div className="mt-8 h-64 rounded-[var(--radius-card)] bg-ink/5" />
    </div>
  );
}
