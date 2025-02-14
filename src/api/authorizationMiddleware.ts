import { NextResponse } from "next/server";
import admin from "@/lib/firebase/firebaseAdmin";

export const validateFirebaseIdToken = async (req: Request) => {
  let idToken = req.headers.get("authorization");

  if (idToken && idToken.startsWith("Bearer ")) {
    idToken = idToken.split("Bearer ")[1];
  } else {
    throw new Error("No token found");
  }
  return idToken;
};

export const decodedIdToken = async (idToken: string) => {
  try {
    const auth = admin.auth();
    const decodedIdToken = await auth.verifyIdToken(idToken);
    return decodedIdToken;
  } catch (error) {
    throw new Error("Error verifying token");
  }
};
