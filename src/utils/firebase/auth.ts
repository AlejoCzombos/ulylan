"use client";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase/client";
import { Login } from "@/app/types";
import { createSession, removeSession } from "../auth/cookies";

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(auth, callback);
}

export async function logInWithEmailAndPassword(data: Login) {
  try {
    const result = await signInWithEmailAndPassword(auth, data.email, data.password);

    if (!result || !result.user) {
      throw new Error("Error en el login");
    }

    await createSession({
      uid: result.user.uid,
      token: await result.user.getIdToken(),
    });

    return result.user.uid;
  } catch (error) {
    throw new Error(`Error al iniciar sesión: ${error instanceof Error ? error.message : "Unknown error"}`);
    //console.error("Error iniciando sesión", error);
  }
}

export async function logOut() {
  try {
    await auth.signOut();
    await removeSession();
  } catch (error) {
    throw new Error(`Logout error`);
    console.error("Logout error:", error);
  }
}
