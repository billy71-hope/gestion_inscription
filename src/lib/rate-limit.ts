import "server-only";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { rateEvents } from "@/db/schema";

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "inconnue";
}

/**
 * Enregistre une tentative et indique si la limite est dépassée
 * (`max` tentatives par IP sur `minutes`).
 */
export async function hitRateLimit(bucket: string, max: number, minutes: number) {
  const ip = await clientIp();
  const since = new Date(Date.now() - minutes * 60_000);
  const [{ value }] = await db
    .select({ value: count() })
    .from(rateEvents)
    .where(and(eq(rateEvents.bucket, bucket), eq(rateEvents.ip, ip), gte(rateEvents.createdAt, since)));
  if (value >= max) return true;
  await db.insert(rateEvents).values({ bucket, ip });
  // Nettoyage opportuniste des entrées de plus d'un jour.
  await db.delete(rateEvents).where(lt(rateEvents.createdAt, new Date(Date.now() - 86_400_000)));
  return false;
}

export async function clearRateLimit(bucket: string) {
  const ip = await clientIp();
  await db.delete(rateEvents).where(and(eq(rateEvents.bucket, bucket), eq(rateEvents.ip, ip)));
}
