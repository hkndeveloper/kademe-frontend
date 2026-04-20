"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Rocket, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { logout } from "@/lib/auth-utils";

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
    logout();
  };

  const getDashboardHref = () => {
    if (auth.roles.includes("super-admin") || auth.roles.includes("coordinator")) return "/dashboard/admin";
    if (auth.roles.includes("alumni")) return "/dashboard/alumni";
    return "/dashboard/student";
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? "neuros-glass-light py-4 shadow-xl border-b border-black/5" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className={`relative h-10 w-44 transition-all duration-500 group-hover:scale-105 ${!scrolled ? "brightness-0 invert h-12 w-48" : ""}`}>
              <Image
                src="/images/logo/logo-orange.svg"
                alt="KADEME Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => {
              const hasDropdown = link.isDynamic && projects.length > 0;
              const isActive = pathname === link.href;

              return (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all hover:after:w-full ${
                      isActive ? "text-orange-500 after:w-full" : (!scrolled ? "text-white hover:text-orange-200" : "text-slate-500 hover:text-slate-950")
                    }`}
                  >
                    {link.name}
                    {hasDropdown && <ChevronDown size={14} className="opacity-40 group-hover:rotate-180 transition-transform duration-300" />}
                  </Link>

                  {hasDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-slate-50 p-6 min-w-[320px] overflow-hidden">
                        <div className="px-5 py-3 mb-4 border-b border-slate-50">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Stratejik Programlar</span>
                        </div>
                        <div className="grid gap-2">
                          {projects.slice(0, 5).map((p) => (
                            <Link
                              key={p.id}
                              href={`/projeler/${p.id}`}
                              className="flex items-center gap-4 px-6 py-5 text-[10px] font-black text-slate-500 hover:text-orange-500 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest group/item border border-transparent hover:border-orange-500/10"
                            >
                              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-orange-500 group-hover/item:text-white transition-all">
                                <Rocket size={14} />
                              </div>
                              {p.name}
                            </Link>
                          ))}
                        </div>
                        <Link href="/projeler" className="flex items-center justify-center gap-3 px-5 py-5 mt-4 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-slate-950/20">
                           TÜMÜNÜ KEŞFET <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {auth.token ? (
              <div className={`flex items-center p-2 rounded-full transition-all duration-500 ${scrolled ? "bg-slate-50 border border-slate-100" : "bg-white/10 backdrop-blur-md border border-white/10"}`}>
                <Link href={getDashboardHref()}>
                  <button className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest rounded-full transition-all ${scrolled ? "text-slate-950 hover:bg-white" : "text-white hover:bg-white/10"}`}>
                    PANEL
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="neuros-pill neuros-glow-hover px-8 py-3 text-[9px] font-black bg-slate-950 text-white hover:bg-red-600 transition-all shadow-xl shadow-slate-950/40"
                >
                  GÜVENLİ ÇIKIŞ
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login">
                  <button className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${scrolled ? "text-slate-400 hover:text-slate-950" : "text-white/70 hover:text-white"}`}>
                    GİRİŞ
                  </button>
                </Link>
                <Link href="/basvuru">
                  <button className="neuros-pill neuros-glow-hover bg-orange-500 text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] flex items-center gap-3 text-[10px]">
                    BAŞVURU <Sparkles size={16} className="group-hover:animate-pulse" />
                  </button>
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${scrolled ? "bg-slate-950 text-white" : "bg-white text-slate-950"}`}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-50 px-10 py-12 space-y-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-lg font-black uppercase tracking-widest ${
                   pathname === link.href ? "text-orange-500" : "text-slate-950"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-10 border-t border-slate-100 flex flex-col gap-4">
              {auth.token ? (
                  <Link href={getDashboardHref()} onClick={() => setIsOpen(false)} className="w-full">
                    <button className="w-full py-6 bg-slate-950 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-xl">
                      DASHBOARD
                    </button>
                  </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                    <button className="w-full py-6 border-2 border-slate-950 text-slate-950 text-[10px] font-black rounded-2xl uppercase tracking-widest">
                      GİRİŞ YAP
                    </button>
                  </Link>
                  <Link href="/basvuru" onClick={() => setIsOpen(false)} className="w-full">
                    <button className="w-full py-6 bg-orange-500 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-500/20">
                      HEMEN BAŞVUR
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
