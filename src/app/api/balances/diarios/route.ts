import { NextResponse } from "next/server";
import admin from "@/lib/firebase/firebaseAdmin";
import { Gasto } from "@/app/types";
// import { validateFirebaseIdToken } from "@/utils/authorizationMiddleware";

const db = admin.firestore();

export async function GET(request: Request) {
  try {
    // const idToken = await validateFirebaseIdToken(request)
    //     if (!idToken) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    //     }

    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get("page") || "0");
    const size = parseInt(url.searchParams.get("size") || "10");

    const snapshot = await db
      .collection("balances_diarios")
      .orderBy("fecha")
      .limit(size)
      .offset(page * size)
      .get();
    const balancesDiarios = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json(balancesDiarios, { status: 200 });
  } catch (e) {
    console.log("Error:", e);
    return NextResponse.json({ message: "Error al obtener los balances diarios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // const idToken = await validateFirebaseIdToken(request)
    // if (!idToken) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    // }

    const body = await request.json();

    if (!body.fecha) {
      return NextResponse.json({ message: "La fecha es requerida" }, { status: 400 });
    } else if (!body.ventas) {
      return NextResponse.json({ message: "La venta es requerida" }, { status: 400 });
    } else if (
      body.ventas.mercado_pago === undefined ||
      body.ventas.efectivo === undefined ||
      body.ventas.unicobros === undefined ||
      body.ventas.mercado_pago <= 0 ||
      body.ventas.efectivo <= 0 ||
      body.ventas.unicobros <= 0
    ) {
      return NextResponse.json({ message: "La venta es inválida" }, { status: 400 });
    } else if (
      body.gastos &&
      body.gastos.length > 0 &&
      body.gastos.some((gasto: Gasto) => gasto.monto <= 0)
    ) {
      return NextResponse.json({ message: "Los gastos son inválidos" }, { status: 400 });
    }

    const balance_diario = {
      ...body,
    };

    // Controlar que no exista un balance diario para esa fecha
    const balanceDiarioDateRef = db.collection("balances_diarios").where("fecha", "==", body.fecha);
    const balanceDiarioDateSnapshot = await balanceDiarioDateRef.get();
    if (!balanceDiarioDateSnapshot.empty) {
      return NextResponse.json(
        { message: "Ya existe un balance diario para esa fecha" },
        { status: 400 }
      );
    }

    const newBalanceDiarioRef = db.collection("balances_diarios").doc();

    newBalanceDiarioRef.set({ ...balance_diario, id: newBalanceDiarioRef.id });

    return NextResponse.json({ message: "Balance diario creado correctamente" }, { status: 201 });
  } catch (e) {
    console.log("Transaction failure:", e);
    return NextResponse.json({ message: "Error al crear el balance diario" }, { status: 500 });
  }
}
