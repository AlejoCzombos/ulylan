import { z } from "zod";

export const BalanceDiarioSchema = z.object({
  fecha: z.date().transform((a) => {
    const date = new Date(a);
    date.setHours(0, 0, 0, 0);
    return date;
  }),
  turno: z.string().nonempty("El turno es requerido"),
  ventas: z.object({
    cantidad: z
      .string({ required_error: "La cantidad es requerida" })
      .transform((a) => parseInt(a)),
    efectivo: z.string({ required_error: "El monto es requerido" }).transform(parseFloat),
    mercado_pago: z.string({ required_error: "El monto es requerido" }).transform(parseFloat),
    unicobros: z.string({ required_error: "El monto es requerido" }).transform(parseFloat),
  }),
  gastos: z.array(
    z.object({
      monto: z.string().nonempty("El monto es requerido").transform(parseFloat),
      categoria: z.string().nonempty("La categoría es requerida"),
      descripcion: z.string().optional(),
    })
  ),
});
