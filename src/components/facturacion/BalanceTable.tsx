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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BalanceDetailModal } from "./BalanceDetailModal";
import { BalanceDiario } from "@/app/types";
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
  balancesList: BalanceDiario[];
  onDeleteBalance: (id: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isLastPage: boolean;
}

export function BalanceTable({
  balancesList,
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
      {balancesList && balancesList.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Efectivo</TableHead>
                <TableHead>Mercado Pago</TableHead>
                <TableHead>Unicobros</TableHead>
                <TableHead>Gastos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balancesList &&
                balancesList.map((balance) => (
                  <TableRow
                    key={balance.id}
                    onClick={() => handleRowClick(balance)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      {format(new Date(balance.fecha._seconds * 1000), "PPP", { locale: es })}
                    </TableCell>
                    <TableCell>${balance.ventas.efectivo.toFixed(2)}</TableCell>
                    <TableCell>${balance.ventas.mercado_pago.toFixed(2)}</TableCell>
                    <TableCell>${balance.ventas.unicobros.toFixed(2)}</TableCell>
                    <TableCell>
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
          </Table>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                {currentPage > 0 && (
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => prev - 1)} />
                )}
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive={true}>{currentPage + 1}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                {!isLastPage && (
                  <PaginationNext onClick={() => setCurrentPage((prev) => prev + 1)} />
                )}
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
