import type { Metadata } from "next";
import { AuthProvider } from "@/lib/providers/auth-provider";
import "./globals.css";

// Mock font variable to avoid build-time network requests in offline environments
const inter = {
  variable: "font-sans",
};

export const metadata: Metadata = {
  title: "TransitOps | Fleet & Transport Operations Management",
  description: "Modern enterprise SaaS dashboard for fleet tracking and logistics operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background-app text-text-primary">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


