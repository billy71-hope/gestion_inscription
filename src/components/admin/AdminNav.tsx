"use client";

import { ClipboardList, ExternalLink, LayoutDashboard, LogOut, Mail, Menu, PenLine, Star, UserCog, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/admin/actions";

type Counts = { inscriptions: number; avis: number; messages: number };

const ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/inscriptions", label: "Inscriptions", icon: ClipboardList, count: "inscriptions" },
  { href: "/admin/avis", label: "Avis", icon: Star, count: "avis" },
  { href: "/admin/messages", label: "Messages", icon: Mail, count: "messages" },
  { href: "/admin/contenu", label: "Contenu du site", icon: PenLine },
  { href: "/admin/compte", label: "Mon compte", icon: UserCog },
] as const;

export function AdminNav({ counts }: { counts: Counts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const links = (
    <ul className="space-y-1">
      {ITEMS.map((item) => {
        const active = "exact" in item ? pathname === item.href : pathname.startsWith(item.href);
        const n = "count" in item ? counts[item.count] : 0;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-paper/70 transition-colors hover:bg-paper/5 hover:text-paper aria-[current=page]:bg-paper/10 aria-[current=page]:text-paper"
            >
              <item.icon className="size-[1.1rem]" />
              <span className="flex-1">{item.label}</span>
              {n > 0 ? <span className="rounded-full bg-safran px-2 py-0.5 text-xs font-bold text-ink">{n}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const footer = (
    <div className="space-y-1 border-t border-paper/10 pt-4">
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-paper/70 hover:bg-paper/5 hover:text-paper">
        <ExternalLink className="size-[1.1rem]" /> Voir le site
      </Link>
      <form action={logout}>
        <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-paper/70 hover:bg-paper/5 hover:text-paper">
          <LogOut className="size-[1.1rem]" /> Se déconnecter
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile : barre du haut et tiroir */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-ink px-4 text-paper lg:hidden">
        <span className="font-display text-lg font-semibold">Administration</span>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="admin-menu" className="relative grid size-10 place-items-center rounded-full bg-paper/10">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">Menu</span>
          {!open && counts.inscriptions + counts.avis + counts.messages > 0 ? (
            <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-safran" />
          ) : null}
        </button>
      </div>
      {open ? (
        <nav id="admin-menu" aria-label="Administration" className="fixed inset-x-0 top-16 bottom-0 z-30 flex flex-col justify-between overflow-y-auto bg-ink p-4 lg:hidden">
          {links}
          {footer}
        </nav>
      ) : null}

      {/* Ordinateur : barre latérale */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between bg-ink p-4 lg:flex">
        <div>
          <p className="px-3 pt-2 pb-6 font-display text-xl font-semibold text-paper">Administration</p>
          <nav aria-label="Administration">{links}</nav>
        </div>
        {footer}
      </aside>
    </>
  );
}
