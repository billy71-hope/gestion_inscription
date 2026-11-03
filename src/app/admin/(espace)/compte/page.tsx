import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { CompteForm } from "./CompteForm";

export const metadata: Metadata = { title: "Mon compte" };

export default function ComptePage() {
  return (
    <Suspense fallback={<Loading />}>
      <Compte />
    </Suspense>
  );
}

async function Compte() {
  const { username } = await requireAdmin();
  return (
    <>
      <PageTitle title="Mon compte" description="Identifiant et mot de passe de l'administration. Changer le mot de passe déconnecte les autres appareils." />
      <div className="card max-w-lg p-6 md:p-8">
        <CompteForm username={username} />
      </div>
    </>
  );
}
