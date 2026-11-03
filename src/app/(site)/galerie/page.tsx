import type { Metadata } from "next";
import { PageHead } from "@/components/site/PageHead";
import { getContent } from "@/lib/content";
import { GalerieGrid } from "./GalerieGrid";

export const metadata: Metadata = { title: "Galerie" };

export default async function GaleriePage() {
  const page = await getContent("galerie");
  const categories = page.categories.map((c) => c.nom).filter((nom) => page.photos.some((p) => p.categorie === nom));

  return (
    <>
      <PageHead eyebrow="Vie scolaire" title={page.titre} intro={page.intro} />
      <div className="container-page py-14 md:py-20">
        {page.photos.length ? (
          <GalerieGrid photos={page.photos} categories={categories} />
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-ink-soft">Les photos arrivent bientôt.</p>
        )}
      </div>
    </>
  );
}
