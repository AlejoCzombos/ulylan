import { NextResponse } from "next/server";
import admin from "@/lib/firebase/firebaseAdmin";
import { id } from "date-fns/locale";
// import { validateFirebaseIdToken } from "@/utils/authorizationMiddleware";

const db = admin.firestore();

export async function GET(
  request: Request,
  { params = { page: 0, size: 10 } }: { params: { page: number; size: number } }
) {
  try {
    // const idToken = await validateFirebaseIdToken(request)
    //     if (!idToken) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    //     }

    const snapshot = await db
      .collection("balances_diarios")
      .orderBy("fecha")
      .limit(params.size)
      .offset(params.page * params.size)
      .get();
    const balancesDiarios = snapshot.docs.map((doc) => doc.data());

    // const balances_diarios_response = balances_diarios
    //   .map((cliente) => ({
    //     id: cliente.id,
    //     nombre: cliente.nombre,
    //     apellido: cliente.apellido,
    //     puntos: cliente.puntos,
    //   }))
    //   .sort((a, b) => a.id - b.id);

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

    const balance_diario = {
      ...body,
    };

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
