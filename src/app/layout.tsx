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
      <body className={`${inter.className} relative bg-transparent text-slate-900`}>
        {/* Subtle Corporate Glow Background */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[#fafafa]">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-yellow-400/10 blur-[120px] rounded-full" />
          <div className="absolute top-[30%] left-[20%] w-[800px] h-[800px] bg-orange-300/5 blur-[150px] rounded-full" />
        </div>
        
        <Navbar />
        <ToastContainer />
        <main className="min-h-screen pt-20 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
