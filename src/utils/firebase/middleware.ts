import { NextResponse, type NextRequest } from "next/server";
import admin from "./server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Obtener la cookie de sesión de Firebase
  const sessionCookie = request.cookies.get("__session");

  console.log("Cookie de sesión:", sessionCookie);

  if (!sessionCookie) {
    return redirectToLogin(request);
  }

  try {
    // Verificar y decodificar la sesión
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie.value, true);

    console.log("Sesión decodificada:", decodedClaims);

    if (!decodedClaims) {
      return redirectToLogin(request);
    }
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return redirectToLogin(request);
  }

  return response;
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}
