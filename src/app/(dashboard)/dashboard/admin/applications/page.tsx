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
  ChevronLeft,
  ChevronRight
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
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchApplications = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/applications?page=${targetPage}&search=${search}&status=${filter}`);
      // Laravel pagination: { data: [], current_page, last_page, etc }
      setApplications(res.data.data);
      setPagination(res.data);
      setPage(res.data.current_page);
    } catch (err) {
      toast.error('Gelen başvurular yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, [filter]); // Filtre değişince başa dön

  // Arama için debounce yapılabilir ama şimdilik manuel tetikleme veya efekt
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchApplications(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusUpdate = async (id: number, status: string) => {
    const previousApps = [...applications];
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));

    try {
      await api.put(`/applications/${id}/status`, { status });
      toast.success(`Başvuru durumu ${status.toUpperCase()} olarak güncellendi.`);
    } catch (err) {
      setApplications(previousApps);
      toast.error('İşlem başarısız oldu.');
    }
  };

  return (
    <div className="max-w-6xl pb-20">
      <PageHeader 
        title="Gelen Başvurular"
        description="Program ve eğitim başvurularını değerlendirin, süreci tek bir merkezden yönetin."
        icon={<User />}
      />

      {/* Filtre ve Arama */}
      <DashboardCard className="p-6 mb-10 !rounded-[2rem]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Aday veya proje ismi ile ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium placeholder:text-gray-300"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black text-gray-600 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all cursor-pointer uppercase tracking-widest"
          >
            <option value="all">Tüm Başvurular</option>
            <option value="pending">Bekleyenler</option>
            <option value="accepted">Kabul Edilenler</option>
            <option value="rejected">Reddedilenler</option>
            <option value="waitlisted">Yedek Listedekiler</option>
          </select>
        </div>
      </DashboardCard>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-gray-300 font-bold text-xs uppercase tracking-widest italic">Yükleniyor...</div>
      ) : (
        <>
          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {applications.map((app: any) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-50 group-hover:bg-orange-500 group-hover:border-transparent group-hover:text-white transition-all shadow-sm">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-gray-900 tracking-tight mb-1">{app.user?.name}</h3>
                        <div className="flex flex-wrap gap-5 text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em]">
                          <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-300"/> {app.user?.email}</span>
                          <span className="flex items-center gap-1.5"><Smartphone size={12} className="text-gray-300"/> {app.user?.participant_profile?.phone || 'Telefon Yok'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-center min-w-[180px]">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 px-1">Program Adı</span>
                      <span className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-gray-900/10">
                        {app.project?.name}
                      </span>
                    </div>

                    <div className="flex flex-col items-start lg:items-center min-w-[140px]">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 px-1">Başvuru Durumu</span>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="px-6 py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center gap-2"
                      >
                        DETAY
                        <ArrowRight size={14} />
                      </Link>
                      {app.status === 'pending' || app.status === 'waitlisted' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                            className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStatusUpdate(app.id, 'pending')}
                          className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                        >
                          <Clock size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {applications.length === 0 && (
              <DashboardCard className="text-center py-24 border-dashed border-2">
                <AlertCircle size={48} className="mx-auto text-gray-200 mb-6" />
                <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Başvuru bulunamadı.</p>
              </DashboardCard>
            )}
          </div>

          {/* Sayfalama Kontrolleri */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
               <button 
                 disabled={page === 1}
                 onClick={() => fetchApplications(page - 1)}
                 className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
               >
                 <ChevronLeft size={20} />
               </button>
               
               <div className="flex items-center gap-2">
                  {[...Array(pagination.last_page)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => fetchApplications(i + 1)}
                      className={`w-12 h-12 rounded-2xl text-xs font-black transition-all ${
                        page === i + 1 
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
               </div>

               <button 
                 disabled={page === pagination.last_page}
                 onClick={() => fetchApplications(page + 1)}
                 className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
               >
                 <ChevronRight size={20} />
               </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
