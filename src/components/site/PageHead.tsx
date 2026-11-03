import type { ReactNode } from "react";

/** En-tête des pages intérieures, sur fond de cahier. */
export function PageHead({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="seyes border-b border-line">
      <div className="container-page py-14 md:py-20 md:pl-28">
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 className="rise mt-3 max-w-3xl font-display text-4xl leading-[1.05] font-semibold text-balance md:text-6xl" style={{ animationDelay: "60ms" }}>
          {title}
        </h1>
        {intro ? (
          <p className="rise mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "120ms" }}>
            {intro}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, intro, center = false }: { eyebrow?: string; title: string; intro?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-2 font-display text-3xl leading-tight font-semibold text-balance md:text-[2.6rem]">{title}</h2>
      {intro ? <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p> : null}
    </div>
  );
}
