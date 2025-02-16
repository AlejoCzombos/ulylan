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
  cantidad: number | undefined;
  mercado_pago: number | undefined;
  efectivo: number | undefined;
  unicobros: number | undefined;
};

export type GastoForm = {
  monto: number | undefined;
  categoria: CategoriaGasto;
  descripcion?: string;
};
