import type { Metadata } from "next";
import { Caveat, Figtree, Fraunces } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: ["500", "700"] });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent("site");
  return {
    title: { default: `${site.nom} — École à Cotonou`, template: `%s — ${site.nom}` },
    description: site.presentation,
    icons: site.logo ? { icon: site.logo } : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${figtree.variable} ${caveat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
