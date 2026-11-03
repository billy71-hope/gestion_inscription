import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div className="seyes flex flex-1 items-center justify-center px-4 py-16">
      <div className="card w-full max-w-sm p-8">
        <p className="eyebrow">Espace réservé</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Administration</h1>
        <p className="mt-2 text-ink-soft">Connectez-vous pour gérer les inscriptions et le contenu du site.</p>
        <LoginForm />
        <Link href="/" className="mt-6 block text-center text-sm text-ink-soft hover:text-ink">
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
