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
      {/* Sidebar - Premium Corporate Dark */}
      <aside className="w-64 bg-slate-950 border-r border-white/5 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 mb-4">
          <Link href="/">
            <div className="relative h-10 w-40">
              <Image
                src="/images/logo/logo-orange.svg"
                alt="KADEME Logo"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Öğrenci Paneli</span>
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
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

        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full pb-24 lg:pb-10">
          {children}
        </div>
        
        {/* Mobile Bottom Navigation (PWA style) - Refined for Corporate feel */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around p-2 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {menuItems.slice(0, 5).map((item) => {
             const isActive = pathname === item.href;
             return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold mt-1 max-w-[60px] truncate text-center uppercase tracking-tighter">{item.name}</span>
              </Link>
             )
          })}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
