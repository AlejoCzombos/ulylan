import { NextResponse } from "next/server";
import admin from "@/lib/firebase/firebaseAdmin";
// import { validateFirebaseIdToken } from "@/utils/authorizationMiddleware";

const db = admin.firestore();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const balanceId = params.id;
    const balanceRef = db.collection("balances_diarios").doc(String(balanceId));
    const balance = await balanceRef.get();

    if (!balance.exists) {
      return NextResponse.json({ message: "Balance diario no encontrado" }, { status: 404 });
    }

    const balanceData = balance.data();

    const balanceResponse = {
      id: balance.id,
      ...balanceData,
    };

    return NextResponse.json(balanceResponse, { status: 200 });
  } catch (e) {
    console.log("Error:", e);
    return NextResponse.json({ message: "Error al obtener el balance diario" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // const idToken = await validateFirebaseIdToken(request);
    // if (!idToken) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // }

    const body = await request.json();

    if (!body.fecha) {
      return NextResponse.json({ message: "La fecha es requerida" }, { status: 400 });
    } else if (!body.venta) {
      return NextResponse.json({ message: "La venta es requerida" }, { status: 400 });
    } else if (
      body.venta.mercado_pago === undefined ||
      body.venta.efectivo === undefined ||
      body.venta.unicobros === undefined ||
      body.venta.mercado_pago <= 0 ||
      body.venta.efectivo <= 0 ||
      body.venta.unicobros <= 0
    ) {
      return NextResponse.json({ message: "La venta es inválida" }, { status: 400 });
    } else if (
      body.gastos &&
      body.gastos.length > 0 &&
      body.gastos.some((gasto: any) => gasto.monto <= 0)
    ) {
      return NextResponse.json({ message: "Los gastos son inválidos" }, { status: 400 });
    }

    const balanceId = params.id;
    const balanceRef = db.collection("balances_diarios").doc(String(balanceId));
    const balance = await balanceRef.get();

    if (!balance.exists) {
      return NextResponse.json({ message: "Balance diario no encontrado" }, { status: 404 });
    }

    await balanceRef.update(body);

    return NextResponse.json({ message: "Balance diario actualizado" }, { status: 200 });
  } catch (e) {
    console.log("Error:", e);
    return NextResponse.json({ message: "Error al actualizar el balance diario" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // const idToken = await validateFirebaseIdToken(request);
    // if (!idToken) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // }

    const balanceId = params.id;
    const balanceRef = db.collection("balances_diarios").doc(String(balanceId));
    const balance = await balanceRef.get();

    if (!balance.exists) {
      return NextResponse.json({ message: "Balance diario no encontrado" }, { status: 404 });
    }

    await balanceRef.delete();
    return Response.json({ message: "Balance diario eliminado" }, { status: 200 });
  } catch (e) {
    console.log("Error:", e);
    return Response.json({ message: "Error al eliminar el balance diario" }, { status: 500 });
  }
}
