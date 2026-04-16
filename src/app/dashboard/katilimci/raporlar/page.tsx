"use client";

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Download, 
  Lock, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  Eye,
  ArrowRight
} from 'lucide-react';
import api from '@/lib/api';

export default function KpdReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/student/reports');
        setReports(res.data);
      } catch (err) {
        console.error('Raporlar çekilemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const downloadReport = (id: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/student/reports/${id}/download`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 underline decoration-yellow-500 underline-offset-8">KPD Raporlarım</h1>
        <p className="text-slate-500 font-medium mt-4">Kariyer Planlama ve Danışmanlık seanslarınıza ait gizli uzman raporları.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden mb-12">
         {/* KVKK / Security Header */}
         <div className="bg-slate-900 p-6 flex items-center space-x-3 text-white">
            <Lock size={20} className="text-yellow-500" />
            <span className="text-xs font-black uppercase tracking-widest opacity-80">GÜVENLİ VE ŞİFRELİ ERİŞİM</span>
         </div>

         <div className="p-8 md:p-12">
          {loading ? (
            <div className="space-y-6">
              {[1,2].map(i => <div key={i} className="h-24 shimmer rounded-3xl"></div>)}
            </div>
          ) : reports.length > 0 ? (

              <div className="space-y-6">
                {reports.map((report: any) => (
                  <div 
                    key={report.id}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                       <FileText size={32} />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{report.title}</h3>
                       <div className="flex items-center space-x-4 text-xs text-slate-400 justify-center md:justify-start">
                          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(report.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center underline">PDF Belgesi</span>
                       </div>
                    </div>

                    <div className="flex items-center space-x-2">
                       <button 
                         onClick={() => downloadReport(report.id)}
                         className="p-4 bg-slate-900 text-white rounded-2xl flex items-center space-x-2 hover:bg-yellow-600 transition-all font-bold"
                       >
                          <Download size={20} />
                          <span>İndir</span>
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem]">
                 <ShieldCheck size={48} className="text-slate-200 mb-4" />
                 <p className="text-slate-400 font-bold">Henüz düzenlenmiş bir raporunuz bulunmuyor.</p>
                 <p className="text-xs text-slate-400 mt-2">KPD seanslarınız tamamlandığında raporlarınız uzmanlar tarafından buraya yüklenir.</p>
              </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-800">
           <AlertCircle className="text-amber-600 mb-4" size={24} />
           <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2">Gizlilik Politikası</h4>
           <p className="text-xs text-amber-800/70 dark:text-amber-400 font-medium leading-relaxed">Bu raporlar KVKK kapsamında özel nitelikli kişisel veri sayılmaktadır. Sadece siz ve yetkili akademik danışmanınız tarafından görüntülenebilir. Üçüncü şahıslarla paylaşılmamaktadır.</p>
        </div>
        <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 flex flex-col justify-between">
           <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Yeni Süreç</h4>
              <p className="text-xs text-blue-800/70 dark:text-blue-400 font-medium mb-4">Yeni bir KPD seansı veya kariyer danışmanlığı randevusu almak ister misiniz?</p>
           </div>
           <button className="flex items-center text-sm font-black text-blue-600 hover:text-blue-700">
              RANDEVU SİSTEMİNE GİT <ArrowRight size={16} className="ml-1" />
           </button>
        </div>
      </div>
    </div>
  );
}
