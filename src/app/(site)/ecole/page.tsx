import type { Metadata } from "next";
import { Media } from "@/components/site/Media";
import { PageHead, SectionTitle } from "@/components/site/PageHead";
import { accent, ACCENT_ORDER } from "@/components/site/nav";
import { getContent } from "@/lib/content";
import { paragraphs } from "@/lib/text";

export const metadata: Metadata = { title: "L'école" };

export default async function EcolePage() {
  const page = await getContent("ecole");

  return (
    <>
      <PageHead eyebrow="L'école" title={page.titre} intro={page.intro} />

      <section className="container-page grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionTitle eyebrow="Présentation" title={page.presentation.titre} />
          {paragraphs(page.presentation.texte).map((p, i) => (
            <p key={i} className="mt-4 text-lg leading-relaxed text-ink-soft first-of-type:mt-6">
              {p}
            </p>
          ))}
        </div>
        <Media src={page.presentation.image} alt={page.presentation.titre} tone="sauge" label="2011" className="aspect-[4/3] rounded-[2rem]" />
      </section>

      <section className="bg-ink text-paper">
        <div className="container-page py-20 md:py-28">
          <p className="eyebrow !text-safran">Nos valeurs</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-[2.6rem]">Ce qui nous définit</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
            {page.valeurs.map((v, i) => (
              <li key={v.titre} className="bg-ink p-7">
                <span className={`inline-block size-3 rounded-full ${accent("", i).bg}`} />
                <h3 className="mt-4 font-display text-2xl font-semibold">{v.titre}</h3>
                <p className="mt-2 text-paper/70">{v.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <SectionTitle eyebrow="Notre histoire" title="Les grandes dates" />
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute top-[1.15rem] right-0 left-0 hidden h-px bg-line md:block" />
          {page.histoire.map((h, i) => (
            <li key={i} className="relative">
              <span className={`relative inline-block rounded-full px-3 py-1 font-display font-semibold ${i === page.histoire.length - 1 ? "bg-safran" : "bg-card shadow-[var(--shadow-card)]"}`}>
                {h.annee}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{h.titre}</h3>
              <p className="mt-1 text-ink-soft">{h.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-paper-deep">
        <div className="container-page py-20 md:py-28">
          <SectionTitle eyebrow="Infrastructures" title="Des équipements pensés pour apprendre" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {page.infrastructures.map((inf, i) => (
              <li key={inf.titre} className="card overflow-hidden">
                <Media src={inf.image} alt={inf.titre} tone={ACCENT_ORDER[i % ACCENT_ORDER.length]} className="aspect-[16/10]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{inf.titre}</h3>
                  <p className="mt-1 text-ink-soft">{inf.texte}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
