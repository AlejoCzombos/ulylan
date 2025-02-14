export type BalanceDiario = {
  id?: number;
  fecha: Date;
  ventas: Ventas;
  gastos: Gasto[];
};

export type Ventas = {
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
