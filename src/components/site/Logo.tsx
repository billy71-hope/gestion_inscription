import Image from "next/image";

export function Logo({ logo, sigle, size = 44, inverted = false }: { logo: string; sigle: string; size?: number; inverted?: boolean }) {
  if (logo) {
    return <Image src={logo} alt="" width={size} height={size} className={`rounded-xl object-contain ${inverted ? "bg-paper p-1" : ""}`} style={{ width: size, height: size }} />;
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl font-display font-semibold ${inverted ? "bg-safran text-ink" : "bg-ink text-paper"}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {sigle}
    </span>
  );
}
