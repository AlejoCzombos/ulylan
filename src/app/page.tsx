"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Link href="/balances" passHref>
        <Button className="mt-4">Ir a Detalles</Button>
      </Link>
      {/* <Button onClick={logOut} className="mt-4">
        Cerrar sesión
      </Button> */}
    </main>
  );
}
