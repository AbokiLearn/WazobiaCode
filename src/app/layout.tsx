import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WazobiaCode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`${inter.className}`}>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            {children}
          </div>
          <Toaster />
        </body>
      </UserProvider>
    </html>
  );
}
