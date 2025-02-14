"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BalanceDiario, CategoriaGasto, Gasto, Venta } from "@/app/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DollarSignIcon, TrashIcon, CirclePlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/utils/cn";

type BalanceDiarioFromType = z.infer<typeof BalanceDiario>;

const BalanceDiarioSchema = z.object({
  fecha: z.date(),
  venta: z.object({
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
      amount: z.string().nonempty("El monto es requerido").transform(parseFloat),
      category: z.string().nonempty("La categoría es requerida"),
      description: z.string().optional(),
    })
  ),
});

export default function AddBilling() {
  const form = useForm<BalanceDiarioFromType>({
    resolver: zodResolver(BalanceDiarioSchema),
    defaultValues: {
      date: new Date(),
      venta: {},
      gastos: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gastos",
  });

  const onSubmit = form.handleSubmit((values: BalanceDiarioFromType) => {
    console.log(values);
  });

  // console.log(form.watch());
  // console.log(form.formState.errors);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agregar Gasto/Ingreso</h1>
      <Form {...form}>
        <form className="space-y-3 max-w-md mx-auto" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha Ingreso / Gasto</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal w-full",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Elije una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("2022-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Ventas</h2>
            <FormField
              name="venta.efectivo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Efectivo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        {...field}
                        id="efectivo"
                        type="number"
                        className="pl-9 w-full"
                        placeholder="0.00"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="venta.mercado_pago"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Mercado Pago</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        {...field}
                        id="mercado_pago"
                        type="number"
                        className="pl-9 w-full"
                        placeholder="0.00"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="venta.unicobros"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Unicobros</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        {...field}
                        id="unicobros"
                        type="number"
                        className="pl-9 w-full"
                        placeholder="0.00"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gastos Dinámicos */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Gastos</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name={`gastos.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            {...field}
                            id={`gastos.${index}.amount`}
                            type="number"
                            className="pl-9 w-full"
                            placeholder="0.00"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`gastos.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(Object.values(CategoriaGasto) as Array<string>).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`gastos.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Opcional" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="destructive" onClick={() => remove(index)}>
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              className="w-full"
              type="button"
              variant={"outline"}
              onClick={() => append({ amount: "", category: "", description: "" })}
            >
              <CirclePlusIcon className="mr-2 size-8" />
              Agregar Gasto
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </form>
      </Form>
    </main>
  );
}
