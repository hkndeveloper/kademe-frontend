"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";

const navLinks = [
  { name: "Anasayfa", href: "/" },
  { name: "Hakkimizda", href: "/hakkimizda" },
  {
    name: "Faaliyetler",
    href: "/projeler",
    submenu: [
      { name: "Pergel Fellowship", href: "/projeler/pergel" },
      { name: "Kariyer Psikolojik Danismanlik", href: "/projeler/kpd" },
      { name: "KADEME+", href: "/projeler/kademe-plus" },
      { name: "Eurodesk", href: "/projeler/eurodesk" },
    ],
  },
  { name: "SSS", href: "/sss" },
  { name: "Iletisim", href: "/iletisim" },
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
  const [, setAuthVersion] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleStorage = () => setAuthVersion((value) => value + 1);

    // Dinamik projeleri çek
    api.get('/projects')
      .then((res: any) => setProjects(res.data.filter((p: any) => p.is_active)))
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-44">
              <Image
                src="/images/logo/logo-orange.svg"
                alt="KADEME Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isFaaliyetler = link.name === "Faaliyetler";
              const currentSubmenu = isFaaliyetler 
                ? projects.map(p => ({ name: p.name, href: `/projeler/${p.id}` }))
                : link.submenu;

              return (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      pathname === link.href ? "text-slate-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                    {currentSubmenu && currentSubmenu.length > 0 && <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-200" />}
                  </Link>

                  {currentSubmenu && currentSubmenu.length > 0 && (
                    <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[240px]">
                        {currentSubmenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-slate-900 hover:bg-gray-50 rounded-xl transition-all"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {auth.token ? (
              <>
                <Link href={getDashboardHref()}>
                  <button className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-slate-900 transition-colors">
                    Panelim
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-black transition-colors shadow-sm"
                >
                  Cikis Yap
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                    Giris Yap
                  </button>
                </Link>
                <Link href="/basvuru">
                  <button className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-black transition-colors shadow-sm">
                    Basvuru Yap
                  </button>
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gray-600 hover:text-gray-900">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2.5 text-sm font-medium text-gray-700 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              {auth.token ? (
                <div className="flex flex-col gap-2">
                  <Link href={getDashboardHref()} onClick={() => setIsOpen(false)}>
                    <button className="w-full py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg">
                      Panelim
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg"
                  >
                    Cikis Yap
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg">
                    Giris Yap
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


