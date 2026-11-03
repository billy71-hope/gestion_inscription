"use client";

import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Copy, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { saveSection } from "@/app/admin/actions";
import type { Field } from "@/lib/content/fields";
import { uploadImage } from "./upload";

type Data = Record<string, unknown>;

function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "select":
      return field.options[0]?.value ?? "";
    case "list":
      return [];
    case "group":
      return emptyItem(field.fields);
    default:
      return "";
  }
}

function emptyItem(fields: Field[]): Data {
  return Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));
}

/** Complète les valeurs enregistrées avec les champs ajoutés depuis. */
function normalize(fields: Field[], value: unknown): Data {
  const v = (value && typeof value === "object" ? value : {}) as Data;
  return Object.fromEntries(
    fields.map((f) => {
      const current = v[f.name];
      if (f.type === "group") return [f.name, normalize(f.fields, current)];
      if (f.type === "list") return [f.name, Array.isArray(current) ? current.map((it) => normalize(f.fields, it)) : []];
      return [f.name, current ?? emptyValue(f)];
    }),
  );
}

export function SectionEditor({ sectionKey, fields, initial }: { sectionKey: string; fields: Field[]; initial: unknown }) {
  const [data, setData] = useState<Data>(() => normalize(fields, initial));
  const [saved, setSaved] = useState(() => JSON.stringify(normalize(fields, initial)));
  const [result, setResult] = useState<{ ok?: boolean; error?: string; message?: string } | null>(null);
  const [uploads, setUploads] = useState(0);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(data) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function save() {
    setResult(null);
    start(async () => {
      const res = await saveSection(sectionKey, data);
      setResult(res);
      if (res.ok) setSaved(JSON.stringify(data));
    });
  }

  const ctx: Ctx = {
    folder: sectionKey,
    onUpload: (delta) => setUploads((n) => n + delta),
  };

  return (
    <div className="pb-28">
      <div className="space-y-6">
        <Fields fields={fields} value={data} onChange={setData} ctx={ctx} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur lg:left-64">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-10">
          <div className="min-w-0 flex-1 text-sm" role="status">
            {result?.error ? (
              <span className="flex items-center gap-2 text-terracotta">
                <AlertCircle className="size-4 shrink-0" /> {result.error}
              </span>
            ) : uploads > 0 ? (
              <span className="flex items-center gap-2 text-ink-soft">
                <Loader2 className="size-4 animate-spin" /> Envoi de photo en cours…
              </span>
            ) : dirty ? (
              <span className="font-semibold text-[#8a5a10]">Modifications non enregistrées</span>
            ) : result?.ok ? (
              <span className="flex items-center gap-2 text-sauge">
                <CheckCircle2 className="size-4 shrink-0" /> {result.message}
              </span>
            ) : (
              <span className="text-ink-faint">Aucune modification</span>
            )}
          </div>
          {dirty ? (
            <button type="button" onClick={() => setData(JSON.parse(saved))} className="btn btn-ghost !py-2.5" disabled={pending}>
              Annuler
            </button>
          ) : null}
          <button type="button" onClick={save} disabled={!dirty || pending || uploads > 0} className="btn btn-primary !py-2.5">
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Enregistrer et publier
          </button>
        </div>
      </div>
    </div>
  );
}

type Ctx = { folder: string; onUpload: (delta: number) => void };

function Fields({ fields, value, onChange, ctx }: { fields: Field[]; value: Data; onChange: (v: Data) => void; ctx: Ctx }) {
  return (
    <>
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={value[f.name]} onChange={(v) => onChange({ ...value, [f.name]: v })} ctx={ctx} />
      ))}
    </>
  );
}

