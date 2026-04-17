"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Info, ArrowLeft, CheckCircle2, Globe } from 'lucide-react';
import Link from 'next/link';

const schedule = [
  { month: "Ocak", activity: "Dış Politika Temelleri Eğitimi" },
  { month: "Şubat", activity: "Uluslararası İlişkiler Simülasyonu" },
  { month: "Mart", activity: "Diplomatik İletişim Atölyesi" },
  { month: "Nisan", activity: "Model BM Konferansı" },
  { month: "Mayıs", activity: "Sertifika Töreni" },
];

const students = [
  { name: "Elif Demir", university: "Galatasaray Üniversitesi", department: "Uluslararası İlişkiler", year: "3. Sınıf" },
  { name: "Can Yılmaz", university: "Ankara Üniversitesi", department: "Siyaşet Bilimi", year: "4. Sınıf" },
  { name: "Zeynep Kaya", university: "İstanbul Üniversitesi", department: "Hukuk", year: "2. Sınıf" },
];

export default function Diplomasi360Page() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">Diplomasi360</h1>
            <p className="text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
              Geleceğin diplomatlarını ve uluslararası ilişkiler uzmanlarını yetiştiren kapsamlı bir eğitim ve simülasyon programı.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section className="bg-white p-2 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Info size={20} className="text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Proje Hakkında</h2>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Diplomasi360, uluslararası ilişkiler ve diplomasi alanında kariyer yapmak isteyen üniversite öğrencilerine yönelik kapsamlı bir eğitim programıdır. Program, teorik bilgi ile pratik simülasyonları bir araya getirerek katılımcılara gerçek dünya deneyimi sunar.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Dış Politika Analizi",
                  "Diplomatik İletişim Teknikleri",
                  "Model BM Simülasyonları",
                  "Uluslararası Hukuk Temelleri"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                    <span className="text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section className="bg-white p-2">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                   <Calendar size={20} className="text-gray-400" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">Program Akışı & Takvim</h2>
              </div>
              <div className="space-y-6 relative ml-4">
                <div className="absolute left-[3px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {schedule.map((item, index) => (
                  <div key={index} className="flex gap-8 relative">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 ring-4 ring-white relative z-10 shadow-sm"></div>
                    <div>
                      <div className="font-bold text-xs text-orange-600 uppercase tracking-widest mb-1">{item.month}</div>
                      <div className="text-sm font-semibold text-gray-800">{item.activity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Students List */}
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Users size={16} className="text-orange-500" /> Katılımcılar
                </h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">Asil Liste</span>
              </div>
              <div className="space-y-5">
                {students.map((student, index) => (
                  <div key={index} className="group cursor-default">
                    <div className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{student.name}</div>
                    <div className="text-[11px] text-gray-500 mt-1 font-medium">{student.university}</div>
                    <div className="text-[10px] text-gray-400">{student.department} • {student.year}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2.5 text-xs font-bold text-gray-400 border border-gray-100 rounded-xl hover:bg-gray-50 hover:text-gray-600 transition-all">
                Tümünü Gör
              </button>
            </section>

            {/* Quick Actions */}
            <section className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-3 tracking-tight">Başvuru Süreci</h3>
                <p className="text-gray-400 text-xs mb-8 leading-relaxed font-medium">
                  Yeni dönem başvuruları yakında açılacaktır. Haberdar olmak için bültene abone olun.
                </p>
                <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
                  Haberdar Et
                </button>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
