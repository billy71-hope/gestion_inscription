import { ArrowRight, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SectionTitle } from "@/components/site/PageHead";
import { accent } from "@/components/site/nav";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Résultats" };

export default async function ResultatsPage() {
  const page = await getContent("resultats");

  return (
    <>
      <PageHead eyebrow="Résultats" title={page.titre} intro={page.intro} />

      <section className="container-page py-14 md:py-20">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {page.chiffres.map((c, i) => (
            <div key={i} className="card p-6">
              <dt className="sr-only">{c.libelle}</dt>
              <dd>
                <span className={`font-display text-5xl font-semibold ${accent("", i).text}`}>
                  {c.valeur}
                  {c.suffixe}
                </span>
                <span className="mt-2 block font-medium">{c.libelle}</span>
                <span className="block text-sm text-ink-faint">{c.periode}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {page.evolutions.length ? (
        <section className="bg-paper-deep">
          <div className="container-page py-20 md:py-24">
            <SectionTitle eyebrow="Progression" title="Taux de réussite, année après année" />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {page.evolutions.map((ev, i) => {
                const a = accent("", i + 1);
                const last = ev.annees.length - 1;
                return (
                  <figure key={ev.examen} className="card p-6 md:p-8">
                    <figcaption className="font-display text-2xl font-semibold">{ev.examen}</figcaption>
                    <ul className="mt-6 space-y-4">
                      {ev.annees.map((y, j) => (
                        <li key={y.annee} className="grid grid-cols-[6rem_1fr_3rem] items-center gap-3 text-sm">
                          <span className="text-ink-soft">{y.annee}</span>
                          <span className="h-3 overflow-hidden rounded-full bg-paper-deep">
                            <span
                              className={`block h-full rounded-full ${j === last ? a.bg : "bg-ink/25"}`}
                              style={{ width: `${Math.max(0, Math.min(100, y.taux))}%` }}
                            />
                          </span>
                          <span className={`text-right font-semibold tabular-nums ${j === last ? a.text : ""}`}>{y.taux} %</span>
                        </li>
                      ))}
                    </ul>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {page.palmares.eleves.length ? (
        <section className="container-page py-20 md:py-24">
          <SectionTitle eyebrow="Palmarès" title={page.palmares.titre} />
          <ol className="mt-10 space-y-3">
            {page.palmares.eleves.map((e, i) => (
              <li key={e.nom} className={`card flex flex-wrap items-center gap-x-6 gap-y-2 p-5 ${i === 0 ? "ring-2 ring-safran" : ""}`}>
                <span className={`grid size-12 shrink-0 place-items-center rounded-full font-display font-semibold ${i < 3 ? "bg-safran" : "bg-paper-deep"}`}>
                  {i === 0 ? <Trophy className="size-5" /> : e.rang}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-semibold">{e.nom}</p>
                  <p className="text-ink-soft">
                    {e.filiere} · Mention {e.mention}
                  </p>
                </div>
                <p className="font-display text-2xl font-semibold tabular-nums">
                  {e.moyenne}
                  <span className="text-base text-ink-faint">/20</span>
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="bg-ink text-paper">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-14">
          <h2 className="font-display text-3xl font-semibold">Votre enfant peut être le prochain lauréat.</h2>
          <Link href="/inscription" className="btn btn-accent">
            Inscrire mon enfant <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
