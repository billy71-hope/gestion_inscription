import "server-only";
import { and, eq, ilike, or, type SQL } from "drizzle-orm";
import { INSCRIPTION_STATUTS, inscriptions, type InscriptionStatut } from "@/db/schema";

export type Filtres = { statut?: string; classe?: string; annee?: string; q?: string };

export function readFiltres(params: Record<string, string | string[] | undefined>): Filtres {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  return { statut: one(params.statut), classe: one(params.classe), annee: one(params.annee), q: one(params.q) };
}

export function whereFiltres(f: Filtres): SQL | undefined {
  const conditions: SQL[] = [];
  if (f.statut && INSCRIPTION_STATUTS.includes(f.statut as InscriptionStatut)) {
    conditions.push(eq(inscriptions.statut, f.statut as InscriptionStatut));
  }
  if (f.classe) conditions.push(eq(inscriptions.classe, f.classe));
  if (f.annee) conditions.push(eq(inscriptions.anneeScolaire, f.annee));
  if (f.q) {
    const like = `%${f.q.replace(/[%_\\]/g, "\\$&")}%`;
    conditions.push(
      or(
        ilike(inscriptions.nomEleve, like),
        ilike(inscriptions.prenomEleve, like),
        ilike(inscriptions.parentNom, like),
        ilike(inscriptions.telephone, `%${f.q.replace(/\D/g, "") || f.q}%`),
      )!,
    );
  }
  return conditions.length ? and(...conditions) : undefined;
}
