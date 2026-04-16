"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Award, 
  Target, 
  Zap, 
  Star, 
  ShieldAlert, 
  ChevronRight,
  BookOpen,
  Users
} from 'lucide-react';

export default function KademePlusPage() {
  return (
    <div className="flex flex-col w-full bg-white pt-20">
      {/* Premium Hero */}
      <section className="relative py-24 bg-gray-50/50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-white border border-gray-100 text-orange-500 font-bold text-[10px] mb-8 shadow-sm tracking-widest uppercase">
              <Sparkles className="mr-2" size={14} /> MODÜLER EĞİTİM EKOSİSTEMİ
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">KADEME<span className="text-orange-500">+</span></h1>
            <p className="max-w-xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
              Eğitimi oyunlaştırma ile birleştiren, modüler yapıda yeni nesil gelişim platformu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Eğitim Modülleri</h2>
                  <p className="text-gray-400 font-medium text-sm">Her modül yeni bir yetkinlik, her yetkinlik yeni bir rozet.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <ModuleCard title="Stratejik Liderlik" credits="20" icon={Target} />
                <ModuleCard title="Dijital Okuryazarlık" credits="15" icon={Zap} />
                <ModuleCard title="Sosyal İnovasyon" credits="25" icon={Star} />
                <ModuleCard title="Proje Yönetimi" credits="30" icon={BookOpen} />
              </div>
            </div>

            <div className="lg:w-1/3">
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Users size={16} className="text-orange-500" /> Katılımcı Listesi
                  </h2>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">Aktif</span>
                </div>
                <div className="space-y-5">
                  {[
                    { name: "Caner Özkan", university: "Selçuk Üniv.", dept: "Hukuk" },
                    { name: "Merve Koç", university: "Konya Teknik", dept: "Mimarlık" },
                    { name: "Burak Arslan", university: "SÜ", dept: "İktisat" }
                  ].map((student, index) => (
                    <div key={index}>
                      <div className="text-sm font-bold text-gray-900 hover:text-orange-500 transition-colors cursor-default">{student.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{student.university} · {student.dept}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-2.5 text-xs font-bold text-gray-400 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                  Tümünü Gör
                </button>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Table */}

      <section className="py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Kademeli Ödüllendirme</h2>
                <p className="text-gray-500 text-base mb-10 leading-relaxed font-medium">
                  Ulaştığınız her seviyede KADEME partnerlerinden özel indirimler, mentorluk seansları ve staj önceliği kazanın.
                </p>
                <div className="space-y-3">
                  <LevelRow level="LEVEL 1: ROOKIE" threshold="100 Kredi" reward="KADEME Rozeti" />
                  <LevelRow level="LEVEL 5: EXPERT" threshold="500 Kredi" reward="Özel Mentorluk" active />
                  <LevelRow level="MAX LEVEL: LEGEND" threshold="1000 Kredi" reward="Staj Garantisi" />
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center group">
                    <Award size={56} className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Legendary Badge</div>
                 </div>
                 <div className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center group">
                    <Star size={56} className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Social Innovator</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts & Sanctions */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <ShieldAlert className="text-orange-500 mb-6 mx-auto" size={40} />
            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Uyarılar & Yaptırımlar</h3>
            <div className="space-y-4 text-sm text-gray-500 leading-relaxed font-bold">
               <p>• Kabul aldığınız modüle mazeretsiz katılmamanız durumunda 20 kredi kaybı yaşarsınız.</p>
               <p>• Üst üste 3 devamsızlık durumunda modül kaydınız otomatik olarak silinir.</p>
               <p>• Kredisi 75 altına düşenler KADEME+ PLUS ayrıcalıklarından yararlanamaz.</p>
            </div>
            <button className="w-full mt-12 py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 group uppercase tracking-widest text-[10px]">
               OKUDUM, KABUL EDİYORUM
               <ChevronRight className="group-hover:translate-x-1 transition-transform" size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({ title, credits, icon: Icon }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-orange-50 transition-colors">
        <Icon size={28} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h3>
      <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-10">
        {credits} KREDİ YÜKÜ
      </div>
      <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
         <div className="flex -space-x-2">
            {[1, 2].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white"></div>
            ))}
         </div>
         <span className="text-[10px] font-bold text-gray-300 group-hover:text-gray-600 transition-colors uppercase tracking-widest cursor-pointer">İNCELE →</span>
      </div>
    </div>
  );
}

function LevelRow({ level, threshold, reward, active }: any) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${active ? 'bg-orange-50 border-orange-100' : 'border-gray-50 opacity-50'}`}>
       <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-1">{level}</div>
          <div className="font-bold text-gray-900 text-sm">{threshold}</div>
       </div>
       <div className="text-right">
          <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">ÖDÜL</div>
          <div className="font-bold text-gray-700 text-xs italic">{reward}</div>
       </div>
    </div>
  );
}
