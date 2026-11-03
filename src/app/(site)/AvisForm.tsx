"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { a11y, Field, FormMessage, Honeypot, SubmitButton, useFormAction } from "@/components/site/form";
import { submitAvis, type FormState } from "./actions";

export function AvisForm() {
  const { state, onSubmit, pending } = useFormAction<FormState>(submitAvis, { status: "idle" });
  const [note, setNote] = useState(0);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  if (state.status === "success") {
    return (
      <div className="mt-6">
        <FormMessage status="success" message={state.message} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-6 space-y-4" noValidate>
      <Honeypot />
      <Field name="nom" label="Nom complet" required error={e.nom}>
        <input {...a11y("nom", e.nom)} defaultValue={v.nom} autoComplete="name" className="field-input" />
      </Field>
      <Field name="qualite" label="Vous êtes" required error={e.qualite}>
        <select {...a11y("qualite", e.qualite)} defaultValue={v.qualite ?? ""} className="field-input">
          <option value="" disabled>
            Choisir…
          </option>
          <option>Parent d&apos;élève</option>
          <option>Ancien élève</option>
          <option>Élève</option>
        </select>
      </Field>
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">
          Votre note <span className="text-terracotta">*</span>
        </legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="note" value={n} checked={note === n} onChange={() => setNote(n)} className="peer sr-only" />
              <Star
                className={`size-8 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-encre ${n <= note ? "fill-safran text-safran" : "text-ink-faint"}`}
              />
              <span className="sr-only">
                {n} étoile{n > 1 ? "s" : ""}
              </span>
            </label>
          ))}
        </div>
        {e.note ? <p className="mt-1.5 text-sm text-terracotta">{e.note}</p> : null}
      </fieldset>
      <Field name="message" label="Votre témoignage" required error={e.message}>
        <textarea {...a11y("message", e.message)} defaultValue={v.message} rows={4} maxLength={800} className="field-input" />
      </Field>
      <FormMessage status={state.status} message={state.message} />
      <SubmitButton className="btn btn-primary w-full" pending={pending}>Envoyer mon témoignage</SubmitButton>
    </form>
  );
}
