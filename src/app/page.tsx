"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Link href="/balances/formulario" passHref>
        <Button className="w-full lg:max-w-32 mt-4">Crear un Detalle</Button>
      </Link>
    </main>
  );
}
