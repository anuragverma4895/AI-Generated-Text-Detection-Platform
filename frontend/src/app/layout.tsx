import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TruthLens AI | Advanced Content Authenticity Detection",
  description: "Advanced AI-powered content authenticity analysis with detailed confidence scoring and enterprise-grade reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${inter.className} min-h-full flex flex-col bg-background text-foreground`}>
        <Navbar />
        <main className="flex-grow flex flex-col relative z-10 pt-20">
          {children}
        </main>
        <Footer />
        <div className="bg-grid fixed inset-0 z-0 pointer-events-none opacity-40"></div>
      </body>
    </html>
  );
}
