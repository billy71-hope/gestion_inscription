import type { Metadata } from "next";
import Image from "next/image";
import { PageHead } from "@/components/site/PageHead";
import { accent } from "@/components/site/nav";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Notre équipe" };

function initials(nom: string) {
  return nom
    .replace(/^(Mr|M\.|Mme|Mlle|Dr)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function EquipePage() {
  const page = await getContent("equipe");

  return (
    <>
      <PageHead eyebrow="Notre équipe" title={page.titre} intro={page.intro}>
        <dl className="rise mt-10 flex flex-wrap gap-x-10 gap-y-4" style={{ animationDelay: "180ms" }}>
          {page.chiffres.map((c) => (
            <div key={c.libelle}>
              <dt className="sr-only">{c.libelle}</dt>
              <dd>
                <span className="font-display text-4xl font-semibold">{c.valeur}</span>
                <span className="block text-ink-soft">{c.libelle}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageHead>

      <div className="container-page space-y-16 py-16 md:py-20">
        {page.groupes.map((g, gi) => {
          const a = accent("", gi);
          return (
            <section key={g.titre}>
              <h2 className="flex items-center gap-3 font-display text-3xl font-semibold">
                <span className={`h-8 w-1.5 rounded-full ${a.bg}`} /> {g.titre}
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.membres.map((m) => (
                  <li key={m.nom} className="card flex items-center gap-4 p-4">
                    {m.photo ? (
                      <Image src={m.photo} alt="" width={72} height={72} className="size-[4.5rem] shrink-0 rounded-2xl object-cover" />
                    ) : (
                      <span className={`grid size-[4.5rem] shrink-0 place-items-center rounded-2xl font-display text-xl font-semibold ${a.soft} ${a.text}`} aria-hidden="true">
                        {initials(m.nom)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-tight font-semibold">{m.nom}</p>
                      <p className="text-sm font-medium">{m.fonction}</p>
                      {m.matiere ? <p className="text-sm text-ink-soft">{m.matiere}</p> : null}
                      {m.diplome ? <p className="mt-1 inline-block rounded-full bg-paper-deep px-2 py-0.5 text-xs">{m.diplome}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
