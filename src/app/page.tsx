"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Gastos</h1>
      <Link href="/add-expense" passHref>
        <Button className="mt-4">Agregar Gasto</Button>
      </Link>
    </main>
  );
}
