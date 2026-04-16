"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Plane, Info, ArrowLeft, Users, CheckCircle2, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function EurodeskPage() {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Header */}
      <div className="py-24 bg-gray-50/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Link href="/projeler" className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-orange-500 mb-8 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} className="mr-2" />
            Tüm Projeler
          </Link>
          <motion.div
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">Eurodesk Bilgi Ağı</h1>
            <p className="text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
              Avrupa fırsatları, eğitim programları ve gençlik değişimleri hakkında ücretsiz bilgilendirme ve rehberlik noktası.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white p-2 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Navigation size={20} className="text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Eurodesk Hakkında</h2>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Eurodesk, gençler için eğitim ve gençlik alanlarındaki Avrupa fırsatları ve gençlerin Avrupa faaliyetlerine katılımı hakkında bilgi sağlayan Avrupa Bilgi Ağı'dır. KADEME, Eurodesk Yerel Temas Noktası olarak hizmet vermektedir.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "ESC (Avrupa Dayanışma Programı)",
                  "Erasmus+ Gençlik Değişimleri",
                  "Yurt Dışı Eğitim Rehberliği",
                  "Gönüllülük Fırsatları"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                    <span className="text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gray-900 p-10 md:p-16 rounded-[3rem] text-white overflow-hidden relative">
               <div className="relative z-10">
                  <Globe className="text-orange-500 mb-6" size={40} />
                  <h2 className="text-3xl font-bold mb-6 tracking-tight">Avrupa Senatosu'na Hazır Mısın?</h2>
                  <p className="text-gray-400 text-base mb-10 leading-relaxed font-bold">
                    Avrupa Birliği projelerine başvuru yapmak ve yurt dışı deneyimi kazanmak için uzman danışmanlarımızdan ücretsiz destek alabilirsiniz.
                  </p>
                  <button className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                    DANIŞMANLIK RANDEVUSU AL
                  </button>
               </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-8">
                <Users size={16} className="text-orange-500" /> Koordinatörler
              </h2>
              <div className="space-y-5">
                {[
                  { name: "Fatma Betül Öztürk", role: "Eurodesk Sorumlusu" },
                  { name: "Sercan Yıldız", role: "Gençlik Bilgilendirme Uzmanı" }
                ].map((person, index) => (
                  <div key={index}>
                    <div className="text-sm font-bold text-gray-900">{person.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">{person.role}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
               <Plane className="text-orange-500 mb-4" size={32} />
               <h3 className="text-sm font-bold text-gray-900 mb-2">Hareketlilik Fırsatları</h3>
               <p className="text-xs text-gray-500 font-medium leading-relaxed">En güncel çağrılar ve başvuru takvimi için KADEME panelini takip edin.</p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
