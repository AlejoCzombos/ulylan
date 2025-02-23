import admin from "@/utils/firebase/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const db = admin.firestore();

export async function tryGetUserRole(uid: string) {
  const user = await db.collection("users").doc(uid).get();

  if (!user.exists) {
    return null;
  }

  return user.data();
}

export async function tryGetUserFromCookies(cookies: ReadonlyRequestCookies) {
  const session = cookies.get("firebase-auth-cookie")?.value || null;

  if (!session) return null;

  return JSON.parse(String(session));
}

export async function userHasRole(uid: string, roles: string[]) {
  const user = await tryGetUserRole(uid);

  if (!user) {
    return false;
  }

  return roles.some((role) => user.role.includes(role));
}
