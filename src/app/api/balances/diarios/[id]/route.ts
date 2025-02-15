import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase/firebaseAdmin";
import { Gasto } from "@/app/types";
// import { validateFirebaseIdToken } from "@/utils/authorizationMiddleware";

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
    const balanceId = await getParams(request);
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

export async function PUT(request: NextRequest) {
  try {
    // const idToken = await validateFirebaseIdToken(request);
    // if (!idToken) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // }

    const body = await request.json();
    const balanceId = await getParams(request);

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
      Array.isArray(body.gastos) &&
      body.gastos.length > 0 &&
      body.gastos.some((gasto: Gasto) => gasto.monto !== undefined && gasto.monto <= 0)
    ) {
      return NextResponse.json({ message: "Los gastos son inválidos" }, { status: 400 });
    }

    // Controlar que no exista un balance diario para esa fecha
    const balanceDateRef = db.collection("balances_diarios").where("fecha", "==", body.fecha);
    // .where("id", "!=", String(balanceId));
    const balanceDateSnapshot = await balanceDateRef.get();
    if (!balanceDateSnapshot.empty) {
      if (
        balanceDateSnapshot.docs.some(
          (doc) => doc.data().turno === body.turno && doc.id !== balanceId
        )
      )
        return NextResponse.json(
          { message: "Ya existe un balance diario para esa fecha" },
          { status: 400 }
        );
    }

    const balanceRef = db.collection("balances_diarios").doc(String(balanceId));
    const balance = await balanceRef.get();

    if (!balance.exists) {
      return NextResponse.json({ message: "Balance diario no encontrado" }, { status: 404 });
    }

    const balanceData = {
      ...body,
      fecha: new Date(body.fecha),
      actualizadoEl: new Date(),
    };

    await balanceRef.update(balanceData);

    return NextResponse.json({ message: "Balance diario actualizado" }, { status: 200 });
  } catch (e) {
    console.log("Error:", e);
    // return NextResponse.json({ message: "Error al actualizar el balance diario" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // const idToken = await validateFirebaseIdToken(request);
    // if (!idToken) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // }

    const balanceId = await getParams(request);
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
