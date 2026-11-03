import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { PageHead } from "@/components/site/PageHead";
import { getContent } from "@/lib/content";
import { telLink, whatsappLink } from "@/lib/phone";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [site, page] = await Promise.all([getContent("site"), getContent("contact")]);

  return (
    <>
      <PageHead eyebrow="Contact" title={page.titre} intro={page.intro} />
      <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-[22rem_1fr] lg:gap-14">
        <address className="space-y-6 not-italic">
          <Info icon={<MapPin />} title="Adresse">
            {site.adresse}
            {site.boitePostale ? <span className="block text-ink-soft">{site.boitePostale}</span> : null}
            {site.carte ? (
              <a href={site.carte} target="_blank" rel="noopener" className="mt-1 inline-block font-semibold underline decoration-safran underline-offset-4">
                Voir sur la carte
              </a>
            ) : null}
          </Info>
          {site.telephones.length ? (
            <Info icon={<Phone />} title="Téléphone">
              {site.telephones.map((t) => (
                <a key={t.numero} href={telLink(t.numero)} className="block hover:text-terracotta">
                  {t.numero}
                </a>
              ))}
            </Info>
          ) : null}
          {site.whatsapp ? (
            <Info icon={<MessageCircle />} title="WhatsApp">
              <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener" className="hover:text-terracotta">
                Écrire sur WhatsApp
              </a>
            </Info>
          ) : null}
          {site.email ? (
            <Info icon={<Mail />} title="E-mail">
              <a href={`mailto:${site.email}`} className="break-all hover:text-terracotta">
                {site.email}
              </a>
            </Info>
          ) : null}
          {site.horaires.length ? (
            <Info icon={<Clock />} title="Horaires du secrétariat">
              <dl className="space-y-1">
                {site.horaires.map((h) => (
                  <div key={h.jours} className="flex justify-between gap-4">
                    <dt className="text-ink-soft">{h.jours}</dt>
                    <dd className="font-medium">{h.heures}</dd>
                  </div>
                ))}
              </dl>
            </Info>
          ) : null}
        </address>

        <div className="card p-5 sm:p-8 md:p-10">
          <h2 className="font-display text-2xl font-semibold">Envoyez-nous un message</h2>
          <ContactForm sujets={page.sujets.map((s) => s.texte)} />
        </div>
      </div>
    </>
  );
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-safran-soft text-terracotta [&>svg]:size-5">{icon}</span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold tracking-wide text-ink-faint uppercase">{title}</h3>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
