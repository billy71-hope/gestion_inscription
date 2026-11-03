import Link from "next/link";
import { getContent } from "@/lib/content";
import { Logo } from "./Logo";
import { MobileNav, NavLinks } from "./NavLinks";

export async function Header() {
  const site = await getContent("site");
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center gap-6">
        <Link href="/" className="mr-auto flex min-w-0 items-center gap-3">
          <Logo logo={site.logo} sigle={site.sigle} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[1.05rem] font-semibold">{site.nom}</span>
            <span className="block text-xs text-ink-soft">Maternelle → Terminale · Cotonou</span>
          </span>
        </Link>
        <NavLinks />
        <Link href="/inscription" className="btn btn-accent hidden !py-2.5 lg:inline-flex">
          Pré-inscription
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}
