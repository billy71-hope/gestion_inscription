/** Statuts partagés entre le serveur et les composants client (sans dépendance à Drizzle). */
export const INSCRIPTION_STATUTS = ["nouvelle", "contactee", "dossier", "admise", "refusee", "annulee"] as const;
export type InscriptionStatut = (typeof INSCRIPTION_STATUTS)[number];

export const AVIS_STATUTS = ["en_attente", "publie", "refuse"] as const;
export type AvisStatut = (typeof AVIS_STATUTS)[number];
