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
  ShieldAlert,
  Settings,
  LogOut,
  Trophy,
  BookOpen,
  ClipboardList,
  ShieldCheck as ShieldCheckIcon,
  Users as UsersIcon,
  Layers,
  Camera
} from "lucide-react";
import Image from "next/image";

import { Role, hasAbility } from "@/lib/permissions";
import { logout } from "@/lib/auth-utils";

const menuItems = [
  { name: "Dashboard",       href: "/dashboard/admin",               icon: LayoutDashboard, ability: 'view-dashboard' },
  { name: "Projeler",        href: "/dashboard/admin/projects",       icon: Briefcase,       ability: 'manage-projects' },
  { name: "Katılımcılar",   href: "/dashboard/admin/participants",   icon: Users,           ability: 'manage-participants' },
  { name: "Kara Liste",     href: "/dashboard/admin/blacklist",      icon: ShieldAlert,     ability: 'manage-blacklist' },
  { name: "Başvurular",     href: "/dashboard/admin/applications",   icon: ClipboardCheck,   ability: 'manage-applications' },
  { name: "Blog Yönetimi",  href: "/dashboard/admin/blog",           icon: BookOpen,        ability: 'write-blog' },
  { name: "İşlem Logları",  href: "/dashboard/admin/logs",           icon: ClipboardList,   ability: 'view-audit-logs' },
  { name: "Duyurular",      href: "/dashboard/admin/announcements",  icon: Bell,            ability: 'manage-announcements' },
  { name: "Takvim",         href: "/dashboard/admin/calendar",       icon: Calendar,        ability: 'view-calendar' },
  { name: "Koordinatörler", href: "/dashboard/admin/coordinators",   icon: ShieldCheck,     ability: 'manage-coordinators' },
  { name: "Oyunlaştırma",   href: "/dashboard/admin/gamification",   icon: Trophy,          ability: 'manage-gamification' },
  { name: "Destek Merkezi", href: "/dashboard/admin/support",        icon: BookOpen,        ability: 'manage-support' },
  { name: "KPD Sistemi",    href: "/dashboard/admin/kpd",            icon: ClipboardCheck,   ability: 'manage-kpd' },
  { name: "Sistem Ayarları",href: "/dashboard/admin/settings",       icon: Settings,        ability: 'manage-settings' },
  { name: "Yetki Matrisi",  href: "/dashboard/admin/permissions",    icon: ShieldAlert,     ability: 'manage-permissions' },
  { name: "Slider Yönetimi", href: "/dashboard/admin/cms/sliders",icon: Layers,          ability: 'manage-settings' },
  { name: "Instagram Akışı", href: "/dashboard/admin/cms/instagram",icon: Camera,          ability: 'manage-settings' },
  { name: "SSS Yönetimi",   href: "/dashboard/admin/cms/faqs",      icon: BookOpen,        ability: 'manage-settings' },
  { name: "Kullanıcılar",   href: "/dashboard/admin/users",          icon: Users,           ability: 'manage-users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    let roles: Role[] = [];
    let name = "Admin";
    try {
      roles = JSON.parse(localStorage.getItem("user_roles") || "[]") as Role[];
      name = localStorage.getItem("user_name") || "Admin";
    } catch (e) {
      console.error("Auth state parse error", e);
    }
    setUser({ roles, name });
  }, []);

  const visibleMenuItems = menuItems.filter(item => hasAbility(user, item.ability));

    return (
    <div className="min-h-screen bg-slate-50 flex relative z-10">
      {/* Sidebar - Premium Corporate Dark */}
      <aside className="w-68 bg-slate-950 border-r border-white/5 flex flex-col sticky top-0 h-screen hidden lg:flex">
        <div className="p-8 mb-4">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-40">
              <Image
                src="/images/logo/logo-orange.svg"
                alt="KADEME Logo"
                fill
                className="object-contain object-left brightness-0 invert"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Yönetim Paneli</span>
          </div>
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href;
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
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-8 w-32">
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

        <div className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
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
