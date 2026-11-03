import "server-only";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admin } from "@/db/schema";

export const SESSION_COOKIE = "sth_admin";
const SESSION_DAYS = 7;
const ADMIN_ID = 1;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET manquant ou trop court (32 caractères minimum).");
  return new TextEncoder().encode(value);
}

export async function getAdminAccount() {
  const [row] = await db.select().from(admin).where(eq(admin.id, ADMIN_ID));
  return row;
}

export async function createSession(sessionVersion: number) {
  const token = await new SignJWT({ v: sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(ADMIN_ID))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Session valide : jeton signé, non expiré, et émis depuis le dernier changement de mot de passe. */
async function readSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    const account = await getAdminAccount();
    if (!account || payload.v !== account.sessionVersion) return null;
    return { username: account.username };
  } catch {
    return null;
  }
}

/** À appeler au début de chaque page et de chaque action de l'admin. */
export async function requireAdmin() {
  const session = await readSession();
  if (!session) redirect("/admin/connexion");
  return session;
}

export async function isAdmin() {
  return (await readSession()) !== null;
}
