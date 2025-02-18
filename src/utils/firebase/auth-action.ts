"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSession(uid: string) {
  (await cookies()).set("firebase-auth-cookie", uid, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

  redirect("/");
}

export async function removeSession() {
  (await cookies()).delete("firebase-auth-cookie");

  redirect("/login");
}
