import { count, desc, sql } from "drizzle-orm";
import { Download, Search } from "lucide-react";
import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { INSCRIPTION_LABELS } from "@/components/admin/labels";
import { Badge, Empty, Loading, PageTitle } from "@/components/admin/ui";
import { db } from "@/db";
import { INSCRIPTION_STATUTS, inscriptions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { formatPhone } from "@/lib/phone";
import { age, formatDate } from "@/lib/text";
import { readFiltres, whereFiltres } from "./query";

export const metadata: Metadata = { title: "Inscriptions" };
const PAR_PAGE = 50;

export default function InscriptionsPage(props: PageProps<"/admin/inscriptions">) {
  return (
    <Suspense fallback={<Loading />}>
      <Liste searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Liste({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const params = await searchParams;
  const filtres = readFiltres(params);
  const page = Math.max(1, Number(params.page) || 1);
  const where = whereFiltres(filtres);

  const [config, rows, [{ total }], annees] = await Promise.all([
    getContent("inscription"),
    db
      .select()
      .from(inscriptions)
      .where(where)
      .orderBy(desc(inscriptions.createdAt))
      .limit(PAR_PAGE)
      .offset((page - 1) * PAR_PAGE),
    db.select({ total: count() }).from(inscriptions).where(where),
    db.selectDistinct({ annee: inscriptions.anneeScolaire }).from(inscriptions).orderBy(sql`1 desc`),
  ]);

  const query = new URLSearchParams(Object.entries(filtres).filter(([, v]) => v) as [string, string][]);
  const pages = Math.ceil(total / PAR_PAGE);
  const hrefPage = (p: number) => `?${new URLSearchParams({ ...Object.fromEntries(query), page: String(p) })}`;
  const filtreActif = Object.values(filtres).some(Boolean);

  return (
    <>
      <PageTitle
        title="Inscriptions"
        description={`${total} demande${total > 1 ? "s" : ""}${filtreActif ? " correspondant aux filtres" : ""}.`}
        actions={
          <a href={`/admin/inscriptions/export?${query}`} className="btn btn-ghost !py-2.5">
            <Download className="size-4" /> Exporter (Excel)
          </a>
        }
      />

      <Form action="/admin/inscriptions" className="card mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Rechercher</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
          <input name="q" defaultValue={filtres.q} placeholder="Nom, parent, téléphone…" className="field-input !pl-9" />
        </label>
        <select name="statut" defaultValue={filtres.statut ?? ""} className="field-input" aria-label="Statut">
          <option value="">Tous les statuts</option>
          {INSCRIPTION_STATUTS.map((s) => (
            <option key={s} value={s}>
              {INSCRIPTION_LABELS[s].label}
            </option>
          ))}
        </select>
        <select name="classe" defaultValue={filtres.classe ?? ""} className="field-input" aria-label="Classe">
          <option value="">Toutes les classes</option>
          {config.classes.map((c) => (
            <option key={c.nom}>{c.nom}</option>
          ))}
        </select>
        <select name="annee" defaultValue={filtres.annee ?? ""} className="field-input" aria-label="Année scolaire">
          <option value="">Toutes les années</option>
          {annees.map((a) => (
            <option key={a.annee}>{a.annee}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary !py-2.5 flex-1">
            Filtrer
          </button>
          {filtreActif ? (
            <Link href="/admin/inscriptions" className="btn btn-ghost !py-2.5">
              Effacer
            </Link>
          ) : null}
        </div>
      </Form>

      {rows.length ? (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="hidden bg-paper/70 text-ink-soft md:table-header-group">
              <tr>
                <th className="px-4 py-3 font-semibold">Élève</th>
                <th className="px-4 py-3 font-semibold">Classe</th>
                <th className="px-4 py-3 font-semibold">Parent</th>
                <th className="px-4 py-3 font-semibold">Reçue le</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((i) => (
                <tr key={i.id} className="relative block hover:bg-paper/60 md:table-row">
                  <td className="block px-4 pt-3 md:table-cell md:py-3">
                    <Link href={`/admin/inscriptions/${i.id}`} className="font-semibold after:absolute after:inset-0">
                      {i.nomEleve} {i.prenomEleve}
                    </Link>
                    <span className="block text-ink-faint">
                      {i.sexe === "F" ? "Fille" : "Garçon"}, {age(i.dateNaissance)} ans
                    </span>
                  </td>
                  <td className="block px-4 md:table-cell md:py-3">
                    {i.classe}
                    {i.serie ? <span className="text-ink-soft"> · {i.serie}</span> : null}
                  </td>
                  <td className="block px-4 md:table-cell md:py-3">
                    {i.parentNom}
                    <span className="block text-ink-faint">{formatPhone(i.telephone)}</span>
                  </td>
                  <td className="block px-4 text-ink-soft md:table-cell md:py-3">{formatDate(i.createdAt)}</td>
                  <td className="block px-4 pb-3 md:table-cell md:py-3">
                    <Badge {...INSCRIPTION_LABELS[i.statut]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>{filtreActif ? "Aucune demande ne correspond à ces filtres." : "Aucune demande de pré-inscription pour le moment."}</Empty>
      )}

      {pages > 1 ? (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
          {page > 1 ? (
            <Link href={hrefPage(page - 1)} className="btn btn-ghost !py-2">
              ← Précédente
            </Link>
          ) : null}
          <span className="px-3 text-sm text-ink-soft">
            Page {page} sur {pages}
          </span>
          {page < pages ? (
            <Link href={hrefPage(page + 1)} className="btn btn-ghost !py-2">
              Suivante →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
