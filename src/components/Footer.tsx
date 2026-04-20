"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Send, Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Smartphone } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";

export default function Footer() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.get("/public-home")
      .then((res) => setProjects(res.data.pinned_projects || []))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-slate-950 pt-32 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-10">
              <div className="relative h-12 w-48">
                <Image
                  src="/images/logo/logo-orange.svg"
                  alt="KADEME Logo"
                  fill
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic mb-10 pr-4">
              Gençliğin vizyoner gelişim ekosistemi. Diplomasi, teknoloji ve toplumsal fayda odaklı yeni nesil akademi.
            </p>
            <div className="flex gap-4">
               <SocialIcon icon={<Instagram size={18} />} href="https://instagram.com/kademe_online" />
               <SocialIcon icon={<Twitter size={18} />} href="#" />
               <SocialIcon icon={<Youtube size={18} />} href="#" />
            </div>
          </div>

          {/* Practical Links */}
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
               <span className="w-6 h-px bg-orange-500"></span> KURUMSAL
            </h4>
            <ul className="space-y-5">
              {[
                { name: "Hakkımızda", href: "/hakkimizda" },
                { name: "Projelerimiz", href: "/projeler" },
                { name: "Faaliyet Takvimi", href: "/faaliyetler" },
                { name: "Sıkça Sorulan Sorular", href: "/sss" },
                { name: "Bize Ulaşın", href: "/iletisim" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm font-bold text-slate-500 hover:text-orange-500 hover:translate-x-2 transition-all inline-block uppercase tracking-widest">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Projects */}
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
               <span className="w-6 h-px bg-orange-500"></span> AKTİF PROGRAMLAR
            </h4>
            <ul className="space-y-5">
              {projects.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link href={`/projeler/${item.id}`} className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase tracking-tighter truncate block">{item.name}</Link>
                </li>
              ))}
              {projects.length === 0 && <li className="text-xs text-slate-700 italic font-black uppercase">Veri Yükleniyor...</li>}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
               <span className="w-6 h-px bg-orange-500"></span> E-BÜLTEN
            </h4>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 leading-relaxed italic">Gelişmelerden ve başvuru tarihlerinden ilk siz haberdar olun.</p>
            
            <form className="relative group mb-10">
               <input 
                 type="email" 
                 placeholder="E-POSTA ADRESİNİZ" 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[10px] font-black text-white outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-700"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-orange-500 text-white rounded-xl hover:bg-white hover:text-orange-500 transition-all shadow-xl shadow-orange-500/20">
                  <Send size={16} />
               </button>
            </form>

            <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-slate-500">
                   <Smartphone size={16} className="text-orange-500/40" />
                   <span className="text-[11px] font-black uppercase tracking-widest">0 (332) 221 XX XX</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                   <Mail size={16} className="text-orange-500/40" />
                   <span className="text-[11px] font-black uppercase tracking-widest lowercase">info@kademe.org.tr</span>
                </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">© 2026 KADEME EKOSİSTEMİ. TÜM HAKLARI SAKLIDIR.</p>
              <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest italic">Konya Büyükşehir Belediyesi Gençlik ve Spor Hizmetleri Dairesi Başkanlığı İştirakidir.</p>
           </div>
           <div className="flex items-center gap-10">
              <Link href="#" className="text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-widest">KVKK AYDINLATMA</Link>
              <Link href="#" className="text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-widest">ÇEREZ POLİTİKASI</Link>
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center grayscale opacity-50">
                 <Image src="/images/logo/icon-only.png" alt="KADEME" width={20} height={20} />
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href} target="_blank" rel="noreferrer"
      className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-slate-900/40 group"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
    </a>
  );
}
