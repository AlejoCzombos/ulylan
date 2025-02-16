"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Edit, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BalanceDetailModal } from "./BalanceDetailModal";
import { BalanceDiario, BalanceDiarioSearch } from "@/app/types";
import { DeleteBalanceModal } from "./BalanceDeleteModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface BalanceTableProps {
  balances: BalanceDiarioSearch;
  onDeleteBalance: (id: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isLastPage: boolean;
}

export function BalanceTable({
  balances,
  onDeleteBalance,
  currentPage,
  setCurrentPage,
  isLastPage,
}: BalanceTableProps) {
  const [selectedBalance, setSelectedBalance] = useState<BalanceDiario | null>(null);
  const [balanceToDelete, setBalanceToDelete] = useState<BalanceDiario | null>(null);

  const handleRowClick = (balance: BalanceDiario) => {
    setSelectedBalance(balance);
  };

  const handleDeleteClick = (balance: BalanceDiario) => {
    setBalanceToDelete(balance);
  };

  const handleConfirmDelete = () => {
    if (balanceToDelete && balanceToDelete.id) {
      onDeleteBalance(balanceToDelete.id);
      setBalanceToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      {balances && balances.balances.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Efectivo</TableHead>
                <TableHead>Mercado Pago</TableHead>
                <TableHead>Unicobros</TableHead>
                <TableHead>Cantidad de Ventas</TableHead>
                <TableHead>Gastos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances &&
                balances.balances.map((balance) => (
                  <TableRow
                    key={balance.id}
                    onClick={() => handleRowClick(balance)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="min-w-28">
                      {format(balance.fecha, "PPP", { locale: es })}
                    </TableCell>
                    <TableCell>{balance.turno}</TableCell>
                    <TableCell className="min-w-20">
                      ${balance.ventas.efectivo.toFixed(2)}
                    </TableCell>
                    <TableCell className="min-w-20">
                      ${balance.ventas.mercado_pago.toFixed(2)}
                    </TableCell>
                    <TableCell className="min-w-20">
                      ${balance.ventas.unicobros.toFixed(2)}
                    </TableCell>
                    <TableCell className="min-w-20">{balance.ventas.cantidad}</TableCell>
                    <TableCell className="min-w-20">
                      {balance.gastos.length > 0 ? balance.gastos.length + " gastos" : "Sin gastos"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/balances/formulario?id=${balance.id}`} passHref>
                          <Button size="icon" variant="ghost" title="Editar">
                            <Edit className="h-5 w-5" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBalance(balance);
                          }}
                          title="Ver detalles"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(balance);
                          }}
                          title="Eliminar"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow className="font-medium">
                <TableCell colSpan={2}>Subtotales</TableCell>
                <TableCell>${balances.subtotales.total_efectivo.toFixed(2)}</TableCell>
                <TableCell>${balances.subtotales.total_mercado_pago.toFixed(2)}</TableCell>
                <TableCell>${balances.subtotales.total_unicobros.toFixed(2)}</TableCell>
                <TableCell>{balances.subtotales.total_cantidad_ventas}</TableCell>
                <TableCell>${balances.subtotales.total_gastos_general.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  Total: ${balances.subtotales.total.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                {currentPage > 0 && (
                  <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                )}
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive={true}>{currentPage + 1}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                {!isLastPage && <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
      {selectedBalance && (
        <BalanceDetailModal
          balance={selectedBalance}
          isOpen={!!selectedBalance}
          onClose={() => setSelectedBalance(null)}
        />
      )}
      <DeleteBalanceModal
        balance={balanceToDelete}
        isOpen={!!balanceToDelete}
        onClose={() => setBalanceToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
