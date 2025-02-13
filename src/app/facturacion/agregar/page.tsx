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
import type { Billing } from "@/app/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DollarSignIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/utils/cn";

type BillingType = z.infer<typeof Billing>;

const deposit_categories = ["Caja", "Tarjeta", "Mercado Pago"];
const expense_categories = ["Comida", "Servicios", "Alquiler"];

const billingSchema = z.object({
  date: date().min(new Date("2022-01-01"), "La fecha no puede ser menor a 2022-01-01"),
  amount: z.string({ required_error: "El monto es requerido" }).transform((a) => parseFloat(a)),
  type: z.enum(["ingreso", "gasto"]),
  deposit_category: z.enum(["Caja", "Tarjeta", "Mercado Pago"]).optional(),
  expense_category: z.enum(["Comida", "Servicios", "Alquiler"]).optional(),
  description: z.string().optional(),
});

export default function AddBilling() {
  const form = useForm<BillingType>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      date: new Date(),
      amount: 0,
      type: "ingreso",
      deposit_category: "Caja",
      expense_category: "Comida",
      description: "",
    },
  });
  const router = useRouter();

  const onSubmit = form.handleSubmit((values: BillingType) => {
    console.log(values);
  });

  // console.log(form.watch());
  // console.log(form.formState.errors);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agregar Gasto/Ingreso</h1>
      <Form {...form}>
        <form className="space-y-6 max-w-md mx-auto" onSubmit={onSubmit}>
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

          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      {...field}
                      id="amount"
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
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ingreso" id="ingreso" />
                      </FormControl>
                      <FormLabel htmlFor="ingreso">Ingreso</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="gasto" id="gasto" />
                      </FormControl>
                      <FormLabel htmlFor="gasto">Gasto</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("type") === "ingreso" ? (
            <FormField
              control={form.control}
              name="deposit_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccioná una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deposit_categories.map((category) => (
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
          ) : (
            <>
              <FormField
                control={form.control}
                name="expense_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccioná una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expense_categories.map((category) => (
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
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} id="description" className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </form>
      </Form>
    </main>
  );
}
