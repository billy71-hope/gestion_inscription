import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Loading, PageTitle } from "@/components/admin/ui";
import { db } from "@/db";
import { content } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { sections } from "@/lib/content/sections";
import { formatDate } from "@/lib/text";

export const metadata: Metadata = { title: "Contenu du site" };

export default function ContenuPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Liste />
    </Suspense>
  );
}

async function Liste() {
  await requireAdmin();
  const rows = await db.select({ key: content.key, updatedAt: content.updatedAt }).from(content);
  const updated = new Map(rows.map((r) => [r.key, r.updatedAt]));

  return (
    <>
      <PageTitle title="Contenu du site" description="Choisissez une section à modifier. Chaque enregistrement est publié immédiatement sur le site." />
      <ul className="grid gap-3 md:grid-cols-2">
        {sections.map((s) => {
          const date = updated.get(s.key);
          return (
            <li key={s.key}>
              <Link href={`/admin/contenu/${s.key}`} className="card flex h-full items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-semibold">{s.label}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{s.description}</span>
                  <span className="mt-2 block text-xs text-ink-faint">{date ? `Modifié le ${formatDate(date, true)}` : "Contenu d'origine, jamais modifié"}</span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-ink-faint" />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
