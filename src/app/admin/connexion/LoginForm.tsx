"use client";

import { FormMessage, SubmitButton, useFormAction } from "@/components/site/form";
import { login, type ActionState } from "../actions";

export function LoginForm() {
  const { state, onSubmit, pending } = useFormAction<ActionState>(login, {});
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-semibold">
          Identifiant
        </label>
        <input id="username" name="username" autoComplete="username" required autoCapitalize="none" className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
          Mot de passe
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input" />
      </div>
      <FormMessage status={state.error ? "error" : "idle"} message={state.error} />
      <SubmitButton className="btn btn-primary w-full" pending={pending}>Se connecter</SubmitButton>
    </form>
  );
}
