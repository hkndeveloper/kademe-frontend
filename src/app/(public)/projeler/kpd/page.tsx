"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Users,
  Video,
  Info,
  ChevronRight
} from 'lucide-react';

export default function KPDDetailPage() {
  return (
    <div className="flex flex-col w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gray-50/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-8 shadow-sm">
              PROJE: KARİYER PSİKOLOJİK DANIŞMANLIK
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Geleceğinizi <br /> Profesyonelce Tasarlayın</h1>
            <p className="max-w-2xl text-lg text-gray-500 leading-relaxed font-medium">
              KPD, katılımcıların kariyer yolculuklarında kendilerini tanımalarını sağlayan, test ve seans bazlı özel bir danışmanlık programıdır.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Materials & Forms */}
      <section className="py-24 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Materyal Dosyaları</h2>
              <p className="text-gray-500 text-base mb-10 leading-relaxed font-medium">
                Seanslar öncesinde doldurmanız gereken envanterler ve süreç takibi için kullanılan test formlarına buradan ulaşabilirsiniz.
              </p>
              <div className="space-y-3 mb-12">
                <MaterialItem title="Kariyer İlgi Envanteri" size="450 KB" />
                <MaterialItem title="Yetkinlik Değerlendirme Formu" size="320 KB" />
                <MaterialItem title="Akademik Hedef Takip Çizelgesi" size="1.1 MB" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-square bg-gray-50 rounded-3xl p-8 flex flex-col justify-center border border-gray-100 shadow-sm">
                  <FileText className="text-orange-500 mb-5" size={40} />
                  <h3 className="font-bold text-gray-900 text-sm italic">Standart Formlar</h3>
                  <p className="text-xs text-gray-400 mt-2">Dönemlik güncellenir.</p>
                </div>
                <div className="aspect-square bg-white rounded-3xl p-8 flex flex-col justify-center border border-gray-100 shadow-sm">
                  <ShieldCheck className="text-green-500 mb-5" size={40} />
                  <h3 className="font-bold text-gray-900 text-sm">KVKK Güvencesi</h3>
                  <p className="text-xs text-gray-400 mt-2 font-bold">Gizli veri koruması.</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Users size={16} className="text-orange-500" /> Danışan Listesi
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">Aktif Dönem</span>
                </div>
                <div className="space-y-5">
                  {[
                    { name: "Selin Yılmaz", status: "Seans Aşamasında" },
                    { name: "Mert Demir", status: "Envanter Aşamasında" },
                    { name: "Ayşe Ak", status: "Tamamlandı" }
                  ].map((user, idx) => (
                    <div key={idx}>
                      <div className="text-sm font-bold text-gray-900">{user.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{user.status}</div>
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


      {/* Session Schedule */}
      <section className="py-24 bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Oturum Takip Çizelgesi</h2>
              <p className="text-gray-500 font-medium">Danışmanlık odalarımızın haftalık doluluk ve seans takvimi.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RoomSchedule name="Danışmanlık Odası 1" active={true} />
              <RoomSchedule name="Danışmanlık Odası 2" active={false} />
           </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100 text-center relative overflow-hidden shadow-sm">
             <Info className="mx-auto text-orange-500 mb-6" size={40} />
             <h2 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Seansınız İçin Hazır Mısınız?</h2>
             <p className="text-gray-500 mb-10 max-w-md mx-auto text-sm font-medium leading-relaxed">Hemen dijital panelinizden randevu talep edebilir ve kariyer yolculuğunuzu başlatabilirsiniz.</p>
             <button className="px-10 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                RANDEVU SİSTEMİNE GİT
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MaterialItem({ title, size }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-orange-200 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
          <Download size={18} />
        </div>
        <div className="font-bold text-gray-800 text-sm">{title}</div>
      </div>
      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{size}</div>
    </div>
  );
}

function RoomSchedule({ name, active }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
       <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">{name}</h3>
          <span className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest ${active ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
             {active ? 'AKTİF SEANS' : 'UYGUN'}
          </span>
       </div>
       <div className="space-y-3">
          <ScheduleRow time="10:00 - 10:45" label="Seans Dolu" filled />
          <ScheduleRow time="11:00 - 11:45" label="Uygun" />
          <ScheduleRow time="14:00 - 14:45" label="Rezervasyon" filled />
          <ScheduleRow time="15:00 - 15:45" label="Uygun" />
       </div>
    </div>
  );
}

function ScheduleRow({ time, label, filled }: any) {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
       <span className="text-[10px] font-bold text-gray-400 tracking-wider flex items-center gap-2"><Clock size={12} /> {time}</span>
       <span className={`text-[10px] font-bold uppercase tracking-widest ${filled ? 'text-gray-300' : 'text-orange-500'}`}>{label}</span>
    </div>
  );
}
