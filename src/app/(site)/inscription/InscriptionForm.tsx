"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { a11y, Field, FormMessage, Honeypot, SubmitButton, useFormAction } from "@/components/site/form";
import { submitInscription, type FormState } from "../actions";

type Classe = { nom: string; cycle: string; serieRequise: boolean };
type Serie = { code: string; libelle: string };

const CYCLE_LABELS: Record<string, string> = { maternelle: "Maternelle", primaire: "Primaire", college: "Collège", lycee: "Lycée" };

export function InscriptionForm({ classes, series }: { classes: Classe[]; series: Serie[] }) {
  const { state, onSubmit, pending } = useFormAction<FormState>(submitInscription, { status: "idle" });
  const e = state.errors ?? {};
  const v = state.values ?? {};
  const [classe, setClasse] = useState(v.classe ?? "");
  const needsSerie = classes.find((c) => c.nom === classe)?.serieRequise ?? false;

  if (state.status === "success") {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 className="mx-auto size-14 text-sauge" />
        <h2 className="mt-4 font-display text-3xl font-semibold">Demande envoyée</h2>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">{state.message}</p>
        <Link href="/" className="btn btn-ghost mt-8">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const cycles = Object.entries(CYCLE_LABELS).map(([key, label]) => ({ label, items: classes.filter((c) => c.cycle === key) }));

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-10">
      <Honeypot />
      <fieldset className="space-y-5">
        <legend className="mb-1 font-display text-2xl font-semibold">L&apos;élève</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="nomEleve" label="Nom" required error={e.nomEleve}>
            <input {...a11y("nomEleve", e.nomEleve)} defaultValue={v.nomEleve} autoComplete="off" className="field-input" />
          </Field>
          <Field name="prenomEleve" label="Prénom(s)" required error={e.prenomEleve}>
            <input {...a11y("prenomEleve", e.prenomEleve)} defaultValue={v.prenomEleve} autoComplete="off" className="field-input" />
          </Field>
          <Field name="dateNaissance" label="Date de naissance" required error={e.dateNaissance}>
            <input type="date" {...a11y("dateNaissance", e.dateNaissance)} defaultValue={v.dateNaissance} className="field-input" />
          </Field>
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">
              Sexe <span className="text-terracotta">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["F", "Fille"],
                ["M", "Garçon"],
              ].map(([value, label]) => (
                <label key={value} className="field-input flex cursor-pointer items-center gap-2 has-checked:border-encre has-checked:bg-encre-soft">
                  <input type="radio" name="sexe" value={value} defaultChecked={v.sexe === value} className="accent-encre" />
                  {label}
                </label>
              ))}
            </div>
            {e.sexe ? <p className="mt-1.5 text-sm text-terracotta">{e.sexe}</p> : null}
          </fieldset>
          <Field name="classe" label="Classe demandée" required error={e.classe}>
            <select {...a11y("classe", e.classe)} value={classe} onChange={(ev) => setClasse(ev.target.value)} className="field-input">
              <option value="" disabled>
                Choisir une classe…
              </option>
              {cycles.map((g) =>
                g.items.length ? (
                  <optgroup key={g.label} label={g.label}>
                    {g.items.map((c) => (
                      <option key={c.nom}>{c.nom}</option>
                    ))}
                  </optgroup>
                ) : null,
              )}
            </select>
          </Field>
          {needsSerie ? (
            <Field name="serie" label="Série" required error={e.serie}>
              <select {...a11y("serie", e.serie)} defaultValue={v.serie ?? ""} className="field-input">
                <option value="" disabled>
                  Choisir une série…
                </option>
                {series.map((s) => (
                  <option key={s.code} value={s.code}>
                    Série {s.code} — {s.libelle}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          <Field name="ecoleOrigine" label="École actuelle" hint="Si l'élève vient d'un autre établissement." className="sm:col-span-2">
            <input {...a11y("ecoleOrigine")} defaultValue={v.ecoleOrigine} className="field-input" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-1 font-display text-2xl font-semibold">Le parent ou tuteur</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="parentNom" label="Nom et prénom" required error={e.parentNom}>
            <input {...a11y("parentNom", e.parentNom)} defaultValue={v.parentNom} autoComplete="name" className="field-input" />
          </Field>
          <Field name="parentLien" label="Lien avec l'élève" required error={e.parentLien}>
            <select {...a11y("parentLien", e.parentLien)} defaultValue={v.parentLien ?? ""} className="field-input">
              <option value="" disabled>
                Choisir…
              </option>
              {["Père", "Mère", "Tuteur", "Tutrice", "Autre"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field name="telephone" label="Téléphone (WhatsApp de préférence)" required error={e.telephone} hint="Ex. : 01 97 12 34 56">
            <input type="tel" inputMode="tel" {...a11y("telephone", e.telephone)} defaultValue={v.telephone} autoComplete="tel" className="field-input" />
          </Field>
          <Field name="email" label="E-mail" error={e.email}>
            <input type="email" {...a11y("email", e.email)} defaultValue={v.email} autoComplete="email" className="field-input" />
          </Field>
          <Field name="message" label="Questions ou précisions" className="sm:col-span-2">
            <textarea {...a11y("message")} defaultValue={v.message} rows={3} className="field-input" placeholder="Cantine, transport, besoins particuliers…" />
          </Field>
        </div>
      </fieldset>

      <div className="space-y-5 border-t border-line pt-8">
        <label className="flex gap-3 text-sm leading-relaxed">
          <input type="checkbox" name="consentement" defaultChecked={v.consentement === "on"} className="mt-1 size-4 shrink-0 accent-encre" aria-invalid={e.consentement ? true : undefined} />
          <span>
            J&apos;accepte que l&apos;école utilise ces informations pour traiter ma demande de pré-inscription et me recontacter.{" "}
            <Link href="/mentions-legales" className="underline underline-offset-2" target="_blank">
              En savoir plus
            </Link>
            .
          </span>
        </label>
        {e.consentement ? <p className="text-sm text-terracotta">{e.consentement}</p> : null}
        <FormMessage status={state.status} message={state.message} />
        <SubmitButton className="btn btn-primary w-full sm:w-auto" pending={pending}>Envoyer la demande de pré-inscription</SubmitButton>
      </div>
    </form>
  );
}
