"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserSession } from "@/utils/auth/useUserSession";
import { UserCookie } from "@/app/types";
import { logOut } from "@/utils/firebase/auth";

export function Navbar({ userCookie }: { userCookie: UserCookie | null }) {
  const [isOpen, setIsOpen] = useState(false);
  useUserSession(userCookie);

  return (
    <nav className="flex items-center justify-between p-4 bg-background">
      <Link href="/" className="text-xl font-bold">
        Gestor de Facturación
      </Link>
      {userCookie && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTitle className="invisible">Menú</SheetTitle>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="size-12">
              <Menu size={64} />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetDescription>Menú</SheetDescription>
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                href="/balances"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <FileText size={25} />
                <span>Detalles</span>
              </Link>
              {/* Aquí puedes agregar más elementos del menú en el futuro */}
              <Button
                // variant="secondary"
                className="mt-auto"
                onClick={() => {
                  // Add your signout logic here
                  setIsOpen(false);
                  logOut();
                }}
              >
                Cerrar sesión
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
}
