import { eq } from "drizzle-orm";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { INSCRIPTION_LABELS } from "@/components/admin/labels";
import { Badge, Loading } from "@/components/admin/ui";
import { db } from "@/db";
import { inscriptions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { formatPhone, telLink, whatsappLink } from "@/lib/phone";
import { age, formatDate } from "@/lib/text";
import { DeleteInscription, StatutForm } from "./StatutForm";

export const metadata: Metadata = { title: "Demande de pré-inscription" };

export default function InscriptionPage(props: PageProps<"/admin/inscriptions/[id]">) {
  return (
    <Suspense fallback={<Loading />}>
      <Fiche params={props.params} />
    </Suspense>
  );
}

async function Fiche({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[i], site] = await Promise.all([db.select().from(inscriptions).where(eq(inscriptions.id, id)), getContent("site")]);
  if (!i) notFound();

  const salutation = `Bonjour ${i.parentNom}, ici le secrétariat de ${site.nom}. Nous avons bien reçu la demande de pré-inscription de ${i.prenomEleve} ${i.nomEleve} en ${i.classe}.`;

  return (
    <>
      <Link href="/admin/inscriptions" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" /> Toutes les inscriptions
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">
            Demande n° {i.id} · reçue le {formatDate(i.createdAt, true)} · année {i.anneeScolaire}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
            {i.nomEleve} {i.prenomEleve}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2">
            <Badge {...INSCRIPTION_LABELS[i.statut]} />
            <span className="text-ink-soft">
              {i.classe}
              {i.serie ? ` · Série ${i.serie}` : ""}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={telLink(i.telephone)} className="btn btn-ghost !py-2.5">
            <Phone className="size-4" /> Appeler
          </a>
          <a href={whatsappLink(i.telephone, salutation)} target="_blank" rel="noopener" className="btn btn-primary !py-2.5">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="card p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">Élève</h2>
            <Infos
              items={[
                ["Nom", i.nomEleve],
                ["Prénom(s)", i.prenomEleve],
                ["Sexe", i.sexe === "F" ? "Fille" : "Garçon"],
                ["Date de naissance", `${formatDate(i.dateNaissance)} (${age(i.dateNaissance)} ans)`],
                ["Classe demandée", i.classe],
                ["Série", i.serie],
                ["École actuelle", i.ecoleOrigine],
              ]}
            />
          </section>
          <section className="card p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">Parent ou tuteur</h2>
            <Infos
              items={[
                ["Nom", i.parentNom],
                ["Lien", i.parentLien],
                ["Téléphone", formatPhone(i.telephone)],
                ["E-mail", i.email],
              ]}
            />
            {i.email ? (
              <a href={`mailto:${i.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-encre">
                <Mail className="size-4" /> Écrire un e-mail
              </a>
            ) : null}
          </section>
          {i.message ? (
            <section className="card p-5 md:p-6">
              <h2 className="font-display text-xl font-semibold">Message du parent</h2>
              <p className="mt-3 leading-relaxed whitespace-pre-line">{i.message}</p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className="card p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">Suivi du dossier</h2>
            <StatutForm id={i.id} statut={i.statut} notes={i.notes ?? ""} />
            <p className="mt-4 text-xs text-ink-faint">Dernière modification : {formatDate(i.updatedAt, true)}</p>
          </section>
          <DeleteInscription id={i.id} />
        </aside>
      </div>
    </>
  );
}

function Infos({ items }: { items: [string, string | null][] }) {
  return (
    <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm text-ink-faint">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
    </dl>
  );
}
