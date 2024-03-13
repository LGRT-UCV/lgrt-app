import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LAB_DETAILS } from "@/lib/constants";
import SessionAuthProvider from "@/context/sessionAuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: LAB_DETAILS.shortName,
  description: LAB_DETAILS.longName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionAuthProvider>
          {children}
        </SessionAuthProvider>
      </body>
    </html>
  );
}
