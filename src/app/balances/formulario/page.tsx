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
import {
  CalendarIcon,
  DollarSignIcon,
  TrashIcon,
  CirclePlusIcon,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {balanceId ? "Editar Balance" : "Agregar Balance"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={onSubmit}>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Ventas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["efectivo", "mercado_pago", "unicobros"].map((tipo) => (
                    <FormField
                      key={tipo}
                      name={`ventas.${tipo}`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">{tipo.replace("_", " ")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input
                                {...field}
                                id={tipo}
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
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Gastos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="pt-6 space-y-4">
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
                                  {(Object.values(CategoriaGasto) as Array<string>).map(
                                    (category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    )
                                  )}
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
                        <Button
                          variant="destructive"
                          onClick={() => remove(index)}
                          className="w-full"
                        >
                          <Trash2Icon className="w-4 h-4 mr-2" />
                          Eliminar Gasto
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    className="w-full"
                    type="button"
                    variant={"outline"}
                    onClick={() => append({ monto: "", categoria: "", descripcion: "" })}
                  >
                    <PlusCircleIcon className="mr-2 h-5 w-5" />
                    Agregar Gasto
                  </Button>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full">
                {balanceId ? "Actualizar Balance" : "Crear Balance"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
