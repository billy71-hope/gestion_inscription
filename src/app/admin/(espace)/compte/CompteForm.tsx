"use client";

import { useActionState } from "react";
import { changeCredentials, type ActionState } from "@/app/admin/actions";
import { FormMessage, SubmitButton } from "@/components/site/form";

export function CompteForm({ username }: { username: string }) {
  const [state, action] = useActionState<ActionState, FormData>(changeCredentials, {});
  return (
    <form action={action} className="space-y-5">
      <Input name="username" label="Identifiant" defaultValue={username} autoComplete="username" />
      <fieldset className="space-y-5 border-t border-line pt-5">
        <legend className="text-sm text-ink-soft">Nouveau mot de passe (laissez vide pour le garder)</legend>
        <Input name="nouveau" label="Nouveau mot de passe" type="password" autoComplete="new-password" hint="10 caractères minimum." />
        <Input name="confirmation" label="Confirmer le nouveau mot de passe" type="password" autoComplete="new-password" />
      </fieldset>
      <div className="border-t border-line pt-5">
        <Input name="actuel" label="Mot de passe actuel" type="password" autoComplete="current-password" hint="Obligatoire pour valider les changements." />
      </div>
      <FormMessage status={state.ok ? "success" : state.error ? "error" : "idle"} message={state.message ?? state.error} />
      <SubmitButton>Enregistrer</SubmitButton>
    </form>
  );
}

function Input({ name, label, hint, ...props }: { name: string; label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input id={name} name={name} className="field-input" {...props} />
      {hint ? <p className="mt-1.5 text-sm text-ink-faint">{hint}</p> : null}
    </div>
  );
}
