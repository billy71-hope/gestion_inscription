import { desc } from "drizzle-orm";
import { db } from "@/db";
import { inscriptions } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { INSCRIPTION_LABELS } from "@/components/admin/labels";
import { formatPhone } from "@/lib/phone";
import { readFiltres, whereFiltres } from "../query";

const COLONNES: [string, (i: typeof inscriptions.$inferSelect) => string | null][] = [
  ["Reçue le", (i) => i.createdAt.toLocaleString("fr-FR", { timeZone: "Africa/Porto-Novo" })],
  ["Année scolaire", (i) => i.anneeScolaire],
  ["Statut", (i) => INSCRIPTION_LABELS[i.statut].label],
  ["Nom", (i) => i.nomEleve],
  ["Prénom", (i) => i.prenomEleve],
  ["Sexe", (i) => i.sexe],
  ["Date de naissance", (i) => i.dateNaissance.split("-").reverse().join("/")],
  ["Classe", (i) => i.classe],
  ["Série", (i) => i.serie],
  ["École d'origine", (i) => i.ecoleOrigine],
  ["Parent", (i) => i.parentNom],
  ["Lien", (i) => i.parentLien],
  ["Téléphone", (i) => formatPhone(i.telephone)],
  ["E-mail", (i) => i.email],
  ["Message", (i) => i.message],
  ["Notes internes", (i) => i.notes],
];

function cell(value: string | null) {
  const v = (value ?? "").replace(/\r?\n/g, " ");
  // Empêche Excel d'interpréter une cellule comme une formule.
  const safe = /^[=+\-@]/.test(v) ? `'${v}` : v;
  return /[;"]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** Export CSV (séparateur « ; » et BOM UTF-8 pour une ouverture directe dans Excel en français). */
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Non autorisé", { status: 401 });
  const filtres = readFiltres(Object.fromEntries(new URL(request.url).searchParams));
  const rows = await db.select().from(inscriptions).where(whereFiltres(filtres)).orderBy(desc(inscriptions.createdAt));

  const lignes = [COLONNES.map(([titre]) => titre), ...rows.map((r) => COLONNES.map(([, get]) => cell(get(r))))];
  const csv = "﻿" + lignes.map((l) => l.join(";")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscriptions-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
