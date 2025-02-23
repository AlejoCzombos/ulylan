import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-privder";
import type React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { UserCookie } from "./types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestor de Gastos",
  description: "Aplicación para gestionar gastos diarios",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await cookies()).get("firebase-auth-cookie")?.value || null;

  let userCookie: UserCookie | null = null;
  if (session) {
    userCookie = JSON.parse(String(session));
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={(inter.className, "min-h-screen bg-background")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar userCookie={userCookie} />
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
