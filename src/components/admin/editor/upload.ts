import { upload } from "@vercel/blob/client";

const MAX_SIDE = 1800;

/** Réduit les photos trop grandes avant l'envoi (les photos de téléphone font souvent 4 à 8 Mo). */
async function shrink(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1_500_000) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Conversion impossible"))), type, 0.85),
  );
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Ce fichier n'est pas une image.");
  const body = await shrink(file);
  const ext = body.type === "image/png" ? "png" : body.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() ?? "img");
  const base = file.name.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[^\w-]+/g, "-").slice(0, 40) || "photo";
  const blob = await upload(`${folder}/${base}.${ext}`, body, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    contentType: body.type || file.type,
  });
  return blob.url;
}
