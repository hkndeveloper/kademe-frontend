"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Clock, 
  Search, 
  Filter, 
  User, 
  Mail, 
  Smartphone, 
  FileText,
  AlertCircle,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Başvurular çekilemedi:', err);
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
      fetchApplications();
    } catch (err) {
      alert('Hata: Durum güncellenemedi.');
    }
  };

  const filteredApps = applications.filter((app: any) => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.user.name.toLowerCase().includes(search.toLowerCase()) || 
                          app.project.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
           <div className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-2">Başvuru Havuzu</div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gelen Başvurular</h1>
           <p className="text-gray-400 font-medium mt-1 text-sm">Program ve eğitim başvurularını değerlendirin, süreci yönetin.</p>
        </div>
      </div>

      {/* Filtre ve Arama */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Aday veya proje ismi ile ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all cursor-pointer"
          >
            <option value="all">Tüm Başvurular</option>
            <option value="pending">Sadece Bekleyenler</option>
            <option value="accepted">Kabul Edilenler</option>
            <option value="rejected">Reddedilenler</option>
            <option value="waitlisted">Yedek Listedekiler</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-gray-400 font-medium italic">Başvurular yükleniyor...</div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredApps.map((app: any) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:border-orange-100 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  {/* Katılımcı Bilgisi */}
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-white group-hover:border-orange-100 transition-all">
                      <User size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">{app.user.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-300"/> {app.user.email}</span>
                        <span className="flex items-center gap-1.5"><Smartphone size={12} className="text-gray-300"/> {app.user.participant_profile?.phone || 'Telefon Yok'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Proje Bilgisi */}
                  <div className="flex flex-col items-start lg:items-center min-w-[150px]">
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1.5 px-1">Program</span>
                    <span className="px-5 py-2 bg-orange-500 text-white rounded-xl font-bold text-[10px] tracking-widest uppercase">
                      {app.project.name}
                    </span>
                  </div>

                  {/* Durum Badge */}
                  <div className="flex flex-col items-start lg:items-center min-w-[120px]">
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1.5 px-1">Durum</span>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/dashboard/admin/applications/${app.id}`}
                      className="px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-2"
                    >
                      İncele
                      <ArrowRight size={14} />
                    </Link>
                    {app.status === 'pending' || app.status === 'waitlisted' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'accepted')}
                          className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Kabul Et"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Reddet"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'pending')}
                        className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all"
                        title="Beklemeye Al"
                      >
                        <Clock size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Motivasyon Mektubu Özeti (Opsiyonel) */}
                {app.motivation_letter && (
                  <div className="mt-6 pt-6 border-t border-gray-50">
                    <div className="flex items-start gap-3 text-gray-400">
                      <FileText size={16} className="mt-0.5 flex-shrink-0 opacity-50" />
                      <p className="text-[11px] font-medium leading-relaxed italic line-clamp-2">"{app.motivation_letter}"</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredApps.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-gray-100 border-dashed">
              <AlertCircle size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Eşleşen başvuru bulunamadı.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    pending: { label: 'Bekliyor', color: 'bg-orange-50 text-orange-500', icon: Clock },
    accepted: { label: 'Onaylandı', color: 'bg-emerald-50 text-emerald-600', icon: Check },
    rejected: { label: 'Reddedildi', color: 'bg-red-50 text-red-600', icon: X },
    waitlisted: { label: 'Yedek', color: 'bg-indigo-50 text-indigo-600', icon: Clock },
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${config.color}`}>
      <config.icon size={12} className="mr-2" />
      {config.label}
    </span>
  );
}