function FieldInput({ field, value, onChange, ctx }: { field: Field; value: unknown; onChange: (v: unknown) => void; ctx: Ctx }) {
  const id = useId();
  const help = field.help ? <p className="mt-1.5 text-sm text-ink-faint">{field.help}</p> : null;

  if (field.type === "group") {
    return (
      <fieldset className="card p-5 md:p-6">
        <legend className="float-left mb-4 w-full font-display text-xl font-semibold">{field.label}</legend>
        {field.help ? <p className="clear-both -mt-2 mb-4 text-sm text-ink-faint">{field.help}</p> : null}
        <div className="clear-both space-y-5">
          <Fields fields={field.fields} value={value as Data} onChange={onChange} ctx={ctx} />
        </div>
      </fieldset>
    );
  }
  if (field.type === "list") {
    return <ListField field={field} value={value as Data[]} onChange={onChange} ctx={ctx} />;
  }
  if (field.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-ink/20 transition-colors peer-checked:bg-sauge peer-focus-visible:outline-2 peer-focus-visible:outline-encre after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
        <span>
          <span className="font-semibold">{field.label}</span>
          {help}
        </span>
      </label>
    );
  }
  if (field.type === "image") {
    return (
      <div>
        <p className="mb-1.5 text-sm font-semibold">{field.label}</p>
        <ImageInput value={String(value ?? "")} onChange={onChange} ctx={ctx} />
        {help}
      </div>
    );
  }

  const common = { id, className: "field-input" };
  let input;
  if (field.type === "textarea") {
    const text = String(value ?? "");
    input = <textarea {...common} value={text} rows={Math.min(14, Math.max(3, text.split("\n").length + 1, Math.ceil(text.length / 90)))} onChange={(e) => onChange(e.target.value)} />;
  } else if (field.type === "select") {
    input = (
      <select {...common} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "number") {
    input = <input {...common} type="number" inputMode="decimal" value={String(value ?? 0)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />;
  } else {
    const type = field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text";
    input = <input {...common} type={type} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {field.label}
      </label>
      {input}
      {help}
    </div>
  );
}

function ListField({ field, value, onChange, ctx }: { field: Extract<Field, { type: "list" }>; value: Data[]; onChange: (v: Data[]) => void; ctx: Ctx }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState<number | null>(null);
  const imageField = field.fields.find((f) => f.type === "image" && f.name === "image");
  const multiRef = useRef<HTMLInputElement>(null);
  const [multiError, setMultiError] = useState("");

  const set = (i: number, item: Data) => onChange(items.map((it, j) => (j === i ? item : it)));
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
    setOpen((o) => (o === i ? i + d : o === i + d ? i : o));
  };
  const remove = (i: number) => {
    const titre = String(items[i]?.[field.titleField ?? ""] ?? "").trim();
    if (!confirm(`Supprimer ${titre ? `« ${titre} »` : `cet élément (${field.itemLabel.toLowerCase()})`} ?`)) return;
    onChange(items.filter((_, j) => j !== i));
    setOpen(null);
  };
  const add = () => {
    onChange([...items, emptyItem(field.fields)]);
    setOpen(items.length);
  };

  async function addPhotos(files: FileList) {
    setMultiError("");
    const added: Data[] = [];
    for (const file of Array.from(files)) {
      ctx.onUpload(1);
      try {
        const url = await uploadImage(file, ctx.folder);
        added.push({ ...emptyItem(field.fields), image: url });
      } catch (e) {
        setMultiError(`${file.name} : ${(e as Error).message}`);
      } finally {
        ctx.onUpload(-1);
      }
    }
    if (added.length) onChange([...items, ...added]);
  }

  return (
    <section className="card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">
          {field.label} <span className="text-base font-normal text-ink-faint">({items.length})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {imageField ? (
            <>
              <input
                ref={multiRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.length) addPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
              <button type="button" onClick={() => multiRef.current?.click()} className="btn btn-ghost !py-2 text-sm">
                <ImagePlus className="size-4" /> Ajouter des photos
              </button>
            </>
          ) : null}
          <button type="button" onClick={add} className="btn btn-ghost !py-2 text-sm">
            <Plus className="size-4" /> {field.itemLabel}
          </button>
        </div>
      </div>
      {field.help ? <p className="mt-1 text-sm text-ink-faint">{field.help}</p> : null}
      {multiError ? <p className="mt-2 text-sm text-terracotta">{multiError}</p> : null}

      {items.length ? (
        <ol className="mt-4 space-y-2">
          {items.map((item, i) => {
            const titre = String(item[field.titleField ?? ""] ?? "").trim() || `${field.itemLabel} ${i + 1}`;
            const thumb = imageField ? String(item.image ?? "") : "";
            const isOpen = open === i;
            return (
              <li key={i} className="rounded-xl border border-line bg-paper/40">
                <div className="flex items-center gap-1 p-1.5 pl-3">
                  <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-3 py-1.5 text-left">
                    {thumb ? <Image src={thumb} alt="" width={40} height={40} className="size-10 shrink-0 rounded-lg object-cover" /> : null}
                    <span className="truncate font-medium">{titre}</span>
                    <ChevronDown className={`ml-auto size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <IconButton label="Monter" disabled={i === 0} onClick={() => move(i, -1)}>
                    <ChevronUp />
                  </IconButton>
                  <IconButton label="Descendre" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                    <ChevronDown />
                  </IconButton>
                  <IconButton label="Dupliquer" onClick={() => onChange([...items.slice(0, i + 1), structuredClone(item), ...items.slice(i + 1)])}>
                    <Copy />
                  </IconButton>
                  <IconButton label="Supprimer" onClick={() => remove(i)} danger>
                    <Trash2 />
                  </IconButton>
                </div>
                {isOpen ? (
                  <div className="space-y-5 border-t border-line bg-card p-4 md:p-5">
                    <Fields fields={field.fields} value={item} onChange={(v) => set(i, v)} ctx={ctx} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-line p-5 text-center text-sm text-ink-faint">Aucun élément. Cliquez sur « {field.itemLabel} » pour en ajouter.</p>
      )}
    </section>
  );
}

function IconButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid size-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-paper-deep disabled:opacity-30 [&>svg]:size-4 ${danger ? "hover:!bg-terracotta-soft hover:text-terracotta" : ""}`}
    >
      {children}
    </button>
  );
}

function ImageInput({ value, onChange, ctx }: { value: string; onChange: (v: string) => void; ctx: Ctx }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File) {
    setError("");
    setBusy(true);
    ctx.onUpload(1);
    try {
      onChange(await uploadImage(file, ctx.folder));
    } catch (e) {
      setError((e as Error).message || "L'envoi a échoué.");
    } finally {
      setBusy(false);
      ctx.onUpload(-1);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-paper-deep">
        {value ? <Image src={value} alt="" fill sizes="112px" className="object-cover" /> : <ImagePlus className="size-6 text-ink-faint" />}
        {busy ? (
          <span className="absolute inset-0 grid place-items-center bg-card/70">
            <Loader2 className="size-6 animate-spin" />
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pick(f);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="btn btn-ghost !py-2 text-sm">
          <ImagePlus className="size-4" /> {value ? "Changer la photo" : "Choisir une photo"}
        </button>
        {value ? (
          <button type="button" onClick={() => onChange("")} className="btn !py-1.5 text-sm text-terracotta hover:bg-terracotta-soft">
            <X className="size-4" /> Retirer
          </button>
        ) : null}
        {error ? <p className="text-sm text-terracotta">{error}</p> : null}
      </div>
    </div>
  );
}
