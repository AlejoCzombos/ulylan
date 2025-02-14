"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BalanceDiario, CategoriaGasto, Gasto } from "@/app/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DollarSignIcon, TrashIcon, CirclePlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/utils/cn";
import { BalanceDiarioSchema } from "./zod";
import { useEffect } from "react";
import {
  getBalanceById,
  createBalance as createBalanceAPI,
  updateBalance as updateBalanceAPI,
} from "@/api/api.products";

export default function FormularioBalance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const balanceId = searchParams.get("id");

  // Configuracion del formulario
  const form = useForm<BalanceDiario>({
    resolver: zodResolver(BalanceDiarioSchema),
    defaultValues: {
      fecha: new Date(),
      ventas: {},
      gastos: [],
    },
  });

  // Hook para manejar los campos dinámicos de gastos
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gastos",
  });

  // Cargar balance si se recibe un id
  useEffect(() => {
    if (balanceId) {
      getBalanceAndSetForm(balanceId);
    }
  }, [balanceId]);

  // Función para cargar el balance y setear el formulario
  const getBalanceAndSetForm = async (balanceId: string) => {
    const toastPromise = toast.loading("Cargando balance...");
    const response = await getBalanceById(balanceId);
    if (response.ok) {
      toast.success("Balance cargado correctamente", { id: toastPromise });
      const balance = await response.json();

      const gastos = balance.gastos.map(({ monto, categoria, descripcion }: Gasto) => ({
        monto: monto,
        categoria: Object.values(CategoriaGasto).find((value) => value === categoria),
        descripcion: descripcion,
      }));

      form.reset({
        fecha: new Date(balance.fecha),
        ventas: {
          efectivo: balance.ventas.efectivo.toString().replace(",", "."),
          mercado_pago: balance.ventas.mercado_pago.toString().replace(",", "."),
          unicobros: balance.ventas.unicobros.toString().replace(",", "."),
        },
        gastos: gastos.map((gasto: Gasto) => ({
          ...gasto,
          monto: gasto.monto.toString().replace(",", "."),
        })),
      });
    } else {
      toast.error("Error al cargar el balance", { id: toastPromise });
    }
  };

  const onSubmit = form.handleSubmit((values: BalanceDiario) => {
    if (balanceId) {
      updateBalance(values);
    } else {
      createBalance(values);
    }
  });

  const createBalance = async (values: BalanceDiario) => {
    const toastPromise = toast.loading("Creando balance...");
    const response = await createBalanceAPI(values);
    if (response.ok) {
      toast.success("Balance creado correctamente", { id: toastPromise });
      router.push("/balances");
    } else if (response.status === 400) {
      toast.error("Error: Ya existe un balance en esta fecha", { id: toastPromise });
      form.setError("fecha", { message: "Ya existe un balance en esta fecha" });
    } else {
      toast.error("Error al crear el balance", { id: toastPromise });
    }
  };

  const updateBalance = async (values: BalanceDiario) => {
    const toastPromise = toast.loading("Actualizando balance...");
    const response = await updateBalanceAPI(String(balanceId), values);
    if (response.ok) {
      toast.success("Balance actualizado correctamente", { id: toastPromise });
      router.push("/balances");
    } else if (response.status === 400) {
      toast.error("Error: Ya existe un balance en esta fecha", { id: toastPromise });
      form.setError("fecha", { message: "Ya existe un balance en esta fecha" });
    } else {
      toast.error("Error al actualizar el balance", { id: toastPromise });
      console.log(await response.json());
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agregar Balance</h1>
      <Form {...form}>
        <form className="space-y-3 max-w-md mx-auto" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha del balance</FormLabel>
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
              name="ventas.efectivo"
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
              name="ventas.mercado_pago"
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
              name="ventas.unicobros"
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
                  name={`gastos.${index}.monto`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            {...field}
                            id={`gastos.${index}.monto`}
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
                  name={`gastos.${index}.categoria`}
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
                  name={`gastos.${index}.descripcion`}
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
              onClick={() => append({ monto: "", categoria: "", descripcion: "" })}
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
