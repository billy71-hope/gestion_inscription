import { desc, eq } from "drizzle-orm";
import { Check, EyeOff, Star, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { deleteAvis, setAvisStatut } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { AVIS_LABELS } from "@/components/admin/labels";
import { Badge, Empty, Loading, PageTitle } from "@/components/admin/ui";
import { db } from "@/db";
import { AVIS_STATUTS, avis, type AvisStatut } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/text";

export const metadata: Metadata = { title: "Avis" };

export default function AvisPage(props: PageProps<"/admin/avis">) {
  return (
    <Suspense fallback={<Loading />}>
      <Liste searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Liste({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const { statut } = await searchParams;
  const filtre = AVIS_STATUTS.includes(statut as AvisStatut) ? (statut as AvisStatut) : null;
  const rows = await db
    .select()
    .from(avis)
    .where(filtre ? eq(avis.statut, filtre) : undefined)
    .orderBy(desc(avis.createdAt));

  return (
    <>
      <PageTitle title="Avis" description="Les témoignages envoyés depuis la page d'accueil. Seuls les avis publiés apparaissent sur le site (12 au maximum, les plus récents)." />
      <nav aria-label="Filtrer" className="mb-6 flex flex-wrap gap-2">
        {[null, ...AVIS_STATUTS].map((s) => (
          <Link
            key={s ?? "tous"}
            href={s ? `/admin/avis?statut=${s}` : "/admin/avis"}
            aria-current={filtre === s ? "page" : undefined}
            className="btn btn-ghost !py-2 text-sm aria-[current=page]:!border-ink aria-[current=page]:!bg-ink aria-[current=page]:text-paper"
          >
            {s ? AVIS_LABELS[s].label : "Tous"}
          </Link>
        ))}
      </nav>

      {rows.length ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {rows.map((a) => (
            <li key={a.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{a.nom}</p>
                  <p className="text-sm text-ink-soft">
                    {a.qualite} · {formatDate(a.createdAt)}
                  </p>
                </div>
                <Badge {...AVIS_LABELS[a.statut]} />
              </div>
              <p className="mt-3 flex gap-0.5 text-safran" aria-label={`${a.note} sur 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`size-4 ${i < a.note ? "fill-current" : "opacity-30"}`} />
                ))}
              </p>
              <p className="mt-3 flex-1 leading-relaxed whitespace-pre-line">{a.message}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                {a.statut !== "publie" ? (
                  <ActionButton action={setAvisStatut.bind(null, a.id, "publie")} className="btn btn-primary !px-3 !py-1.5 text-sm">
                    <Check className="size-4" /> Publier
                  </ActionButton>
                ) : (
                  <ActionButton action={setAvisStatut.bind(null, a.id, "refuse")}>
                    <EyeOff className="size-4" /> Retirer du site
                  </ActionButton>
                )}
                {a.statut === "en_attente" ? (
                  <ActionButton action={setAvisStatut.bind(null, a.id, "refuse")}>
                    <EyeOff className="size-4" /> Refuser
                  </ActionButton>
                ) : null}
                <ActionButton
                  action={deleteAvis.bind(null, a.id)}
                  confirmMessage="Supprimer définitivement cet avis ?"
                  className="btn ml-auto !px-3 !py-1.5 text-sm text-terracotta hover:bg-terracotta-soft"
                >
                  <Trash2 className="size-4" /> Supprimer
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>Aucun avis {filtre ? "dans cette catégorie" : "pour le moment"}.</Empty>
      )}
    </>
  );
}
