"use server";

import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { admin, AVIS_STATUTS, avis, content, INSCRIPTION_STATUTS, inscriptions, messages } from "@/db/schema";
import { createSession, destroySession, getAdminAccount, requireAdmin } from "@/lib/auth";
import { AVIS_TAG, contentTag, type ContentKey } from "@/lib/content";
import { sectionSchema } from "@/lib/content/fields";
import { getSection } from "@/lib/content/sections";
import { clearRateLimit, hitRateLimit } from "@/lib/rate-limit";

export type ActionState = { ok?: boolean; error?: string; message?: string };

// ─── Connexion ──────────────────────────────────────────────────────────────

export async function login(_: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (await hitRateLimit("login", 5, 15)) {
    return { error: "Trop de tentatives. Réessayez dans 15 minutes." };
  }
  const account = await getAdminAccount();
  // Le mot de passe est toujours vérifié, pour ne pas révéler par le temps de réponse si l'identifiant existe.
  const passwordOk = account ? await bcrypt.compare(password, account.passwordHash) : false;
  if (!account || !passwordOk || account.username !== username) return { error: "Identifiant ou mot de passe incorrect." };

  await clearRateLimit("login");
  await createSession(account.sessionVersion);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/connexion");
}

export async function changeCredentials(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z
    .object({
      actuel: z.string().min(1, "Saisissez votre mot de passe actuel."),
      username: z.string().trim().min(3, "L'identifiant doit faire au moins 3 caractères.").max(40),
      nouveau: z.string().refine((v) => v === "" || v.length >= 10, "Le nouveau mot de passe doit faire au moins 10 caractères."),
      confirmation: z.string(),
    })
    .refine((d) => d.nouveau === d.confirmation, { message: "Les deux mots de passe ne correspondent pas.", path: ["confirmation"] })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const account = await getAdminAccount();
  if (!account || !(await bcrypt.compare(parsed.data.actuel, account.passwordHash))) {
    return { error: "Mot de passe actuel incorrect." };
  }

  const changingPassword = parsed.data.nouveau !== "";
  const [updated] = await db
    .update(admin)
    .set({
      username: parsed.data.username,
      ...(changingPassword
        ? { passwordHash: await bcrypt.hash(parsed.data.nouveau, 12), sessionVersion: sql`${admin.sessionVersion} + 1` }
        : {}),
      updatedAt: new Date(),
    })
    .where(eq(admin.id, account.id))
    .returning({ sessionVersion: admin.sessionVersion });

  // Les autres appareils sont déconnectés ; celui-ci reste connecté.
  if (changingPassword) await createSession(updated.sessionVersion);
  return { ok: true, message: changingPassword ? "Identifiant et mot de passe mis à jour." : "Identifiant mis à jour." };
}

// ─── Inscriptions ───────────────────────────────────────────────────────────

export async function updateInscription(id: number, _: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z
    .object({ statut: z.enum(INSCRIPTION_STATUTS), notes: z.string().max(5000) })
    .safeParse({ statut: formData.get("statut"), notes: formData.get("notes") ?? "" });
  if (!parsed.success) return { error: "Statut invalide." };
  await db
    .update(inscriptions)
    .set({ statut: parsed.data.statut, notes: parsed.data.notes || null, updatedAt: new Date() })
    .where(eq(inscriptions.id, id));
  refresh();
  return { ok: true, message: "Dossier mis à jour." };
}

export async function deleteInscription(id: number) {
  await requireAdmin();
  await db.delete(inscriptions).where(eq(inscriptions.id, id));
  redirect("/admin/inscriptions");
}

// ─── Avis ───────────────────────────────────────────────────────────────────

export async function setAvisStatut(id: number, statut: (typeof AVIS_STATUTS)[number]) {
  await requireAdmin();
  await db.update(avis).set({ statut }).where(eq(avis.id, id));
  updateTag(AVIS_TAG);
  refresh();
}

export async function deleteAvis(id: number) {
  await requireAdmin();
  await db.delete(avis).where(eq(avis.id, id));
  updateTag(AVIS_TAG);
  refresh();
}

// ─── Messages ───────────────────────────────────────────────────────────────

export async function setMessageLu(id: number, lu: boolean) {
  await requireAdmin();
  await db.update(messages).set({ lu }).where(eq(messages.id, id));
  refresh();
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  await db.delete(messages).where(eq(messages.id, id));
  refresh();
}

// ─── Contenu du site ────────────────────────────────────────────────────────

export async function saveSection(key: string, data: unknown): Promise<ActionState> {
  await requireAdmin();
  const section = getSection(key);
  if (!section) return { error: "Section inconnue." };
  const parsed = sectionSchema(section).safeParse(data);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: `Valeur invalide (${issue.path.join(" › ")}) : ${issue.message}` };
  }
  await db
    .insert(content)
    .values({ key, data: parsed.data })
    .onConflictDoUpdate({ target: content.key, set: { data: parsed.data, updatedAt: new Date() } });
  updateTag(contentTag(key as ContentKey));
  return { ok: true, message: "Modifications enregistrées et publiées sur le site." };
}
