"use server";

import { z } from "zod";
import { db } from "@/db";
import { avis, inscriptions, messages } from "@/db/schema";
import { getContent } from "@/lib/content";
import { normalizePhone } from "@/lib/phone";
import { hitRateLimit } from "@/lib/rate-limit";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  /** Valeurs renvoyées pour re-remplir le formulaire après une erreur. */
  values?: Record<string, string>;
};

const required = (label: string, max = 120) =>
  z.string(`${label} : champ obligatoire.`).trim().min(1, `${label} : champ obligatoire.`).max(max, `${label} : ${max} caractères maximum.`);
const optional = (max = 2000) => z.string().trim().max(max).optional().transform((v) => v || null);
const phone = z
  .string("Téléphone : champ obligatoire.")
  .trim()
  .transform((v, ctx) => {
    const normalized = normalizePhone(v);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Numéro invalide : 10 chiffres commençant par 01 (ex. 01 97 12 34 56)." });
      return z.NEVER;
    }
    return normalized;
  });
const email = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((v) => v || null)
  .pipe(z.email("Adresse e-mail invalide.").nullable());

function values(formData: FormData) {
  return Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
}

function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Champ piège invisible : un robot le remplit, un humain non. */
function isBot(formData: FormData) {
  return Boolean(formData.get("site_web"));
}

const TOO_MANY = "Trop d'envois depuis votre connexion. Réessayez dans une heure ou appelez le secrétariat.";
const SERVER_ERROR = "L'envoi a échoué à cause d'un problème technique. Réessayez, ou contactez le secrétariat par téléphone.";

export async function submitInscription(_: FormState, formData: FormData): Promise<FormState> {
  const v = values(formData);
  const [site, page] = await Promise.all([getContent("site"), getContent("inscription")]);
  if (!site.inscriptionsOuvertes) return { status: "error", message: page.fermees, values: v };
  if (isBot(formData)) return { status: "success", message: page.confirmation };

  const classes = page.classes.map((c) => c.nom);
  const series = page.series.map((s) => s.code);
  const needsSerie = (classe: string) => Boolean(page.classes.find((c) => c.nom === classe)?.serieRequise);

  const schema = z
    .object({
      nomEleve: required("Nom de l'élève"),
      prenomEleve: required("Prénom de l'élève"),
      dateNaissance: z.iso.date("Date de naissance invalide.").refine((d) => {
        const years = (Date.now() - new Date(d).getTime()) / 31_557_600_000;
        return years >= 2 && years <= 25;
      }, "Date de naissance invalide : l'élève doit avoir entre 2 et 25 ans."),
      sexe: z.enum(["F", "M"], "Indiquez le sexe de l'élève."),
      classe: z.string("Choisissez une classe dans la liste.").refine((c) => classes.includes(c), "Choisissez une classe dans la liste."),
      serie: z.string().optional().transform((s) => s || null),
      ecoleOrigine: optional(200),
      parentNom: required("Nom du parent ou tuteur"),
      parentLien: z.enum(["Père", "Mère", "Tuteur", "Tutrice", "Autre"], "Indiquez votre lien avec l'élève."),
      telephone: phone,
      email,
      message: optional(2000),
      consentement: z.literal("on", "Vous devez accepter le traitement de vos données pour envoyer la demande."),
    })
    .superRefine((d, ctx) => {
      if (needsSerie(d.classe) && (!d.serie || !series.includes(d.serie))) {
        ctx.addIssue({ code: "custom", path: ["serie"], message: "Choisissez une série pour cette classe." });
      }
    })
    .transform((d) => ({ ...d, serie: needsSerie(d.classe) ? d.serie : null }));

  const parsed = schema.safeParse(v);
  if (!parsed.success) {
    return { status: "error", message: "Certains champs sont à corriger.", errors: fieldErrors(parsed.error), values: v };
  }

  try {
    if (await hitRateLimit("inscription", 8, 60)) return { status: "error", message: TOO_MANY, values: v };
    const d = parsed.data;
    await db.insert(inscriptions).values({
      anneeScolaire: site.anneeScolaire,
      nomEleve: d.nomEleve,
      prenomEleve: d.prenomEleve,
      dateNaissance: d.dateNaissance,
      sexe: d.sexe,
      classe: d.classe,
      serie: d.serie,
      ecoleOrigine: d.ecoleOrigine,
      parentNom: d.parentNom,
      parentLien: d.parentLien,
      telephone: d.telephone,
      email: d.email,
      message: d.message,
    });
  } catch (error) {
    console.error("submitInscription", error);
    return { status: "error", message: SERVER_ERROR, values: v };
  }
  return { status: "success", message: page.confirmation };
}

export async function submitContact(_: FormState, formData: FormData): Promise<FormState> {
  const v = values(formData);
  if (isBot(formData)) return { status: "success", message: "Message envoyé." };

  const parsed = z
    .object({
      nom: required("Nom"),
      telephone: phone,
      email,
      sujet: required("Sujet", 120),
      message: required("Message", 3000),
    })
    .safeParse(v);
  if (!parsed.success) {
    return { status: "error", message: "Certains champs sont à corriger.", errors: fieldErrors(parsed.error), values: v };
  }

  try {
    if (await hitRateLimit("contact", 6, 60)) return { status: "error", message: TOO_MANY, values: v };
    await db.insert(messages).values(parsed.data);
  } catch (error) {
    console.error("submitContact", error);
    return { status: "error", message: SERVER_ERROR, values: v };
  }
  return { status: "success", message: "Merci, votre message est bien arrivé. Le secrétariat vous répond au plus vite." };
}

export async function submitAvis(_: FormState, formData: FormData): Promise<FormState> {
  const v = values(formData);
  if (isBot(formData)) return { status: "success", message: "Merci !" };

  const parsed = z
    .object({
      nom: required("Nom", 80),
      qualite: z.enum(["Parent d'élève", "Ancien élève", "Élève"], "Indiquez qui vous êtes."),
      note: z.coerce.number("Donnez une note.").int().min(1, "Donnez une note.").max(5),
      message: z.string().trim().min(20, "Votre témoignage doit faire au moins 20 caractères.").max(800, "800 caractères maximum."),
    })
    .safeParse(v);
  if (!parsed.success) {
    return { status: "error", message: "Certains champs sont à corriger.", errors: fieldErrors(parsed.error), values: v };
  }

  try {
    if (await hitRateLimit("avis", 3, 60)) return { status: "error", message: TOO_MANY, values: v };
    await db.insert(avis).values(parsed.data);
  } catch (error) {
    console.error("submitAvis", error);
    return { status: "error", message: SERVER_ERROR, values: v };
  }
  return { status: "success", message: "Merci ! Votre témoignage sera publié après relecture par l'école." };
}
