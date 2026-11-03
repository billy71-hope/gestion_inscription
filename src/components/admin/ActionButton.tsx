"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useTransition } from "react";

/** Bouton qui appelle une action serveur, avec confirmation facultative. */
export function ActionButton({
  action,
  confirmMessage,
  className = "btn btn-ghost !px-3 !py-1.5 text-sm",
  children,
}: {
  action: () => Promise<unknown>;
  confirmMessage?: string;
  className?: string;
  children: ReactNode;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        if (confirmMessage && !confirm(confirmMessage)) return;
        start(async () => {
          await action();
        });
      }}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
