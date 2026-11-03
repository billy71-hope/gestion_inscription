import { count, eq } from "drizzle-orm";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { db } from "@/db";
import { avis, inscriptions, messages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export default function EspaceLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Suspense
        fallback={
          <>
            <div className="h-16 bg-ink lg:hidden" />
            <div className="hidden h-screen w-64 shrink-0 bg-ink lg:block" />
          </>
        }
      >
        <NavWithCounts />
      </Suspense>
      <div className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-10">{children}</div>
    </div>
  );
}

async function NavWithCounts() {
  await requireAdmin();
  const [[nouvelles], [enAttente], [nonLus]] = await Promise.all([
    db.select({ n: count() }).from(inscriptions).where(eq(inscriptions.statut, "nouvelle")),
    db.select({ n: count() }).from(avis).where(eq(avis.statut, "en_attente")),
    db.select({ n: count() }).from(messages).where(eq(messages.lu, false)),
  ]);
  return <AdminNav counts={{ inscriptions: nouvelles.n, avis: enAttente.n, messages: nonLus.n }} />;
}
