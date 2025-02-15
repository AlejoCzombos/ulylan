"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <Button>
        <Link href="/balances">Ir a balances</Link>
      </Button>
    </main>
  );
}
