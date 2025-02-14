"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FileDown, Plus, Eye, Trash, Edit } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { BalanceDiario } from "../types";
import toast from "react-hot-toast";
import { getAllBalances } from "@/api/api.products";

import { BalanceTable } from "@/components/facturacion/BalanceTable";

export default function Balances() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [balancesList, setBalancesList] = useState<BalanceDiario[] | null>(null);

  useEffect(() => {
    fetchAllBalances();
  }, []);

  useEffect(() => {
    if (balancesList && balancesList.length < 10) {
      setIsLastPage(true);
    }
  }, [balancesList]);

  const fetchAllBalances = async () => {
    const toastPromise = toast.loading("Cargando balances...");
    const response = await getAllBalances(currentPage);

    if (response.ok) {
      toast.dismiss(toastPromise);
      const data = await response.json();
      setBalancesList(data);
    } else {
      toast.error("Error al cargar balances", { id: toastPromise });
    }
  };

  const onDeleteBalance = (id: number) => {
    // Delete balance
    toast.success("Balance eliminado correctamente");
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Balances</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <Button variant="outline" className="w-full sm:w-auto">
          <FileDown className="mr-2 size-7" /> Exportar a Excel
        </Button>
        <Link href="/balances/formulario" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 size-7" /> Nuevo Balance
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        {balancesList ? (
          <BalanceTable balancesList={balancesList} onDeleteBalance={onDeleteBalance} />
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (currentPage > 0) setCurrentPage((prev) => prev - 1);
              }}
              disabled={currentPage === 0}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={true}>{currentPage + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (!isLastPage) setCurrentPage((prev) => prev + 1);
              }}
              disabled={isLastPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
