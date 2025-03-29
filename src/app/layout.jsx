"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: "url('/images/hsdy.png')",
          backgroundAttachment: "fixed", // ทำให้พื้นหลังคงที่
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
