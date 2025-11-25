import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Broker Remover Tool",
  description: "Remove your information from data broker databases",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#2E2A44]">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
