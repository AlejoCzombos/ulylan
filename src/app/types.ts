import { ColumnHeader } from "export-to-csv";

export type BalanceDiario = {
  id?: number;
  fecha: Date;
  turno: Turno;
  ventas: Ventas;
  gastos: Gasto[];
};

export type Ventas = {
  cantidad: number;
  mercado_pago: number;
  efectivo: number;
  unicobros: number;
};

export type Gasto = {
  monto: number;
  categoria: CategoriaGasto;
  descripcion?: string;
};

export enum Turno {
  Mañana = "Mañana",
  Tarde = "Tarde",
}

export enum CategoriaGasto {
  Fletes = "Fletes",
  Tejidos = "Tejidos",
  Libreria = "Libreria",
  Limpieza = "Limpieza",
  AnticiposSueldos = "Anticipos de Sueldos",
  SueldosExtras = "Sueldos extras",
  Varios = "Varios",
  Alquiler = "Alquiler",
  Impuestos = "Impuestos",
  CostosFinancieros = "Costos financieros",
  Telefono = "Telefono",
}

export type Login = {
  email: string;
  password: string;
};

export type UserCookie = {
  uid: string;
  token: string;
  role?: string;
};

export type BalanceDiarioSearch = {
  balances: BalanceDiario[];
  subtotales: BalanceDiarioSubtotales;
};

export type BalanceDiarioSubtotales = {
  total_efectivo: number;
  total_mercado_pago: number;
  total_unicobros: number;
  total_cantidad_ventas: number;
  total_gastos_general: number;
  total_gastos: Array<{ categoria: string; monto: number }> | null;
  total: number;
};

export type BalanceDiarioForm = {
  id?: number;
  fecha: Date;
  turno: Turno;
  ventas: VentasForm;
  gastos: GastoForm[];
};

export type VentasForm = {
  cantidad: number;
  mercado_pago: number;
  efectivo: number;
  unicobros: number;
};

export type GastoForm = {
  monto: number;
  categoria: CategoriaGasto;
  descripcion?: string;
};

export const headers: ColumnHeader[] = [
  { key: "Fecha", displayLabel: "Fecha" },
  { key: "Turno", displayLabel: "Turno" },
  { key: "Cantidad", displayLabel: "Cantidad" },
  { key: "Mercado Pago", displayLabel: "Mercado Pago" },
  { key: "Efectivo", displayLabel: "Efectivo" },
  { key: "Unicobros", displayLabel: "Unicobros" },
  ...Object.values(CategoriaGasto).flatMap((value) => [
    { key: value, displayLabel: value },
    { key: `${value} descripcion`, displayLabel: `${value} Descripción` },
  ]),
];

export const toCsvData = (balance: BalanceDiario) => {
  return {
    Fecha: balance.fecha,
    Turno: balance.turno,
    Ventas: balance.ventas.cantidad,
    "Mercado Pago": balance.ventas.mercado_pago,
    Efectivo: balance.ventas.efectivo,
    Unicobros: balance.ventas.unicobros,
    ...Object.values(CategoriaGasto).reduce((acc, value) => {
      const gasto = balance.gastos.find((gasto) => gasto.categoria === value);
      return {
        ...acc,
        [value]: gasto ? gasto.monto : 0,
        [`${value} descripcion`]: gasto ? gasto.descripcion : "",
      };
    }, {}),
  }
}