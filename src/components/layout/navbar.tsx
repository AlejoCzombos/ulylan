"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-background">
      <Link href="/" className="text-xl font-bold">
        Gestor de Facturación
      </Link>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="size-12">
            <Menu size={64} />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col space-y-4 mt-4">
            <Link
              href="/facturacion"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={25} />
              <span>Facturación</span>
            </Link>
            {/* Aquí puedes agregar más elementos del menú en el futuro */}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
