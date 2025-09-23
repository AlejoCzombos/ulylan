import { CategoriaGasto, Turno } from "@/app/types";
import { z } from "zod";

export const BalanceDiarioSchema = z.object({
  fecha: z.date({ required_error: "La fecha es requerida" }).transform((a) => {
    const date = new Date(a);
    date.setHours(0, 0, 0, 0);
    return date;
  }),
  turno: z
    .string()
    .nonempty("El turno es requerido")
    .transform((a) => a as Turno),
  ventas: z.object({
    cantidad: z
      .string({ required_error: "La cantidad es requerida" })
      .transform((a) => parseInt(a)),
    efectivo: z.string({ required_error: "El monto es requerido" }).transform((val) => {
      const num = parseFloat(val.replace(",", "."));
      return Math.round(num * 100) / 100; // Round to 2 decimal places to avoid floating point issues
    }),
    mercado_pago: z.string({ required_error: "El monto es requerido" }).transform((val) => {
      const num = parseFloat(val.replace(",", "."));
      return Math.round(num * 100) / 100;
    }),
    unicobros: z.string({ required_error: "El monto es requerido" }).transform((val) => {
      const num = parseFloat(val.replace(",", "."));
      return Math.round(num * 100) / 100;
    }),
  }),
  gastos: z.array(
    z.object({
      monto: z.string().nonempty("El monto es requerido").transform(parseFloat),
      categoria: z
        .string()
        .nonempty("La categoría es requerida")
        .transform((a) => a as CategoriaGasto),
      descripcion: z.string().optional(),
    })
  ),
});

