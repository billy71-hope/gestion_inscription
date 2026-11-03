import { z } from "zod";

/**
 * Description déclarative des champs éditables. L'admin génère ses formulaires
 * à partir de ces définitions et le serveur en dérive la validation.
 */
type Base = { name: string; label: string; help?: string; placeholder?: string };

export type Field =
  | (Base & { type: "text" | "textarea" | "url" | "email" | "tel" | "image" })
  | (Base & { type: "number" })
  | (Base & { type: "boolean" })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  | (Base & { type: "list"; itemLabel: string; titleField?: string; fields: Field[] })
  | (Base & { type: "group"; fields: Field[] });

export type Section = {
  key: string;
  label: string;
  description: string;
  /** Page publique concernée, pour le lien « voir sur le site ». */
  path: string;
  fields: Field[];
};

function fieldSchema(field: Field): z.ZodType {
  switch (field.type) {
    case "number":
      return z.coerce.number().finite();
    case "boolean":
      return z.boolean();
    case "select":
      return z.enum(field.options.map((o) => o.value) as [string, ...string[]]);
    case "list":
      return z.array(objectSchema(field.fields)).max(500);
    case "group":
      return objectSchema(field.fields);
    case "textarea":
      return z.string().max(20000);
    default:
      return z.string().trim().max(2000);
  }
}

function objectSchema(fields: Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

export function sectionSchema(section: Section) {
  return objectSchema(section.fields);
}
