import "tailwindcss/tailwind.css";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import HolyLoader from "holy-loader";

import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_METADATA } from "@/lib/metadata";

export const metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className="flex flex-col min-h-screen">
          <HolyLoader />
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
