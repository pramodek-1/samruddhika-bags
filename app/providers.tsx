'use client';

import { CartProvider } from "@/lib/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { UploadDropzone, UploadButton } from "@uploadthing/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        {children}
        <Toaster position="top-center" />
      </CartProvider>
    </ThemeProvider>
  );
} 