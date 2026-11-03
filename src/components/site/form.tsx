"use client";

import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { startTransition, useActionState, type FormEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

/**
 * Comme useActionState, mais sans la remise à zéro automatique du formulaire
 * que fait React après une action : en cas d'erreur, le parent garde sa saisie
 * (y compris les listes déroulantes, que defaultValue ne restaure pas).
 */
export function useFormAction<S>(action: (state: Awaited<S>, formData: FormData) => S | Promise<S>, initial: Awaited<S>) {
  const [state, dispatch, pending] = useActionState(action, initial);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };
  return { state, onSubmit, pending };
}

export function Field({
  name,
  label,
  error,
  hint,
  required,
  children,
  className = "",
}: {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required ? <span className="text-terracotta"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-erreur`} className="mt-1.5 text-sm text-terracotta">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
}

/** Attributs d'accessibilité d'un champ selon son erreur. */
export function a11y(name: string, error?: string) {
  return { id: name, name, "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${name}-erreur` : undefined };
}

/** Champ piège invisible pour les robots (voir isBot côté serveur). */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Site web
        <input type="text" name="site_web" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ children, className = "btn btn-primary", pending: pendingProp }: { children: ReactNode; className?: string; pending?: boolean }) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Envoi en cours…" : children}
    </button>
  );
}

export function FormMessage({ status, message }: { status: "idle" | "success" | "error"; message?: string }) {
  if (status === "idle" || !message) return null;
  const ok = status === "success";
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`flex gap-2.5 rounded-xl px-4 py-3 text-sm ${ok ? "bg-sauge-soft text-sauge" : "bg-terracotta-soft text-terracotta"}`}
    >
      {ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
      <span className="font-medium">{message}</span>
    </p>
  );
}
