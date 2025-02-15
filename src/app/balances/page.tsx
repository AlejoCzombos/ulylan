"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { BalanceDiario } from "../types";
import toast from "react-hot-toast";
import { deleteBalance, getAllBalances } from "@/api/api.products";

import { BalanceTable } from "@/components/facturacion/BalanceTable";
import { BalanceSearch } from "@/components/facturacion/BlanceSearch";

export default function Balances() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [balancesList, setBalancesList] = useState<BalanceDiario[] | null>(null);

  // useEffect(() => {
  //   const fetchAllBalances = async () => {
  //     const toastPromise = toast.loading("Cargando balances...");
  //     const response = await getAllBalances(currentPage);

  //     if (response.ok) {
  //       toast.dismiss(toastPromise);
  //       const data = await response.json();
  //       setBalancesList(data);
  //     } else {
  //       toast.error("Error al cargar balances", { id: toastPromise });
  //     }
  //   };
  //   fetchAllBalances();
  // }, []);

  useEffect(() => {
    if (balancesList && balancesList.length < 10) {
      setIsLastPage(true);
    }
  }, [balancesList]);

  const onSearchBalance = async (startDate: Date, endDate: Date) => {
    const toastPromise = toast.loading("Buscando balances...");
    const response = await getAllBalances(currentPage, startDate, endDate);
    if (response.ok) {
      toast.dismiss(toastPromise);
      const data = await response.json();
      setBalancesList(data);
    } else {
      toast.error("Error al buscar balances", { id: toastPromise });
    }
  };

  const onDeleteBalance = async (id: number) => {
    const newBalancesList: BalanceDiario[] = balancesList
      ? balancesList.filter((balance) => balance.id !== id)
      : [];
    setBalancesList(newBalancesList);

    const response = await deleteBalance(String(id));

    if (response.ok) {
      toast.success("Balance eliminado correctamente");
    } else {
      toast.error("Error al eliminar balance");
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles diarios</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <Button variant="outline" className="w-full sm:w-auto">
          <FileDown className="mr-2 size-7" /> Exportar a Excel
        </Button>
        <Link href="/balances/formulario" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 size-7" /> Nuevo Detalle
          </Button>
        </Link>
      </div>
      <BalanceSearch onSearch={onSearchBalance} />
      {balancesList && (
        <BalanceTable
          balancesList={balancesList}
          onDeleteBalance={onDeleteBalance}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLastPage={isLastPage}
        />
      )}
    </main>
  );
}
