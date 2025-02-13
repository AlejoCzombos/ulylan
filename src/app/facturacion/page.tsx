"use client";

import { useState } from "react";
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
import { FileDown, Plus } from "lucide-react";

// Tipo para las facturas/gastos
type Invoice = {
  id: number;
  description: string;
  amount: number;
  type: "ingreso" | "gasto";
  category: string;
  date: Date;
};

// Datos de ejemplo
const invoices: Invoice[] = [
  {
    id: 1,
    description: "Venta de producto",
    amount: 100,
    type: "ingreso",
    category: "Ventas",
    date: new Date(),
  },
  {
    id: 2,
    description: "Compra de materiales",
    amount: 50,
    type: "gasto",
    category: "Materiales",
    date: new Date(),
  },
  // ... más datos de ejemplo
];

export default function Facturacion() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar y paginar los datos
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.description.toLowerCase().includes(search.toLowerCase()) ||
      invoice.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Función para exportar a Excel (simulada)
  const exportToExcel = () => {
    console.log("Exportando a Excel...");
    // Aquí iría la lógica real de exportación
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Facturación</h1>
        <Button onClick={exportToExcel} variant="outline" className="w-full sm:w-auto">
          <FileDown className="mr-2 h-5 w-5" /> Exportar a Excel
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <Input
          placeholder="Buscar por descripción o categoría"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Link href="/facturacion/agregar" passHref className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" /> Nueva Facturación
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.description}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>{invoice.category}</TableCell>
                <TableCell className="text-right">{invoice.date.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{currentPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
