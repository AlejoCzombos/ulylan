"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { mkConfig, generateCsv, download, CsvOutput } from "export-to-csv";

import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";

import { BalanceTable } from "@/components/facturacion/BalanceTable";
import { BalanceSearch } from "@/components/facturacion/BlanceSearch";
import { BalanceDiario, BalanceDiarioSearch, headers, toCsvData } from "../types";
import { deleteBalance, getAllBalances } from "@/api/api.detalles";

export default function Balances() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [balancesList, setBalancesList] = useState<BalanceDiarioSearch | null>(null);

  const [csvConfig, setCsvConfig] = useState(() =>
    mkConfig({
      columnHeaders: headers,
      useKeysAsHeaders: true,
      filename: `Detalle ${new Date().toLocaleDateString()}`,
      fieldSeparator: ";",
      title: `Detalle ${new Date().toLocaleDateString()}`,
    })
  );
  const [exportData, setExportData] = useState<CsvOutput | null>(null);

  useEffect(() => {
    //if (balancesList && balancesList.balances.length < 10) {
    if (balancesList) {
      setIsLastPage(true);

      const csvData = balancesList.balances.map((balance) => toCsvData(balance));
      csvData.push({
        Fecha: "Subtotal",
        Turno: "",
        Ventas: balancesList.subtotales.total_cantidad_ventas,
        "Mercado Pago": balancesList.subtotales.total_mercado_pago,
        Efectivo: balancesList.subtotales.total_efectivo,
        Unicobros: balancesList.subtotales.total_unicobros,
        ...Object.assign(
          {},
          ...(balancesList.subtotales.total_gastos
            ? balancesList.subtotales.total_gastos.map((gasto) => ({
                [gasto.categoria]: gasto.monto,
              }))
            : [])
        ),
      });
      // @ts-expect-error no se que poner aca
      const csv = generateCsv(csvConfig)(csvData);
      setExportData(csv)
    }
    
  }, [balancesList, csvConfig]);

  const onSearchBalance = async (startDate: Date, endDate: Date) => {
    const toastPromise = toast.loading("Buscando balances...");
    const response = await getAllBalances(currentPage, startDate, endDate);
    if (response.ok) {
      toast.dismiss(toastPromise);
      const data = await response.json();
      setBalancesList(data);

      setCsvConfig(
        mkConfig({
          columnHeaders: headers,
          useKeysAsHeaders: true,
          filename: `Detalle ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          fieldSeparator: ";",
          title: `Detalle ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        })
      );
    } else {
      toast.error("Error al buscar balances", { id: toastPromise });
    }
  };

  const onDeleteBalance = async (id: number) => {
    const newBalancesList: BalanceDiario[] = balancesList
      ? balancesList.balances.filter((balance) => balance.id !== id)
      : [];
    setBalancesList((prevState) =>
      prevState ? { ...prevState, balances: newBalancesList } : null
    );
    const response = await deleteBalance(String(id));

    if (response.ok) {
      toast.success("Balance eliminado correctamente");
    } else {
      toast.error("Error al eliminar balance");
    }
  };

  const OnClickExport = () => {
    if (!exportData) {
      toast.error("No hay datos para exportar");
      return;
    }
    download(csvConfig)(exportData)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles diarios</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        
        {
          balancesList && (
            <Button variant="outline" className="w-full sm:w-auto" onClick={OnClickExport}>
              <FileDown className="mr-2 size-7" />Exportar a Excel
            </Button>
          )
        }
        <Link href="/balances/formulario" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 size-7" /> Nuevo Detalle
          </Button>
        </Link>
      </div>
      <BalanceSearch onSearch={onSearchBalance} />
      {balancesList && (
        <BalanceTable
          balances={balancesList}
          onDeleteBalance={onDeleteBalance}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLastPage={isLastPage}
        />
      )}
    </main>
  );
}
