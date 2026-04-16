"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ClipboardCheck, 
  Bell, 
  Calendar, 
  ShieldCheck, 
  Settings,
  LogOut,
  Trophy
} from "lucide-react";
import Image from "next/image";

const menuItems = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Projeler", href: "/dashboard/admin/projects", icon: Briefcase },
  { name: "Katılımcılar", href: "/dashboard/admin/participants", icon: Users },
  { name: "Başvurular", href: "/dashboard/admin/applications", icon: ClipboardCheck },
  { name: "Duyurular", href: "/dashboard/admin/announcements", icon: Bell },
  { name: "Takvim", href: "/dashboard/admin/calendar", icon: Calendar },
  { name: "Oyunlaştırma", href: "/dashboard/admin/gamification", icon: Trophy },
  { name: "KPD Sistemi", href: "/dashboard/admin/materials", icon: ShieldCheck },
  { name: "Sistem Ayarları", href: "/dashboard/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden lg:flex">
        <div className="p-6 border-b border-gray-50">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-40">
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

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                pathname === item.href
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon size={18} strokeWidth={pathname === item.href ? 2.5 : 2} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={18} />
              Çıkış Yap
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-7 w-28">
                    <Image
                        src="/images/logo/logo-orange.svg"
                        alt="KADEME Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </Link>
            {/* Mobile menu toggle button could be added here if needed */}
        </header>

        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
