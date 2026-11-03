import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Media } from "@/components/site/Media";
import { PageHead } from "@/components/site/PageHead";
import { accent } from "@/components/site/nav";
import { getContent } from "@/lib/content";
import { slugify } from "@/lib/slug";
import { paragraphs } from "@/lib/text";

export const metadata: Metadata = { title: "Nos cycles" };

export default async function CyclesPage() {
  const page = await getContent("cycles");

  return (
    <>
      <PageHead eyebrow="Nos cycles" title={page.titre} intro={page.intro}>
        <nav aria-label="Cycles" className="rise mt-8 flex flex-wrap gap-2" style={{ animationDelay: "180ms" }}>
          {page.cycles.map((c, i) => (
            <a key={c.nom} href={`#${slugify(c.nom)}`} className="btn btn-ghost !py-2">
              <span className={`size-2.5 rounded-full ${accent(c.couleur, i).bg}`} /> {c.nom}
            </a>
          ))}
        </nav>
      </PageHead>

      {page.cycles.map((c, i) => {
        const a = accent(c.couleur, i);
        return (
          <section key={c.nom} id={slugify(c.nom)} className={`scroll-mt-20 ${i % 2 ? "bg-paper-deep" : ""}`}>
            <div className="container-page grid items-start gap-12 py-20 md:py-24 lg:grid-cols-2 lg:gap-20">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <p className={`font-display text-sm font-semibold ${a.text}`}>
                  0{i + 1} · {c.niveaux}
                </p>
                <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{c.nom}</h2>
                <p className="mt-2 font-hand text-2xl text-ink-soft">{c.accroche}</p>
                {paragraphs(c.description).map((p, j) => (
                  <p key={j} className="mt-5 text-lg leading-relaxed text-ink-soft">
                    {p}
                  </p>
                ))}
                <ul className="mt-8 space-y-3">
                  {c.points.map((p) => (
                    <li key={p.texte} className="flex gap-3">
                      <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-paper ${a.bg}`}>
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {p.texte}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-5">
                <Media src={c.image} alt={c.nom} tone={c.couleur} label={c.nom} className="aspect-[4/3] rounded-[2rem]" />
                <div className={`rounded-2xl p-6 ${a.soft}`}>
                  <h3 className="font-semibold">Horaires</h3>
                  <dl className="mt-3 divide-y divide-ink/10">
                    {c.horaires.map((h) => (
                      <div key={h.label} className="flex justify-between gap-4 py-2">
                        <dt className="text-ink-soft">{h.label}</dt>
                        <dd className="font-semibold">{h.valeur}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="container-page py-20 text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">Prêt à inscrire votre enfant ?</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/inscription" className="btn btn-primary">
            Pré-inscription en ligne <ArrowRight className="size-4" />
          </Link>
          <Link href="/frais" className="btn btn-ghost">
            Voir les frais
          </Link>
        </div>
      </section>
    </>
  );
}
