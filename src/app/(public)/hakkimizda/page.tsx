"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Target, Users, Award, Heart, ArrowRight, MessageCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import api from "@/lib/api";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({
    mission: "Katılımcılarımızın her faaliyetten somut yetkinlikler kazanarak ayrılmasını hedefliyoruz. Gönüllülük bilincini, akademik derinlik ve saha deneyimiyle birleştirerek 'teoriden pratiğe' sarsılmaz bir köprü kuruyoruz.",
    vision: "Vizyonumuz, Türkiye'nin en kapsamlı sivil toplum yönetim ağını kurarak, her gencin gelişimine dijital ve fiziksel altyapılarla sınırsız destek sunmaktır. Şeffaf, ölçülebilir ve etki odaklı projelerle geleceği şekillendiriyoruz."
  });

  useEffect(() => {
    api.get("/public-home")
      .then(res => {
        if (res.data.settings) {
          setSettings({
            mission: res.data.settings.mission || settings.mission,
            vision: res.data.settings.vision || settings.vision
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 font-black text-slate-300 uppercase tracking-widest animate-pulse italic">Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col w-full bg-white pt-20 font-sans">
      {/* Hero Section - Premium Visual */}
      <section className="py-32 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80" 
            className="w-full h-full object-cover opacity-30 grayscale blur-sm" 
            alt="About Hero" 
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6 block">KADEME Ekosistemi</span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase">Yarının Dünyasını <br />Bugünden <span className="text-orange-500">Tasarlıyoruz.</span></h1>
            <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
              KADEME, sadece bir eğitim platformu değil, gençlerin potansiyellerini keşfettiği, dijital ve diplomatik yetkinlikler kazandığı modern bir okul, dev bir ailedir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision - Dynamic Content from Admin */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-16 rounded-[4rem] bg-slate-50 border border-slate-100 flex flex-col justify-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 text-slate-900 group-hover:rotate-12 transition-transform duration-700">
                 <Target size={120} />
              </div>
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-slate-200/50">
                <Target className="text-orange-500" size={40} />
              </div>
              <h2 className="text-4xl font-black mb-8 text-slate-900 tracking-tighter uppercase leading-[0.9]">İstikbalimiz: <br /><span className="text-orange-500">Vizyonumuz</span></h2>
              <p className="text-slate-500 leading-relaxed text-lg font-medium italic">
                {settings.vision}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-16 rounded-[4rem] bg-slate-900 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-slate-950/20 group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 text-white group-hover:-rotate-12 transition-transform duration-700">
                 <Shield size={120} />
              </div>
              <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-orange-500/20">
                <Shield className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.9]">Özümüz: <br /><span className="text-orange-500">Misyonumuz</span></h2>
              <p className="text-slate-400 leading-relaxed text-lg font-medium italic">
                {settings.mission}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values - Premium Grid */}
      <section className="py-40 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4 block">Temel İlkeler</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">Bizi Biz Yapan <br /><span className="text-slate-300 font-black">Değerlerimiz</span></h2>
            </div>
            <p className="text-slate-400 text-sm font-medium max-w-xs italic">KADEME ekosisteminin temellerini oluşturan ve her adımda rehberlik eden prensiplerimiz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ValueCard icon={Users} title="Radikal Şeffaflık" desc="Yönetim süreçlerimizden kredi sistemimize kadar her aşamada tam şeffaflık ilkesiyle hareket ediyoruz." />
            <ValueCard icon={Award} title="Operasyonel Mükemmellik" desc="Eğitim kalitemizden teknolojik altyapımıza kadar dünya standartlarını KADEME çatısı altına getiriyoruz." />
            <ValueCard icon={Heart} title="Toplumsal Fayda" desc="Yaptığımız her projede 'gönüllülük' ve 'fayda' ekseninden sapmadan toplum için değer üretiyoruz." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center bg-slate-950 rounded-[4rem] p-16 md:p-32 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10">
                <div className="w-20 h-20 bg-orange-500 rounded-3xl mx-auto flex items-center justify-center mb-10 shadow-xl shadow-orange-500/20">
                   <MessageCircle className="text-white" size={32} />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-12 leading-[0.95] uppercase">Geleceğin <span className="text-orange-500">Parçası</span><br />Olmak İster misin?</h2>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link href="/basvuru">
                    <button className="px-12 py-5 bg-orange-500 text-white font-black text-[12px] rounded-2xl hover:bg-white hover:text-orange-500 transition-all shadow-xl shadow-orange-500/20 uppercase tracking-[0.2em] flex items-center gap-3 group">
                       ŞİMDİ BAŞVUR <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/iletisim">
                    <button className="px-12 py-5 bg-white/5 text-white font-black text-[12px] rounded-2xl hover:bg-white/10 transition-all border border-white/10 uppercase tracking-[0.2em] backdrop-blur-md">
                       BİZE ULAŞIN
                    </button>
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/5 hover:border-orange-500/20 transition-all duration-500 group">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight uppercase leading-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-medium italic">{desc}</p>
    </div>
  );
}
