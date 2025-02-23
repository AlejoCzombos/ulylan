"use server";

import { getUserRole } from "@/api/api.usuarios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSession(user: { uid: string; token: string }) {
  const response = await getUserRole(user.uid, user.token);

  if (!response.ok) {
    console.error("Error creating session", response.statusText);
    return;
  }

  const data = await response.json();

  const userCookie = {
    uid: user.uid,
    token: user.token,
    role: data.role,
  };

  (await cookies()).set("firebase-auth-cookie", JSON.stringify(userCookie), {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

  // redirect("/balances");
}

export async function removeSession() {
  (await cookies()).delete("firebase-auth-cookie");

  redirect("/login");
}

export async function tryGetUserCookie() {
  const session = (await cookies()).get("firebase-auth-cookie")?.value || null;

  if (!session) return null;

  return JSON.parse(String(session));
}
