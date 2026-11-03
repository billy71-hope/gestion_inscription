import { ArrowRight, Check, Clock, Quote, Star } from "lucide-react";
import Link from "next/link";
import { Media } from "@/components/site/Media";
import { SectionTitle } from "@/components/site/PageHead";
import { accent } from "@/components/site/nav";
import { getContent, getPublishedAvis } from "@/lib/content";
import { slugify } from "@/lib/slug";
import { paragraphs } from "@/lib/text";
import { AvisForm } from "./AvisForm";

export default async function HomePage() {
  const [site, accueil, cycles, galerie, avis] = await Promise.all([
    getContent("site"),
    getContent("accueil"),
    getContent("cycles"),
    getContent("galerie"),
    getPublishedAvis(),
  ]);
  const { hero, fondateur } = accueil;
  const photos = galerie.photos.slice(0, 5);

  return (
    <>
      {/* Bannière */}
      <section className="seyes relative overflow-hidden border-b border-line">
        <div className="container-page grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pl-28">
          <div>
            {site.inscriptionsOuvertes ? (
              <Link
                href="/inscription"
                className="rise inline-flex items-center gap-2 rounded-full border border-sauge/30 bg-sauge-soft px-3.5 py-1.5 text-sm font-semibold text-sauge"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-sauge opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-sauge" />
                </span>
                Inscriptions {site.anneeScolaire} ouvertes
              </Link>
            ) : null}
            <p className="eyebrow rise mt-6" style={{ animationDelay: "40ms" }}>
              {hero.surtitre}
            </p>
            <h1
              className="rise mt-3 font-display text-[2.7rem] leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              {hero.titre}
            </h1>
            <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "140ms" }}>
              {hero.texte}
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
              <Link href="/inscription" className="btn btn-primary">
                {hero.boutonPrincipal} <ArrowRight className="size-4" />
              </Link>
              <Link href="/ecole" className="btn btn-ghost">
                {hero.boutonSecondaire}
              </Link>
            </div>
          </div>

          <div className={`rise relative mx-auto w-full max-w-md lg:block lg:max-w-none ${hero.image ? "" : "hidden"}`} style={{ animationDelay: "160ms" }}>
            <div className="card rotate-[1.5deg] p-3 pb-12">
              <Media src={hero.image} alt={`${site.nom}`} tone="encre" label={site.sigle} priority className="aspect-[4/5] rounded-xl sm:aspect-[5/5]" />
              <p className="absolute bottom-3 left-0 w-full text-center font-hand text-2xl text-ink-soft">{site.devise.split(":")[0]}</p>
            </div>
            <div className="card absolute -bottom-6 -left-4 -rotate-3 px-5 py-4 sm:-left-8">
              <p className="font-display text-4xl font-semibold">{accueil.chiffres[1]?.valeur}</p>
              <p className="text-sm text-ink-soft">{accueil.chiffres[1]?.libelle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-ink text-paper">
        <dl className="container-page grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4 md:py-14">
          {accueil.chiffres.map((c, i) => (
            <div key={i} className="border-paper/15 px-2 md:border-l md:px-6 md:first:border-l-0">
              <dt className="sr-only">{c.libelle}</dt>
              <dd>
                <span className="block font-display text-4xl font-semibold text-safran md:text-5xl">{c.valeur}</span>
                <span className="mt-1 block text-paper/70">{c.libelle}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Cycles */}
      <section className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle eyebrow="Nos cycles" title={cycles.intro} />
          <Link href="/cycles" className="btn btn-ghost">
            Tous les cycles <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cycles.cycles.map((c, i) => {
            const a = accent(c.couleur, i);
            return (
              <li key={c.nom}>
                <Link href={`/cycles#${slugify(c.nom)}`} className="card group flex h-full flex-col overflow-hidden transition-transform hover:-translate-y-1">
                  <div className={`h-2 ${a.bg}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <span className={`font-display text-sm font-semibold ${a.text}`}>0{i + 1}</span>
                    <h3 className="mt-2 font-display text-2xl font-semibold">{c.nom}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">{c.accroche}</p>
                    <p className="mt-auto flex items-center gap-2 pt-6 text-sm text-ink-soft">
                      <Clock className="size-4" /> {c.horaires[0]?.valeur}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Mot du fondateur */}
      <section className="bg-paper-deep">
        <div className="container-page grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-sm">
            <Media src={fondateur.photo} alt={fondateur.nom} tone="terracotta" label="✦" className="aspect-[4/5] rounded-[2rem]" sizes="(min-width: 1024px) 30vw, 90vw" />
            <div className="card absolute -right-4 -bottom-6 max-w-[16rem] rotate-2 p-4 sm:-right-10">
              <p className="font-display font-semibold">{fondateur.nom}</p>
              <p className="text-sm text-ink-soft">{fondateur.fonction}</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Mot du fondateur</p>
            <h2 className="mt-2 font-display text-3xl leading-tight font-semibold text-balance md:text-[2.6rem]">{fondateur.titre}</h2>
            {paragraphs(fondateur.texte).map((p, i) => (
              <p key={i} className="mt-4 text-lg leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {fondateur.engagements.map((e) => (
                <li key={e.texte} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sauge text-paper">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {e.texte}
                </li>
              ))}
            </ul>
            {fondateur.citation ? (
              <blockquote className="relative mt-10 border-l-4 border-safran pl-6">
                <Quote className="absolute -top-2 -left-2 size-5 -translate-x-full text-safran" aria-hidden="true" />
                <p className="font-hand text-[1.7rem] leading-snug text-ink">{fondateur.citation}</p>
              </blockquote>
            ) : null}
          </div>
        </div>
      </section>

      {/* Galerie */}
      {photos.length ? (
        <section className="container-page py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow="Vie scolaire" title="Un aperçu de notre établissement" />
            <Link href="/galerie" className="btn btn-ghost">
              Toute la galerie <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-3 md:auto-rows-[14rem] md:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.image} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                <Media src={p.image} alt={p.legende} className="size-full rounded-2xl" sizes="(min-width: 768px) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Témoignages */}
      <section id="avis" className={photos.length ? "bg-paper-deep" : ""}>
        <div className="container-page grid gap-12 py-20 md:py-28 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <SectionTitle eyebrow="Témoignages" title={accueil.avis.titre} intro={accueil.avis.intro} />
            {avis.length ? (
              <ul className="mt-10 grid gap-5 sm:grid-cols-2">
                {avis.map((a) => (
                  <li key={a.id} className="card flex flex-col p-6">
                    <p className="flex gap-0.5 text-safran" aria-label={`${a.note} sur 5`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`size-4 ${i < a.note ? "fill-current" : "opacity-30"}`} />
                      ))}
                    </p>
                    <blockquote className="mt-4 flex-1 leading-relaxed">« {a.message} »</blockquote>
                    <p className="mt-5 border-t border-line pt-4">
                      <span className="font-semibold">{a.nom}</span>
                      <span className="block text-sm text-ink-soft">{a.qualite}</span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-10 rounded-2xl border border-dashed border-line p-6 text-ink-soft">
                Soyez le premier à partager votre expérience avec les familles qui découvrent l&apos;école.
              </p>
            )}
          </div>
          <div className="card h-fit p-6 md:p-8">
            <h3 className="font-display text-2xl font-semibold">Partagez votre expérience</h3>
            <p className="mt-2 text-ink-soft">Votre témoignage sera publié après relecture par l&apos;école.</p>
            <AvisForm />
          </div>
        </div>
      </section>

      {/* Inscription */}
      <section className="bg-ink text-paper">
        <div className="container-page py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow !text-safran">Inscriptions {site.anneeScolaire}</p>
              <h2 className="mt-2 font-display text-3xl leading-tight font-semibold md:text-[2.6rem]">Rejoignez la famille {site.sigle}</h2>
            </div>
            <Link href="/inscription" className="btn btn-accent">
              Commencer la pré-inscription <ArrowRight className="size-4" />
            </Link>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
            {accueil.etapes.map((e, i) => (
              <li key={i} className="bg-ink p-6 md:p-8">
                <span className="font-display text-5xl font-semibold text-safran/90">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-paper">{e.titre}</h3>
                <p className="mt-1 text-paper/65">{e.texte}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-paper/60">
            Consultez aussi les{" "}
            <Link href="/frais" className="text-paper underline decoration-safran underline-offset-4">
              frais de scolarité
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
