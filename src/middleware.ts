import { NextResponse, type NextRequest } from "next/server";
import { getUserCookie } from "./utils/auth/cookies";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const session = await getUserCookie();

  // if (session) console.log("Sesión actual:", JSON.parse(String(session)));

  const isLoginPage = url.pathname === "/login";

  // Si no hay sesión, redirigir al login
  if (!session && !isLoginPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si el usuario está autenticado y trata de acceder a /login, redirigirlo a la home
  if (session && isLoginPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Si la sesión es válida, continuar con la petición normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths excepto los que empiezan con:
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico (ícono)
     * - Archivos de imágenes (png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
