"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSession(user: { uid: string; token: string }) {
  (await cookies()).set("firebase-auth-cookie", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

  redirect("/");
}

export async function removeSession() {
  (await cookies()).delete("firebase-auth-cookie");

  redirect("/login");
}

export async function getUserCookie() {
  const session = (await cookies()).get("firebase-auth-cookie")?.value || null;

  if (!session) return null;

  return JSON.parse(String(session));
}
