import { NextRequest, NextResponse } from "next/server";
import admin from "@/utils/firebase/server";

const db = admin.firestore();

async function getParams(request: NextRequest): Promise<string> {
  // Extrae el ID de la URL
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  if (!id) {
    throw new Error("ID no proporcionado");
  }

  return id;
}

export async function GET(request: NextRequest) {
  try {
    const userUid = await getParams(request);

    const user = await db.collection("users").doc(userUid).get();

    if (!user.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = user.data();

    return NextResponse.json(userData, { status: 200 });
  } catch (e) {
    console.log("Error:", e);
    return NextResponse.json({ message: "Error al obtener el usuario" }, { status: 500 });
  }
}
