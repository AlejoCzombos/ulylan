import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BalanceDiario, Gasto, Ventas } from "@/app/types";

interface BalanceDetailModalProps {
  balance: BalanceDiario;
  isOpen: boolean;
  onClose: () => void;
}

export function BalanceDetailModal({ balance, isOpen, onClose }: BalanceDetailModalProps) {
  const totalVentas = (ventas: Ventas) => ventas.efectivo + ventas.mercado_pago + ventas.unicobros;

  const totalGastos = (gastos: Gasto[]) => gastos.reduce((sum, gasto) => sum + gasto.monto, 0);

  const balanceNeto = totalVentas(balance.ventas) - totalGastos(balance.gastos);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Detalles del Balance Diario</DialogTitle>
          <DialogDescription>
            Fecha: {format(balance.fecha, "PPP", { locale: es })} - Turno: {balance.turno}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Efectivo</TableCell>
                    <TableCell className="text-right">
                      ${balance.ventas.efectivo.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mercado Pago</TableCell>
                    <TableCell className="text-right">
                      ${balance.ventas.mercado_pago.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Unicobros</TableCell>
                    <TableCell className="text-right">
                      ${balance.ventas.unicobros.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cantidad de Ventas</TableCell>
                    <TableCell className="text-right">{balance.ventas.cantidad}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <strong>Total Ventas</strong>
                <span>${totalVentas(balance.ventas).toFixed(2)}</span>
              </div>
            </CardFooter>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balance.gastos.map((gasto: Gasto, index) => (
                    <TableRow key={index}>
                      <TableCell>{gasto.categoria}</TableCell>
                      <TableCell>{gasto.descripcion || "-"}</TableCell>
                      <TableCell className="text-right">${gasto.monto.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <strong>Total Gastos</strong>
                <span>${totalGastos(balance.gastos).toFixed(2)}</span>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Ventas</TableCell>
                    <TableCell className="text-right">
                      ${totalVentas(balance.ventas).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Gastos</TableCell>
                    <TableCell className="text-right">
                      ${totalGastos(balance.gastos).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <strong>Balance Neto</strong>
                <span className={balanceNeto >= 0 ? "text-green-600" : "text-red-600"}>
                  ${balanceNeto.toFixed(2)}
                </span>
              </div>
            </CardFooter>
          </Card>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
