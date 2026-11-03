import { count, desc, eq, gte, sql } from "drizzle-orm";
import { ArrowRight, ClipboardList, Mail, PenLine, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { INSCRIPTION_LABELS } from "@/components/admin/labels";
import { Badge, Empty, Loading, PageTitle } from "@/components/admin/ui";
import { db } from "@/db";
import { avis, INSCRIPTION_STATUTS, inscriptions, messages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { formatDate } from "@/lib/text";

export const metadata: Metadata = { title: "Tableau de bord" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const site = await getContent("site");

  const [parStatut, [cetteSemaine], dernieres, [avisAttente], [messagesNonLus], parClasse] = await Promise.all([
    db.select({ statut: inscriptions.statut, n: count() }).from(inscriptions).where(eq(inscriptions.anneeScolaire, site.anneeScolaire)).groupBy(inscriptions.statut),
    db.select({ n: count() }).from(inscriptions).where(gte(inscriptions.createdAt, sql`now() - interval '7 days'`)),
    db.select().from(inscriptions).orderBy(desc(inscriptions.createdAt)).limit(6),
    db.select({ n: count() }).from(avis).where(eq(avis.statut, "en_attente")),
    db.select({ n: count() }).from(messages).where(eq(messages.lu, false)),
    db
      .select({ classe: inscriptions.classe, n: count() })
      .from(inscriptions)
      .where(eq(inscriptions.anneeScolaire, site.anneeScolaire))
      .groupBy(inscriptions.classe)
      .orderBy(sql`count(*) desc`)
      .limit(8),
  ]);

  const total = parStatut.reduce((s, r) => s + r.n, 0);
  const nb = (statut: string) => parStatut.find((r) => r.statut === statut)?.n ?? 0;
  const maxClasse = Math.max(1, ...parClasse.map((c) => c.n));

  return (
    <>
      <PageTitle title="Tableau de bord" description={`Pré-inscriptions de l'année ${site.anneeScolaire}.`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Demandes reçues" value={total} hint={`${cetteSemaine.n} ces 7 derniers jours`} href="/admin/inscriptions" />
        <Stat label="À traiter" value={nb("nouvelle")} hint="Parents pas encore contactés" href="/admin/inscriptions?statut=nouvelle" accent />
        <Stat label="Admis" value={nb("admise")} hint={`${nb("dossier")} dossier(s) en cours`} href="/admin/inscriptions?statut=admise" />
        <Stat label="À modérer" value={avisAttente.n + messagesNonLus.n} hint={`${avisAttente.n} avis · ${messagesNonLus.n} message(s)`} href={avisAttente.n ? "/admin/avis" : "/admin/messages"} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold">Dernières demandes</h2>
            <Link href="/admin/inscriptions" className="flex items-center gap-1 text-sm font-semibold text-encre">
              Tout voir <ArrowRight className="size-4" />
            </Link>
          </div>
          {dernieres.length ? (
            <ul className="mt-4 divide-y divide-line">
              {dernieres.map((i) => (
                <li key={i.id}>
                  <Link href={`/admin/inscriptions/${i.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 hover:bg-paper/60">
                    <span className="min-w-0 flex-1">
                      <span className="font-semibold">
                        {i.nomEleve} {i.prenomEleve}
                      </span>
                      <span className="block text-sm text-ink-soft">
                        {i.classe}
                        {i.serie ? ` · Série ${i.serie}` : ""} · {formatDate(i.createdAt)}
                      </span>
                    </span>
                    <Badge {...INSCRIPTION_LABELS[i.statut]} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <Empty>Aucune demande pour le moment. Elles apparaîtront ici dès qu&apos;un parent remplit le formulaire.</Empty>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="card p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">Par statut</h2>
            <ul className="mt-4 space-y-2">
              {INSCRIPTION_STATUTS.map((s) => (
                <li key={s}>
                  <Link href={`/admin/inscriptions?statut=${s}`} className="flex items-center justify-between rounded-lg px-1 py-1 hover:bg-paper">
                    <Badge {...INSCRIPTION_LABELS[s]} />
                    <span className="font-semibold tabular-nums">{nb(s)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          {parClasse.length ? (
            <section className="card p-5 md:p-6">
              <h2 className="font-display text-xl font-semibold">Classes les plus demandées</h2>
              <ul className="mt-4 space-y-2.5">
                {parClasse.map((c) => (
                  <li key={c.classe} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <span className="truncate">{c.classe}</span>
                    <span className="h-2 rounded-full bg-paper-deep">
                      <span className="block h-full rounded-full bg-encre" style={{ width: `${(c.n / maxClasse) * 100}%` }} />
                    </span>
                    <span className="text-right font-semibold tabular-nums">{c.n}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Shortcut href="/admin/contenu" icon={<PenLine />} title="Modifier le site" text="Textes, photos, frais, équipe…" />
        <Shortcut href="/admin/avis" icon={<Star />} title="Modérer les avis" text="Publier ou refuser les témoignages" />
        <Shortcut href="/admin/messages" icon={<Mail />} title="Lire les messages" text="Formulaire de contact" />
      </section>
      <p className="mt-6 flex items-center gap-2 text-sm text-ink-faint">
        <ClipboardList className="size-4" /> Les inscriptions ouvertes ou fermées et l&apos;année scolaire se règlent dans Contenu du site → Informations de l&apos;école.
      </p>
    </>
  );
}

function Stat({ label, value, hint, href, accent = false }: { label: string; value: number; hint: string; href: string; accent?: boolean }) {
  return (
    <Link href={href} className={`card block p-5 transition-transform hover:-translate-y-0.5 ${accent && value > 0 ? "ring-2 ring-safran" : ""}`}>
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-4xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-ink-faint">{hint}</p>
    </Link>
  );
}

function Shortcut({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-card/60 p-4 hover:border-ink/30">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-safran-soft text-terracotta [&>svg]:size-5">{icon}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="text-sm text-ink-soft">{text}</span>
      </span>
    </Link>
  );
}
