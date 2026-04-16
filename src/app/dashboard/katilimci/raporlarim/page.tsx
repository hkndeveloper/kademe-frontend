"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Lock, 
  Download, 
  Eye, 
  ShieldCheck,
  Search,
  AlertCircle
} from 'lucide-react';

export default function MyReportsPage() {
  const [reports, setReports] = useState([
    { id: 1, name: "Kariyer Envanter Analizi", date: "10 Mart 2026", size: "1.2 MB" },
    { id: 2, name: "Kişilik Testi Sonuçları", date: "05 Mart 2026", size: "850 KB" }
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Raporlarım & Envanterler</h1>
          <p className="text-slate-500 mt-1">KPD (Kariyer Psikolojik Danışmanlık) süreçlerinize ait gizli raporlar.</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-full text-emerald-600 font-bold text-sm">
          <ShieldCheck size={18} />
          <span>KVKK Korumalı Güvenli Alan</span>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-6 rounded-3xl flex items-start space-x-4 mb-10">
        <AlertCircle className="text-amber-500 flex-shrink-0" size={24} />
        <p className="text-amber-800 dark:text-amber-400 text-sm leading-relaxed">
          Bu alandaki raporlar sadece sizin ve danışanınızın (Koordinatör) erişimine açıktır. Raporlarınız bulut tabanlı şifreli sistemde saklanmaktadır.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{report.name}</h3>
            <div className="text-sm text-slate-400 mb-8">{report.date} • {report.size}</div>
            
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Eye size={16} className="mr-2" /> Görüntüle
              </button>
              <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-yellow-500 hover:text-white transition-all">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {/* Empty Slot / Placeholder */}
        <div className="border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center text-slate-300">
          <Lock size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-medium">Yeni raporlar tamamlandığında burada görünecektir.</p>
        </div>
      </div>
    </div>
  );
}
