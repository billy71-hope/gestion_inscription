import { FileText, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/site/PageHead";
import { getContent } from "@/lib/content";
import { telLink, whatsappLink } from "@/lib/phone";
import { InscriptionForm } from "./InscriptionForm";

export const metadata: Metadata = { title: "Pré-inscription" };

export default async function InscriptionPage() {
  const [site, page] = await Promise.all([getContent("site"), getContent("inscription")]);

  return (
    <>
      <PageHead eyebrow={`Année scolaire ${site.anneeScolaire}`} title={page.titre} intro={page.intro} />
      <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <div className="card p-5 sm:p-8 md:p-10">
          {site.inscriptionsOuvertes ? (
            <InscriptionForm classes={page.classes} series={page.series} />
          ) : (
            <div className="space-y-5">
              <p className="text-lg">{page.fermees}</p>
              <div className="flex flex-wrap gap-3">
                {site.telephones[0] ? (
                  <a href={telLink(site.telephones[0].numero)} className="btn btn-primary">
                    <Phone className="size-4" /> {site.telephones[0].numero}
                  </a>
                ) : null}
                {site.whatsapp ? (
                  <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener" className="btn btn-ghost">
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">Et ensuite ?</h2>
            <ol className="mt-5 space-y-5">
              {page.etapes.map((e, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-safran font-display font-semibold">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{e.titre}</p>
                    <p className="text-ink-soft">{e.texte}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {page.pieces.length ? (
            <div className="rounded-2xl border border-line p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <FileText className="size-4 text-terracotta" /> Pièces à fournir
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft">
                {page.pieces.map((p) => (
                  <li key={p.texte}>{p.texte}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-ink-soft">
            Une question sur les tarifs ? Consultez les{" "}
            <Link href="/frais" className="font-semibold text-ink underline decoration-safran underline-offset-4">
              frais de scolarité
            </Link>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
