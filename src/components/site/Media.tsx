import Image from "next/image";
import { accent } from "./nav";

/**
 * Photo administrable. Tant qu'aucune photo n'est envoyée depuis l'admin,
 * affiche un aplat coloré quadrillé pour garder la mise en page.
 */
export function Media({
  src,
  alt,
  tone = "encre",
  label,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  tone?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const a = accent(tone);
  return (
    <div className={`relative overflow-hidden ${a.soft} ${className}`} aria-hidden="true">
      <div className="seyes absolute inset-0 opacity-80" />
      {label ? (
        <span className={`absolute bottom-4 left-5 font-display text-5xl font-semibold opacity-25 md:text-7xl ${a.text}`}>
          {label}
        </span>
      ) : null}
    </div>
  );
}
