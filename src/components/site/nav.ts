export const NAV = [
  { href: "/ecole", label: "L'école" },
  { href: "/cycles", label: "Cycles" },
  { href: "/frais", label: "Frais" },
  { href: "/resultats", label: "Résultats" },
  { href: "/equipe", label: "Équipe" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
] as const;

export const ACCENTS = {
  safran: { bg: "bg-safran", soft: "bg-safran-soft", text: "text-safran" },
  terracotta: { bg: "bg-terracotta", soft: "bg-terracotta-soft", text: "text-terracotta" },
  sauge: { bg: "bg-sauge", soft: "bg-sauge-soft", text: "text-sauge" },
  encre: { bg: "bg-encre", soft: "bg-encre-soft", text: "text-encre" },
} as const;

export type Accent = keyof typeof ACCENTS;
export const ACCENT_ORDER: Accent[] = ["safran", "sauge", "terracotta", "encre"];

export function accent(value: string, index = 0) {
  return ACCENTS[(value in ACCENTS ? value : ACCENT_ORDER[index % ACCENT_ORDER.length]) as Accent];
}
