import { z } from "zod";

export const BalanceDiarioSchema = z.object({
  fecha: z.date().transform((a) => {
    const date = new Date(a);
    date.setHours(0, 0, 0, 0);
    return date;
  }),
  ventas: z.object({
    efectivo: z.string({ required_error: "El monto es requerido" }).transform((a) => parseFloat(a)),
    mercado_pago: z
      .string({ required_error: "El monto es requerido" })
      .transform((a) => parseFloat(a)),
    unicobros: z
      .string({ required_error: "El monto es requerido" })
      .transform((a) => parseFloat(a)),
  }),
  gastos: z.array(
    z.object({
      monto: z.string().nonempty("El monto es requerido").transform(parseFloat),
      categoria: z.string().nonempty("La categoría es requerida"),
      descripcion: z.string().optional(),
    })
  ),
});
