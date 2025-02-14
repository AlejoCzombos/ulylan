import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase/firebaseAdmin";
// import { validateFirebaseIdToken } from "@/utils/authorizationMiddleware";

const db = admin.firestore();

type Params = {
  params: {
    id: string;
  };
};

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

export async function GET(request: NextRequest, context: { params: Params["params"] }) {
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

export async function PUT(request: NextRequest, context: { params: Params["params"] }) {
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
      body.gastos.some((gasto: any) => gasto.monto !== undefined && gasto.monto <= 0)
    ) {
      return NextResponse.json({ message: "Los gastos son inválidos" }, { status: 400 });
    }

    // Controlar que no exista un balance diario para esa fecha
    const balanceDiarioDateRef = db.collection("balances_diarios").where("fecha", "==", body.fecha);
    // .where("id", "!=", String(balanceId));
    const balanceDiarioDateSnapshot = await balanceDiarioDateRef.get();
    if (!balanceDiarioDateSnapshot.empty) {
      if (balanceDiarioDateSnapshot.docs[0].id !== balanceId)
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

    await balanceRef.update(body);

    return NextResponse.json({ message: "Balance diario actualizado" }, { status: 200 });
  } catch (e) {
    console.log("Error:", e);
    // return NextResponse.json({ message: "Error al actualizar el balance diario" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Params["params"] }) {
  try {
    // const idToken = await validateFirebaseIdToken(request);
    // if (!idToken) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // }

    const balanceId = context.params.id;
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
