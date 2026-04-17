"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Star,
  LogOut
} from "lucide-react";
import Image from "next/image";

const menuItems = [
  { name: "Mezun Paneli", href: "/dashboard/alumni", icon: Users },
  { name: "İlanlar & Fırsatlar", href: "/dashboard/alumni/ilanlar", icon: Briefcase },
  { name: "Mezun Etkinlikleri", href: "/dashboard/alumni/etkinlikler", icon: Calendar },
  { name: "Dijital CV'm", href: "/dashboard/alumni/dijital-cv", icon: Star },
];

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex relative z-10 w-full">
      {/* Sidebar */}
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
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-4 mt-2">Mezun Portalı</div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
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
        {/* Mobile Header */}
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
          {menuItems.map((item) => {
             const isActive = pathname === item.href;
             return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
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
