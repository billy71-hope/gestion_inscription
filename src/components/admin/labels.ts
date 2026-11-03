import type { AvisStatut, InscriptionStatut } from "@/db/statuts";

export const INSCRIPTION_LABELS: Record<InscriptionStatut, { label: string; className: string }> = {
  nouvelle: { label: "Nouvelle", className: "bg-safran-soft text-[#8a5a10]" },
  contactee: { label: "Parent contacté", className: "bg-encre-soft text-encre" },
  dossier: { label: "Dossier en cours", className: "bg-[#ece4f7] text-[#5b3a8c]" },
  admise: { label: "Admis(e)", className: "bg-sauge-soft text-sauge" },
  refusee: { label: "Refusée", className: "bg-terracotta-soft text-terracotta" },
  annulee: { label: "Annulée", className: "bg-paper-deep text-ink-soft" },
};

export const AVIS_LABELS: Record<AvisStatut, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-safran-soft text-[#8a5a10]" },
  publie: { label: "Publié", className: "bg-sauge-soft text-sauge" },
  refuse: { label: "Refusé", className: "bg-paper-deep text-ink-soft" },
};
