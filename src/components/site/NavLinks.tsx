"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "./nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation principale" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="relative rounded-full px-3 py-2 text-[0.93rem] font-medium text-ink-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-safran"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Referme le menu après une navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="grid size-11 place-items-center rounded-full border border-line bg-card"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
        <span className="sr-only">Menu</span>
      </button>
      {open ? (
        <div id="menu-mobile" className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-paper">
          <nav aria-label="Navigation mobile" className="container-page py-6">
            <ul className="divide-y divide-line">
              <li>
                <Link href="/" className="block py-4 font-display text-2xl" aria-current={pathname === "/" ? "page" : undefined}>
                  Accueil
                </Link>
              </li>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="block py-4 font-display text-2xl aria-[current=page]:text-terracotta"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/inscription" className="btn btn-accent mt-6 w-full">
              Pré-inscription en ligne
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
