import type { Metadata } from "next";
import { PageHead } from "@/components/site/PageHead";
import { getContent } from "@/lib/content";
import { paragraphs } from "@/lib/text";

export const metadata: Metadata = { title: "Mentions légales" };

export default async function MentionsPage() {
  const page = await getContent("mentions");
  return (
    <>
      <PageHead eyebrow="Informations" title={page.titre} />
      <article className="container-page max-w-3xl py-14 md:py-20">
        {paragraphs(page.texte).flatMap((block, i) =>
          block.split("\n").map((line, j) =>
            line.startsWith("## ") ? (
              <h2 key={`${i}-${j}`} className="mt-10 font-display text-2xl font-semibold first:mt-0">
                {line.slice(3)}
              </h2>
            ) : (
              <p key={`${i}-${j}`} className="mt-4 leading-relaxed text-ink-soft">
                {line}
              </p>
            ),
          ),
        )}
      </article>
    </>
  );
}
