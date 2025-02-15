export type BalanceDiario = {
  id?: number;
  fecha: Date;
  turno: Turno;
  ventas: Ventas;
  gastos: Gasto[];
};

export type Ventas = {
  cantidad: number | undefined;
  mercado_pago: number | undefined;
  efectivo: number | undefined;
  unicobros: number | undefined;
};

export type Gasto = {
  monto: number | undefined;
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
