"use client";

import React from "react";
import Link from "next/link";
import { Send, Camera, Share2, Video } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative h-14 w-52">
                <Image
                  src="/images/logo/logo-orange.svg"
                  alt="KADEME Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Gençlerin potansiyelini açığa çıkaran kurumsal eğitim ve gelişim ekosistemi.
            </p>
            <div className="flex gap-3">
              <SocialBtn href="#" icon={<Camera size={16} />} />
              <SocialBtn href="#" icon={<Share2 size={16} />} />
              <SocialBtn href="#" icon={<Video size={16} />} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Kurumsal</h4>
            <ul className="space-y-3">
              {[
                { name: "Hakkımızda", href: "/hakkimizda" },
                { name: "Faaliyetler", href: "/projeler" },
                { name: "Haberler", href: "#" },
                { name: "İletişim", href: "/iletisim" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Projeler</h4>
            <ul className="space-y-3">
              {[
                { name: "Pergel Fellowship", href: "/projeler/pergel" },
                { name: "KPD", href: "/projeler/kpd" },
                { name: "KADEME+", href: "/projeler/kademe-plus" },
                { name: "Eurodesk", href: "/projeler/eurodesk" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">E-Bülten</h4>
            <p className="text-sm text-gray-500 mb-4">Duyurulardan haberdar olmak için abone olun.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">KVKK kapsamında korunur.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2024 KADEME. Konya Büyükşehir Belediyesi iştirakidir.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors"
    >
      {icon}
    </a>
  );
}
