import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AvisStatut, InscriptionStatut } from "./statuts";

export * from "./statuts";

/** Compte administrateur unique. `sessionVersion` invalide les sessions ouvertes quand le mot de passe change. */
export const admin = pgTable("admin", {
  id: integer("id").primaryKey(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  sessionVersion: integer("session_version").notNull().default(1),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Contenu éditable du site : une ligne JSON par section (voir src/lib/content). */
export const content = pgTable("content", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inscriptions = pgTable(
  "inscriptions",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    anneeScolaire: text("annee_scolaire").notNull(),
    nomEleve: text("nom_eleve").notNull(),
    prenomEleve: text("prenom_eleve").notNull(),
    dateNaissance: date("date_naissance").notNull(),
    sexe: text("sexe").notNull(),
    classe: text("classe").notNull(),
    serie: text("serie"),
    ecoleOrigine: text("ecole_origine"),
    parentNom: text("parent_nom").notNull(),
    parentLien: text("parent_lien").notNull(),
    telephone: text("telephone").notNull(),
    email: text("email"),
    message: text("message"),
    statut: text("statut").$type<InscriptionStatut>().notNull().default("nouvelle"),
    notes: text("notes"),
  },
  (t) => [index("inscriptions_statut_idx").on(t.statut), index("inscriptions_created_idx").on(t.createdAt)],
);

export const avis = pgTable("avis", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  nom: text("nom").notNull(),
  qualite: text("qualite").notNull(),
  note: integer("note").notNull(),
  message: text("message").notNull(),
  statut: text("statut").$type<AvisStatut>().notNull().default("en_attente"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  nom: text("nom").notNull(),
  telephone: text("telephone").notNull(),
  email: text("email"),
  sujet: text("sujet").notNull(),
  message: text("message").notNull(),
  lu: boolean("lu").notNull().default(false),
});

/** Journal des soumissions publiques et des connexions, pour limiter les abus par IP. */
export const rateEvents = pgTable(
  "rate_events",
  {
    id: serial("id").primaryKey(),
    bucket: text("bucket").notNull(),
    ip: text("ip").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rate_events_lookup_idx").on(t.bucket, t.ip, t.createdAt)],
);
