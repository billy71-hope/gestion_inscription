/**
 * Crée (ou réinitialise) le compte administrateur et affiche son mot de passe.
 * Usage : npm run admin:reset [identifiant]
 */
import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

const username = process.argv[2] ?? "admin";
// Sans caractères ambigus (0/O, 1/l/I) pour pouvoir le recopier à la main.
const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const password = Array.from(randomBytes(14), (b) => alphabet[b % alphabet.length]).join("");
const hash = await bcrypt.hash(password, 12);

const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
await sql`
  INSERT INTO admin (id, username, password_hash, session_version)
  VALUES (1, ${username}, ${hash}, 1)
  ON CONFLICT (id) DO UPDATE
  SET username = EXCLUDED.username,
      password_hash = EXCLUDED.password_hash,
      session_version = admin.session_version + 1,
      updated_at = now()`;

console.log(`Identifiant : ${username}\nMot de passe : ${password}`);
