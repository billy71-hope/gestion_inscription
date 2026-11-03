/**
 * Numéros béninois : 10 chiffres commençant par 01 depuis novembre 2024
 * (ex. 01 97 12 34 56), avec ou sans +229 / 00229.
 * Les numéros étrangers sont acceptés au format international (+33…).
 * Renvoie le numéro au format international sans espaces (+2290197123456), ou null.
 */
export function normalizePhone(input: string): string | null {
  const raw = input.replace(/[\s.\-()/]/g, "");
  let digits = raw.startsWith("+") ? raw.slice(1) : raw.startsWith("00") ? raw.slice(2) : null;

  if (digits === null) {
    // Numéro national béninois.
    return /^01\d{8}$/.test(raw) ? `+229${raw}` : null;
  }
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith("229")) {
    digits = digits.slice(3);
    return /^01\d{8}$/.test(digits) ? `+229${digits}` : null;
  }
  return /^\d{8,15}$/.test(digits) ? `+${digits}` : null;
}

/** +2290197123456 → +229 01 97 12 34 56 */
export function formatPhone(phone: string): string {
  const m = phone.match(/^\+229(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  return m ? `+229 ${m.slice(1).join(" ")}` : phone;
}

/** Lien WhatsApp à partir d'un numéro quelconque (chiffres seulement). */
export function whatsappLink(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
