"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { INSCRIPTION_LABELS } from "@/components/admin/labels";
import { FormMessage, SubmitButton, useFormAction } from "@/components/site/form";
import { INSCRIPTION_STATUTS, type InscriptionStatut } from "@/db/statuts";
import { deleteInscription, updateInscription, type ActionState } from "@/app/admin/actions";

export function StatutForm({ id, statut, notes }: { id: number; statut: InscriptionStatut; notes: string }) {
  const { state, onSubmit, pending } = useFormAction<ActionState>(updateInscription.bind(null, id), {});
  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Statut</legend>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {INSCRIPTION_STATUTS.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 has-checked:border-ink has-checked:bg-paper">
              <input type="radio" name="statut" value={s} defaultChecked={s === statut} className="accent-ink" />
              <span className="text-sm font-medium">{INSCRIPTION_LABELS[s].label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold">
          Notes internes
        </label>
        <textarea id="notes" name="notes" defaultValue={notes} rows={5} className="field-input text-sm" placeholder="Appel du 12/09 : rendez-vous fixé lundi…" />
        <p className="mt-1 text-xs text-ink-faint">Visibles uniquement dans l&apos;administration.</p>
      </div>
      <FormMessage status={state.ok ? "success" : state.error ? "error" : "idle"} message={state.message ?? state.error} />
      <SubmitButton className="btn btn-primary w-full" pending={pending}>Enregistrer</SubmitButton>
    </form>
  );
}

export function DeleteInscription({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Supprimer définitivement cette demande ? Cette action est irréversible.")) start(() => deleteInscription(id));
      }}
      className="btn w-full border border-terracotta/30 text-terracotta hover:bg-terracotta-soft"
    >
      <Trash2 className="size-4" /> {pending ? "Suppression…" : "Supprimer la demande"}
    </button>
  );
}
