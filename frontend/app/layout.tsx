import type { Metadata } from "next";
import {  Readex_Pro, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const arFont = Readex_Pro({
 weight : "400"

})

export const metadata: Metadata = {
  title: "endline",
  description: "A complete learning environment for deep focus while studying or learning a skill",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", arFont.className, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
                {children}
            </AuthProvider>
            </ThemeProvider>
          </body>
    </html>
  );
}
