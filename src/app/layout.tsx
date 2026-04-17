import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        <div className="fixed top-0 left-0 z-[9999] bg-red-600 text-white text-[8px] px-2 py-0.5 font-bold">KADEME_PROD_SYNC_TEST_V2</div>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
