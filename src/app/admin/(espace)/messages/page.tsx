import { desc } from "drizzle-orm";
import { Mail, MailOpen, MessageCircle, Phone, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { deleteMessage, setMessageLu } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { Empty, Loading, PageTitle } from "@/components/admin/ui";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatPhone, telLink, whatsappLink } from "@/lib/phone";
import { formatDate } from "@/lib/text";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Liste />
    </Suspense>
  );
}

async function Liste() {
  await requireAdmin();
  const rows = await db.select().from(messages).orderBy(messages.lu, desc(messages.createdAt));

  return (
    <>
      <PageTitle title="Messages" description="Messages envoyés depuis la page Contact. Les non lus apparaissent en premier." />
      {rows.length ? (
        <ul className="space-y-4">
          {rows.map((m) => (
            <li key={m.id} className={`card p-5 ${m.lu ? "opacity-80" : "border-l-4 border-safran"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {m.nom}
                    {!m.lu ? <span className="ml-2 rounded-full bg-safran px-2 py-0.5 text-xs font-bold">Nouveau</span> : null}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {m.sujet} · {formatDate(m.createdAt, true)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={telLink(m.telephone)} className="btn btn-ghost !px-3 !py-1.5 text-sm">
                    <Phone className="size-4" /> {formatPhone(m.telephone)}
                  </a>
                  <a href={whatsappLink(m.telephone)} target="_blank" rel="noopener" className="btn btn-ghost !px-3 !py-1.5 text-sm">
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                  {m.email ? (
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent(m.sujet)}`} className="btn btn-ghost !px-3 !py-1.5 text-sm">
                      <Mail className="size-4" /> E-mail
                    </a>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 leading-relaxed whitespace-pre-line">{m.message}</p>
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <ActionButton action={setMessageLu.bind(null, m.id, !m.lu)}>
                  <MailOpen className="size-4" /> {m.lu ? "Marquer non lu" : "Marquer comme lu"}
                </ActionButton>
                <ActionButton
                  action={deleteMessage.bind(null, m.id)}
                  confirmMessage="Supprimer définitivement ce message ?"
                  className="btn ml-auto !px-3 !py-1.5 text-sm text-terracotta hover:bg-terracotta-soft"
                >
                  <Trash2 className="size-4" /> Supprimer
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>Aucun message pour le moment.</Empty>
      )}
    </>
  );
}
