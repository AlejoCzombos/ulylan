import {
  signInWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase/client";
import { Login } from "@/app/types";
import { createSession, tryGetUserCookie, removeSession } from "../auth/cookies";

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

    console.log("Usuario autenticado desde auth.ts:", result.user.uid);

    return result.user.uid;
  } catch (error) {
    console.error("Error iniciando sesión", error);
  }
}

export async function logOut() {
  try {
    await removeSession();
    console.log("Sesión cerrada:", tryGetUserCookie());
    await auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(`Logout error`);
  }
}
