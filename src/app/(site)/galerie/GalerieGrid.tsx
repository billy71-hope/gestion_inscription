"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { image: string; legende: string; categorie: string };

export function GalerieGrid({ photos, categories }: { photos: Photo[]; categories: string[] }) {
  const [filtre, setFiltre] = useState<string | null>(null);
  const [ouverte, setOuverte] = useState<number | null>(null);
  const visibles = filtre ? photos.filter((p) => p.categorie === filtre) : photos;

  useEffect(() => {
    if (ouverte === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuverte(null);
      if (e.key === "ArrowRight") setOuverte((i) => (i === null ? i : (i + 1) % visibles.length));
      if (e.key === "ArrowLeft") setOuverte((i) => (i === null ? i : (i - 1 + visibles.length) % visibles.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [ouverte, visibles.length]);

  const photo = ouverte !== null ? visibles[ouverte] : null;

  return (
    <>
      {categories.length > 1 ? (
        <div role="group" aria-label="Filtrer par catégorie" className="mb-8 flex flex-wrap gap-2">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "tout"}
              type="button"
              aria-pressed={filtre === c}
              onClick={() => setFiltre(c)}
              className="btn btn-ghost !py-2 aria-pressed:!border-ink aria-pressed:!bg-ink aria-pressed:text-paper"
            >
              {c ?? "Tout voir"}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {visibles.map((p, i) => (
          <li key={p.image} className="mb-3 break-inside-avoid">
            <button type="button" onClick={() => setOuverte(i)} className="group block w-full overflow-hidden rounded-2xl text-left">
              <Image
                src={p.image}
                alt={p.legende}
                width={600}
                height={600}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
            {p.legende ? <p className="mt-1.5 px-1 text-sm text-ink-soft">{p.legende}</p> : null}
          </li>
        ))}
      </ul>

      {photo ? (
        <div role="dialog" aria-modal="true" aria-label={photo.legende || "Photo"} className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4" onClick={() => setOuverte(null)}>
          <div className="flex justify-end">
            <button type="button" className="grid size-11 place-items-center rounded-full bg-paper/10 text-paper" aria-label="Fermer">
              <X />
            </button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={photo.image} alt={photo.legende} fill sizes="100vw" className="object-contain" />
          </div>
          <div className="flex items-center justify-between gap-4 pt-4 text-paper" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOuverte((ouverte! - 1 + visibles.length) % visibles.length)} className="grid size-11 place-items-center rounded-full bg-paper/10" aria-label="Photo précédente">
              <ChevronLeft />
            </button>
            <p className="text-center">{photo.legende}</p>
            <button type="button" onClick={() => setOuverte((ouverte! + 1) % visibles.length)} className="grid size-11 place-items-center rounded-full bg-paper/10" aria-label="Photo suivante">
              <ChevronRight />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
