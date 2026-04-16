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
  { name: "Koordinatörler", href: "/dashboard/admin/coordinators", icon: ShieldCheck },
  { name: "Oyunlaştırma", href: "/dashboard/admin/gamification", icon: Trophy },
  { name: "KPD Sistemi", href: "/dashboard/admin/materials", icon: ShieldCheck },
  { name: "Sistem Ayarları", href: "/dashboard/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);

  React.useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("user_roles") || "[]");
    setIsSuperAdmin(roles.includes("super-admin"));
  }, []);

  const visibleMenuItems = menuItems.filter(item => {
    // Üst Admin her şeyi görür
    if (isSuperAdmin) return true;

    // Koordinatörün (Şartname Madde 5.1 ve 11.16 uyarınca) göremediği menüler:
    const forbiddenForCoordinator = [
      "Koordinatörler",  // Diğer koordinatörleri yönetemez
      "Sistem Ayarları", // Genel sistem ayarları üst admin yetkisindedir
      "Oyunlaştırma",    // Global oyunlaştırma altyapısı admin içindir
    ];

    if (forbiddenForCoordinator.includes(item.name)) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-transparent flex relative z-10">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-3xl border-r border-slate-200/50 flex flex-col sticky top-0 h-screen hidden lg:flex">
        <div className="p-6 border-b border-slate-200/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-14 w-48">
              <Image
                src="/images/logo/logo-orange.svg"
                alt="KADEME Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => (
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

        <div className="p-4 border-t border-slate-200/50">
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 p-4 flex items-center justify-between sticky top-0 z-30">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-10 w-36">
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
