import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { telLink, whatsappLink } from "@/lib/phone";
import { Logo } from "./Logo";
import { NAV } from "./nav";

const RESEAUX = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["tiktok", "TikTok"],
  ["youtube", "YouTube"],
] as const;

export async function Footer() {
  const site = await getContent("site");
  const reseaux = RESEAUX.filter(([key]) => site.reseaux[key]);

  return (
    <footer className="mt-auto bg-ink text-paper/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo logo={site.logo} sigle={site.sigle} size={48} inverted />
            <p className="font-display text-xl font-semibold text-paper">{site.nom}</p>
          </div>
          <p className="mt-5 max-w-sm leading-relaxed">{site.presentation}</p>
          {site.devise ? <p className="mt-5 font-hand text-2xl text-safran">« {site.devise} »</p> : null}
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-paper/50 uppercase">Plan du site</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-safran">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/inscription" className="hover:text-safran">
                Pré-inscription
              </Link>
            </li>
          </ul>
        </div>

        <address className="not-italic">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-paper/50 uppercase">Nous joindre</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-safran" />
              <span>
                {site.adresse}
                {site.boitePostale ? <span className="block text-paper/60">{site.boitePostale}</span> : null}
              </span>
            </li>
            {site.telephones.map((t) => (
              <li key={t.numero} className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-safran" />
                <a href={telLink(t.numero)} className="hover:text-safran">
                  {t.numero}
                </a>
              </li>
            ))}
            {site.whatsapp ? (
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-safran" />
                <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener" className="hover:text-safran">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {site.email ? (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-safran" />
                <a href={`mailto:${site.email}`} className="break-all hover:text-safran">
                  {site.email}
                </a>
              </li>
            ) : null}
          </ul>
          {reseaux.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {reseaux.map(([key, label]) => (
                <li key={key}>
                  <a
                    href={site.reseaux[key]}
                    target="_blank"
                    rel="noopener"
                    className="inline-block rounded-full border border-paper/20 px-3 py-1 text-sm hover:border-safran hover:text-safran"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </address>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-paper/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {site.nom} · <Link href="/mentions-legales" className="hover:text-paper">Mentions légales</Link>
          </p>
          {site.credit ? <p>{site.credit}</p> : null}
        </div>
      </div>
    </footer>
  );
}
