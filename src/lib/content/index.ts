import "server-only";
import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { avis, content } from "@/db/schema";
import { defaults, type Content, type ContentKey } from "./defaults";

export const contentTag = (key: ContentKey) => `content-${key}`;
export const AVIS_TAG = "avis-publies";

/** Contenu d'une section : ce qui a été enregistré depuis l'admin, complété par le contenu initial. */
export async function getContent<K extends ContentKey>(key: K): Promise<Content[K]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTag(key));
  const [row] = await db.select({ data: content.data }).from(content).where(eq(content.key, key));
  return { ...defaults[key], ...(row?.data as Partial<Content[K]> | undefined) };
}

export async function getPublishedAvis() {
  "use cache";
  cacheLife("max");
  cacheTag(AVIS_TAG);
  return db
    .select({ id: avis.id, nom: avis.nom, qualite: avis.qualite, note: avis.note, message: avis.message })
    .from(avis)
    .where(eq(avis.statut, "publie"))
    .orderBy(desc(avis.createdAt))
    .limit(12);
}

export type { Content, ContentKey };
