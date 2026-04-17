"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  QrCode, 
  Briefcase, 
  FileText, 
  Star,
  Award,
  Medal,
  LogOut
} from "lucide-react";
import Image from "next/image";

const menuItems = [
  { name: "Pano (Özet)", href: "/dashboard/student", icon: LayoutDashboard },
  { name: "QR Okut", href: "/dashboard/student/yoklama", icon: QrCode },
  { name: "Dijital Bohça", href: "/dashboard/student/bohca", icon: Briefcase },
  { name: "KPD Raporlarım", href: "/dashboard/student/raporlarim", icon: FileText },
  { name: "Dijital CV", href: "/dashboard/student/dijital-cv", icon: Star },
  { name: "Ödül ve Rozetler", href: "/dashboard/student/rozetler", icon: Award },
  { name: "Sertifikalar", href: "/dashboard/student/sertifikalar", icon: Medal },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex relative z-10 w-full">
      {/* Sidebar - PWA tarzı mobil ve masaüstü tasarımı */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-center">
          <Link href="/">
            <div className="relative h-12 w-40">
              <Image
                src="/images/logo/logo-orange.svg"
                alt="KADEME Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-4 mt-2">Öğrenci Paneli</div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full">
        {/* Mobile Header (PWA Tarzı) */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-8 w-28">
                    <Image
                        src="/images/logo/logo-orange.svg"
                        alt="KADEME Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </Link>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
        
        {/* Mobile Bottom Navigation (PWA style) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around p-2 z-40 pb-safe">
          {menuItems.slice(0, 5).map((item) => {
             const isActive = pathname === item.href;
             return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold mt-1 max-w-[60px] truncate text-center">{item.name}</span>
              </Link>
             )
          })}
        </div>
      </main>
    </div>
  );
}
