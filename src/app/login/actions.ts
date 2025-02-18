"use client";

import { useRouter } from "next/navigation";

import { Login } from "../types";
import toast from "react-hot-toast";
import { auth } from "@/utils/firebase/client";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function login(data: Login) {
  const result = await signInWithEmailAndPassword(auth, data.email, data.password);

  if (!result && !result.user) {
    console.error("Login error:", result);
    throw new Error(`Login error`);
  }

  console.log("Inicio de sesión exitoso:", result.user);

  toast.success("Inicio de sesión exitoso.");

  const router = useRouter();
  router.push("/");
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(`Logout error`);
  }
}
