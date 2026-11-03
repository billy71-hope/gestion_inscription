import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#contenu" className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
