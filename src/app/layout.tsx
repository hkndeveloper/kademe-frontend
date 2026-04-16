import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "KADEME | Kurumsal Akademik Eğitim ve Mezuniyet Ekosistemi",
  description: "KADEME bünyesinde yürütülen projelerin dijital yönetim platformu.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KADEME",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navbar />
        <ToastContainer />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
