export type Billing = {
  description: string;
  amount: number;
  type: "ingreso" | "gasto";
  deposit_category: string;
  expense_category: string;
  date: Date;
};

const deposit_categories = ["Caja", "Tarjeta", "Mercado Pago"];
const expense_categories = ["Comida", "Servicios", "Alquiler"];
