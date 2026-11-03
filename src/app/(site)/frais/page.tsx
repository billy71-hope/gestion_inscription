import { ArrowRight, BadgePercent, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/site/PageHead";
import { accent } from "@/components/site/nav";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Frais de scolarité" };

export default async function FraisPage() {
  const page = await getContent("frais");

  return (
    <>
      <PageHead eyebrow={`Tarifs ${page.periode}`} title={page.titre} intro={page.intro} />

      <div className="container-page space-y-8 py-14 md:py-20">
        <p className="text-ink-soft">{page.devise}</p>
        {page.groupes.map((g, i) => {
          const a = accent("", i);
          const withSerie = g.lignes.some((l) => l.serie);
          return (
            <section key={g.cycle} className="card overflow-hidden">
              <h2 className={`flex items-center gap-3 px-6 py-4 font-display text-2xl font-semibold ${a.soft}`}>
                <span className={`size-3 rounded-full ${a.bg}`} /> {g.cycle}
              </h2>
              {/* Tableau sur écran large, fiches sur mobile */}
              <table className="hidden w-full text-left md:table">
                <thead className="text-sm text-ink-faint">
                  <tr className="border-b border-line">
                    <th className="px-6 py-3 font-semibold">Classe</th>
                    {withSerie ? <th className="px-6 py-3 font-semibold">Série</th> : null}
                    <th className="px-6 py-3 text-right font-semibold">Inscription</th>
                    <th className="px-6 py-3 text-right font-semibold">Scolarité annuelle</th>
                    <th className="px-6 py-3 text-right font-semibold">Par trimestre</th>
                  </tr>
                </thead>
                <tbody>
                  {g.lignes.map((l) => (
                    <tr key={l.classe + l.serie} className="border-b border-line last:border-0">
                      <th scope="row" className="px-6 py-4 font-semibold">
                        {l.classe}
                      </th>
                      {withSerie ? <td className="px-6 py-4 text-ink-soft">{l.serie}</td> : null}
                      <td className="px-6 py-4 text-right tabular-nums">{l.inscription} F</td>
                      <td className="px-6 py-4 text-right font-display text-lg font-semibold tabular-nums">{l.scolarite} F</td>
                      <td className="px-6 py-4 text-right tabular-nums">{l.trimestre} F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="divide-y divide-line md:hidden">
                {g.lignes.map((l) => (
                  <li key={l.classe + l.serie} className="px-5 py-4">
                    <p className="font-semibold">
                      {l.classe}
                      {l.serie ? <span className="font-normal text-ink-soft"> · {l.serie}</span> : null}
                    </p>
                    <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <dt className="text-ink-faint">Inscription</dt>
                        <dd className="tabular-nums">{l.inscription} F</dd>
                      </div>
                      <div>
                        <dt className="text-ink-faint">Année</dt>
                        <dd className="font-semibold tabular-nums">{l.scolarite} F</dd>
                      </div>
                      <div>
                        <dt className="text-ink-faint">Trimestre</dt>
                        <dd className="tabular-nums">{l.trimestre} F</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
              {g.note ? <p className="border-t border-line px-6 py-3 text-sm text-ink-soft">{g.note}</p> : null}
            </section>
          );
        })}

        <div className="grid gap-5 md:grid-cols-2">
          <List icon={<Wallet />} title="Modalités de paiement" items={page.modalites} />
          <List icon={<BadgePercent />} title="Réductions" items={page.reductions} />
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/inscription" className="btn btn-primary">
            Procéder à la pré-inscription <ArrowRight className="size-4" />
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Une question ? Contactez-nous
          </Link>
        </div>
      </div>
    </>
  );
}

function List({ icon, title, items }: { icon: React.ReactNode; title: string; items: { texte: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-[var(--radius-card)] border border-line p-6">
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold">
        <span className="text-terracotta [&>svg]:size-5">{icon}</span> {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it.texte} className="flex gap-3 text-ink-soft">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-safran" /> {it.texte}
          </li>
        ))}
      </ul>
    </section>
  );
}
