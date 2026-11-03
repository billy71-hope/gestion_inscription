import { NextResponse, type NextRequest } from "next/server";

/**
 * Vérification rapide : sans cookie de session, on renvoie vers la connexion.
 * La vraie vérification (signature, version de session) est faite par requireAdmin()
 * dans chaque page et action de l'admin.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has("sth_admin")) {
    const url = new URL("/admin/connexion", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!connexion).*)"],
};
