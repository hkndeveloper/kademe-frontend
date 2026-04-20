"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Clock, 
  Search, 
  User, 
  Mail, 
  Smartphone, 
  FileText,
  AlertCircle,
  ArrowRight,
  Star,
  MapPin,
  Calendar as CalendarIcon,
  Save
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from "sonner";
import Link from 'next/link';

// UI Core Bileşenleri
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatusBadge from '@/components/dashboard/StatusBadge';

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  // Interview Modal State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [interviewData, setInterviewData] = useState({ date: '', location: '', status: 'invited' });

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch (err) {
      toast.error('Gelen başvurular yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      toast.success(`Başvuru durumu ${status.toUpperCase()} olarak güncellendi.`);
      fetchApplications();
    } catch (err) {
      toast.error('İşlem başarısız oldu.');
    }
  };

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/applications/${selectedApp.id}/interview`, {
        interview_date: interviewData.date,
        interview_location: interviewData.location,
        interview_status: interviewData.status
      });
      toast.success("Mülakat daveti gönderildi!");
      setShowInterviewModal(false);
      fetchApplications();
    } catch (err) {
      toast.error("Mülakat bilgileri güncellenemedi.");
    }
  };

  const filteredApps = applications.filter((app: any) => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
                          app.project?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl pb-20">
      <PageHeader 
        title="Gelen Başvurular"
        description="Program ve eğitim başvurularını değerlendirin, mülakat süreçlerini yönetin."
        icon={<User />}
      />

      {/* Filtre ve Arama */}
      <DashboardCard className="p-6 mb-10 !rounded-[2.5rem]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Aday veya proje ismi ile ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-gray-300"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] text-xs font-black text-gray-600 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all cursor-pointer uppercase tracking-widest"
          >
            <option value="all">Tüm Başvurular</option>
            <option value="pending">Bekleyenler</option>
            <option value="interviewed">Mülakat Aşamasındakiler</option>
            <option value="accepted">Kabul Edilenler</option>
            <option value="rejected">Reddedilenler</option>
            <option value="waitlisted">Yedek Listedekiler</option>
          </select>
        </div>
      </DashboardCard>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-gray-300 font-black text-xs uppercase tracking-widest italic">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredApps.map((app: any) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative"
              >
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 w-2 h-full ${
                    app.status === 'accepted' ? 'bg-emerald-500' : 
                    app.status === 'rejected' ? 'bg-red-500' : 
                    app.status === 'interviewed' ? 'bg-orange-500' : 'bg-slate-200'
                }`} />

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                  {/* Katılımcı Ana Bilgisi */}
                  <div className="flex items-center gap-8 flex-1">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 border border-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm shrink-0">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-950 tracking-tighter mb-2 uppercase italic">{app.user?.name || app.name}</h3>
                      <div className="flex flex-wrap gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">
                        <span className="flex items-center gap-2"><Mail size={14} className="text-slate-300"/> {app.user?.email || app.email}</span>
                        <span className="flex items-center gap-2"><Smartphone size={14} className="text-slate-300"/> {app.user?.participant_profile?.phone || app.phone || 'Telefon Yok'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-10">
                    {/* Proje & Durum */}
                    <div className="flex flex-col items-start min-w-[150px]">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Program</span>
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">{app.project?.name}</span>
                    </div>

                    <div className="flex flex-col items-start min-w-[120px]">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Durum</span>
                      <StatusBadge status={app.status || 'pending'} />
                    </div>

                    {/* Mülakat Bilgisi (Varsa) */}
                    {app.interview_date && (
                        <div className="flex flex-col items-start min-w-[160px] p-4 bg-orange-50 rounded-2xl border border-orange-100">
                           <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1 italic">Mülakat Randevusu</span>
                           <span className="text-[11px] font-bold text-orange-950 uppercase">{new Date(app.interview_date).toLocaleString('tr-TR')}</span>
                        </div>
                    )}

                    {/* Aksiyonlar */}
                    <div className="flex items-center gap-2">
                       {app.status === 'pending' && (
                          <>
                             <button 
                               onClick={() => { setSelectedApp(app); setShowInterviewModal(true); }}
                               className="p-5 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                               title="Mülakat Planla"
                             >
                               <Star size={22} />
                             </button>
                             <button 
                               onClick={() => handleStatusUpdate(app.id, 'rejected')}
                               className="p-5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                               title="Reddet"
                             >
                               <X size={22} />
                             </button>
                          </>
                       )}

                       {app.status === 'interviewed' && (
                          <>
                             <button 
                               onClick={() => handleStatusUpdate(app.id, 'accepted')}
                               className="px-6 py-5 bg-emerald-50 text-emerald-600 rounded-[1.5rem] hover:bg-emerald-600 hover:text-white transition-all font-black text-xs uppercase italic tracking-widest flex items-center gap-2 shadow-sm"
                             >
                               <Check size={18} /> ASİL LİSTE
                             </button>
                             <button 
                               onClick={() => handleStatusUpdate(app.id, 'waitlisted')}
                               className="px-6 py-5 bg-orange-50 text-orange-600 rounded-[1.5rem] hover:bg-orange-600 hover:text-white transition-all font-black text-xs uppercase italic tracking-widest flex items-center gap-2 shadow-sm"
                             >
                               <Clock size={16} /> YEDEK
                             </button>
                             <button 
                               onClick={() => handleStatusUpdate(app.id, 'rejected')}
                               className="p-5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                             >
                               <X size={22} />
                             </button>
                          </>
                       )}

                       {(app.status === 'accepted' || app.status === 'rejected' || app.status === 'waitlisted') && (
                          <button 
                             onClick={() => handleStatusUpdate(app.id, 'pending')}
                             className="px-8 py-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all font-black text-xs uppercase tracking-widest italic"
                          >
                             Yeniden Değerlendir
                          </button>
                       )}
                    </div>
                  </div>
                </div>

                {/* Motivasyon Mektubu Özeti */}
                {app.motivation_letter && (
                  <div className="mt-10 pt-10 border-t border-slate-50">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                         <FileText size={18} className="text-slate-400" />
                      </div>
                      <p className="text-[13px] font-medium leading-relaxed italic text-slate-500">"{app.motivation_letter}"</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredApps.length === 0 && (
            <DashboardCard className="text-center py-32 border-dashed border-2 bg-slate-50/50">
              <AlertCircle size={64} className="mx-auto text-slate-200 mb-8" />
              <p className="text-slate-400 font-black text-sm uppercase tracking-[0.3em] italic">Eşleşen başvuru bulunamadı.</p>
            </DashboardCard>
          )}
        </div>
      )}

      {/* Interview Modal */}
      <AnimatePresence>
        {showInterviewModal && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInterviewModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl overflow-hidden"
             >
                <div className="mb-12">
                   <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4 block animate-pulse italic">Aşama 2: Mülakat Daveti</span>
                   <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">
                      {selectedApp.user?.name} İçin <br /><span className="text-slate-300 underline decoration-slate-100 decoration-8 underline-offset-8">Randevu Oluştur</span>
                   </h2>
                </div>

                <form onSubmit={handleInterviewSubmit} className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                         <CalendarIcon size={14} /> Mülakat Tarihi & Saati
                      </label>
                      <input 
                        type="datetime-local" required
                        value={interviewData.date}
                        onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm font-black outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                         <MapPin size={14} /> Mülakat Lokasyonu / Platformu
                      </label>
                      <input 
                        type="text" required
                        placeholder="Örn: Zoom Linki veya KADEME Ofis"
                        value={interviewData.location}
                        onChange={(e) => setInterviewData({...interviewData, location: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                      />
                   </div>

                   <div className="flex gap-4 pt-8">
                      <button type="submit" className="flex-1 py-6 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                         <Save size={20} /> DAVET GÖNDER
                      </button>
                      <button type="button" onClick={() => setShowInterviewModal(false)} className="px-10 py-6 bg-slate-100 text-slate-500 font-bold rounded-[2rem] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
                         VAZGEÇ
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
