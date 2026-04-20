"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Rocket, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";

const navLinks = [
  { name: "Anasayfa", href: "/" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  {
    name: "Projeler",
    href: "/projeler",
    isDynamic: true
  },
  { name: "Faaliyetler", href: "/faaliyetler" },
  { name: "SSS", href: "/sss" },
  { name: "İletişim", href: "/iletisim" },
];

function readAuth() {
  if (typeof window === "undefined") {
    return { token: null as string | null, roles: [] as string[] };
  }

  const token = localStorage.getItem("kademe_token");
  const roles = JSON.parse(localStorage.getItem("user_roles") || "[]") as string[];
  return { token, roles };
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [authVersion, setAuthVersion] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleStorage = () => setAuthVersion((value) => value + 1);

    // Dinamik projeleri çek
    api.get('/public-home')
      .then((res: any) => {
          // Public home endpointinden veya direkt projects'ten aktif olanları alabiliriz
          setProjects(res.data.pinned_projects || []);
      })
      .catch((err: any) => console.error("Projeler yuklenemedi:", err));

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", handleStorage);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const auth = mounted ? readAuth() : { token: null, roles: [] };

  const handleLogout = () => {
    localStorage.removeItem("kademe_token");
    localStorage.removeItem("user_roles");
    localStorage.removeItem("user_name");
    setAuthVersion((value) => value + 1);
    router.push("/");
  };

  const getDashboardHref = () => {
    if (auth.roles.includes("super-admin") || auth.roles.includes("coordinator")) return "/dashboard/admin";
    if (auth.roles.includes("alumni")) return "/dashboard/alumni";
    return "/dashboard/student";
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-900/5 py-4" : "bg-white py-6"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-44 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo/logo-orange.svg"
                alt="KADEME Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const hasDropdown = link.isDynamic && projects.length > 0;
              const isActive = pathname === link.href;

              return (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                      isActive ? "text-orange-500" : "text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {link.name}
                    {hasDropdown && <ChevronDown size={14} className="opacity-40 group-hover:rotate-180 transition-transform duration-300" />}
                  </Link>

                  {hasDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100">
                      <div className="bg-white rounded-[2rem] shadow-3xl border border-slate-50 p-4 min-w-[300px]">
                        <div className="px-5 py-3 mb-2 border-b border-slate-50">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Aktif Programlar</span>
                        </div>
                        {projects.slice(0, 5).map((p) => (
                          <Link
                            key={p.id}
                            href={`/projeler/${p.id}`}
                            className="flex items-center gap-4 px-5 py-4 text-[10px] font-black text-slate-500 hover:text-orange-500 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest group/item"
                          >
                            <Rocket size={14} className="text-slate-200 group-hover/item:text-orange-500 transition-colors" />
                            {p.name}
                          </Link>
                        ))}
                        <Link href="/projeler" className="flex items-center justify-center gap-2 px-5 py-4 mt-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 transition-all">
                           TÜMÜNÜ GÖR <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {auth.token ? (
              <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl">
                <Link href={getDashboardHref()}>
                  <button className="px-6 py-2.5 text-[10px] font-black text-slate-950 uppercase tracking-widest hover:bg-white rounded-xl transition-all shadow-sm">
                    KULLANICI PANELİ
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 text-[10px] font-black bg-slate-950 text-white rounded-xl hover:bg-red-600 transition-all shadow-xl shadow-slate-950/20 uppercase tracking-widest"
                >
                  ÇIKIŞ
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <button className="px-8 py-3 text-[10px] font-black text-slate-400 hover:text-slate-950 transition-colors uppercase tracking-widest">
                    Giriş
                  </button>
                </Link>
                <Link href="/basvuru">
                  <button className="px-8 py-3.5 text-[10px] font-black bg-orange-500 text-white rounded-2xl hover:bg-slate-950 transition-all shadow-xl shadow-orange-500/20 uppercase tracking-widest group flex items-center gap-2">
                    BAŞVURU YAP <Sparkles size={14} className="group-hover:animate-spin" />
                  </button>
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden w-12 h-12 bg-slate-50 text-slate-950 rounded-2xl flex items-center justify-center shadow-sm">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-50 px-8 py-10 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-4 text-sm font-black uppercase tracking-widest ${
                   pathname === link.href ? "text-orange-500" : "text-slate-950"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-8 border-t border-slate-100 mt-8 flex flex-col gap-4">
              {auth.token ? (
                  <Link href={getDashboardHref()} onClick={() => setIsOpen(false)} className="w-full">
                    <button className="w-full py-5 bg-slate-950 text-white text-xs font-black rounded-2xl uppercase tracking-widest">
                      PANELİM
                    </button>
                  </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <button className="w-full py-5 bg-slate-950 text-white text-xs font-black rounded-2xl uppercase tracking-widest">
                    GİRİŞ YAP
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
