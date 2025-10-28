import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { AuthProvider } from "@/components/AuthProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "NeoShop - Modern E-commerce with Neo-Brutalist Design",
  description:
    "Next.js e-commerce app demonstrating SSG, ISR, SSR, and Server Components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 min-h-screen`}
      >
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="min-h-[calc(100vh-200px)]">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
