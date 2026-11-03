import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SectionEditor } from "@/components/admin/editor/SectionEditor";
import { Loading, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getContent, type ContentKey } from "@/lib/content";
import { getSection } from "@/lib/content/sections";

export const metadata: Metadata = { title: "Modifier le contenu" };

export default function SectionPage(props: PageProps<"/admin/contenu/[section]">) {
  return (
    <Suspense fallback={<Loading />}>
      <Editor params={props.params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ section: string }> }) {
  await requireAdmin();
  const { section: key } = await params;
  const section = getSection(key);
  if (!section) notFound();
  const data = await getContent(key as ContentKey);

  return (
    <>
      <Link href="/admin/contenu" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" /> Contenu du site
      </Link>
      <PageTitle
        title={section.label}
        description={section.description}
        actions={
          <Link href={section.path} target="_blank" className="btn btn-ghost !py-2.5">
            <ExternalLink className="size-4" /> Voir la page
          </Link>
        }
      />
      <div className="max-w-4xl">
        <SectionEditor key={key} sectionKey={key} fields={section.fields} initial={data} />
      </div>
    </>
  );
}
