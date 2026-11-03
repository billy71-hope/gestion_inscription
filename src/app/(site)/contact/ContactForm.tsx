"use client";

import { a11y, Field, FormMessage, Honeypot, SubmitButton, useFormAction } from "@/components/site/form";
import { submitContact, type FormState } from "../actions";

export function ContactForm({ sujets }: { sujets: string[] }) {
  const { state, onSubmit, pending } = useFormAction<FormState>(submitContact, { status: "idle" });
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
    <form onSubmit={onSubmit} noValidate className="relative mt-6 grid gap-5 sm:grid-cols-2">
      <Honeypot />
      <Field name="nom" label="Nom complet" required error={e.nom}>
        <input {...a11y("nom", e.nom)} defaultValue={v.nom} autoComplete="name" className="field-input" />
      </Field>
      <Field name="telephone" label="Téléphone" required error={e.telephone} hint="Ex. : 01 97 12 34 56">
        <input type="tel" inputMode="tel" {...a11y("telephone", e.telephone)} defaultValue={v.telephone} autoComplete="tel" className="field-input" />
      </Field>
      <Field name="email" label="E-mail" error={e.email}>
        <input type="email" {...a11y("email", e.email)} defaultValue={v.email} autoComplete="email" className="field-input" />
      </Field>
      <Field name="sujet" label="Sujet" required error={e.sujet}>
        <select {...a11y("sujet", e.sujet)} defaultValue={v.sujet ?? ""} className="field-input">
          <option value="" disabled>
            Choisir un sujet…
          </option>
          {sujets.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field name="message" label="Message" required error={e.message} className="sm:col-span-2">
        <textarea {...a11y("message", e.message)} defaultValue={v.message} rows={5} className="field-input" />
      </Field>
      <div className="space-y-4 sm:col-span-2">
        <FormMessage status={state.status} message={state.message} />
        <SubmitButton pending={pending}>Envoyer le message</SubmitButton>
      </div>
    </form>
  );
}
