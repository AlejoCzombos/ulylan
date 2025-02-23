import { NextResponse, type NextRequest } from "next/server";
import { tryGetUserCookie } from "./utils/auth/cookies";

const PUBLIC_ROUTES = ["/login"];
const ROLE_BASED_ROUTES: Record<string, string[]> = {
  "/balances": ["admin"],
  "/balances/formulario": ["admin", "empleado"],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const session = await tryGetUserCookie();

  if (url.pathname.startsWith("/api/usuarios/")) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.includes(url.pathname)) {
    return NextResponse.next();
  }

  // Si no hay sesión, redirigir al login
  if (!session) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  const userRole = session.role;

  const allowedRoles = ROLE_BASED_ROUTES[url.pathname];

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return NextResponse.json(
      { error: "No tienes permisos para acceder a esta página" },
      { status: 403 }
    );
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
