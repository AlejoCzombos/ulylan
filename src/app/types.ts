export type BalanceDiario = {
  fecha: Date;
  venta: Venta;
  gastos: Gasto[];
};

export type Venta = {
  mercado_pago: number;
  efectivo: number;
  unicobros: number;
};

export type Gasto = {
  monto: number;
  categoria: CategoriaGasto;
  descripcion?: string;
};

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
