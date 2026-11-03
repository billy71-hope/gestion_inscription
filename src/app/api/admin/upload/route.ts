import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

/** Délivre un jeton d'envoi direct vers Vercel Blob, réservé à l'admin connecté. */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("Non autorisé");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
