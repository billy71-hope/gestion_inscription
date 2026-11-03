/** Découpe un texte saisi dans l'admin en paragraphes (séparés par une ligne vide). */
export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function formatDate(value: Date | string, withTime = false) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Africa/Porto-Novo",
  }).format(date);
}

/** Âge en années révolues à la date du jour. */
export function age(dateNaissance: string) {
  const birth = new Date(dateNaissance);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) years--;
  return years;
}
