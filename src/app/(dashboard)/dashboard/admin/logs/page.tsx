"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Database, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  Download,
  Info
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from "sonner";

// UI Core Bileşenleri
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/audit-logs');
      setLogs(res.data);
    } catch (err) {
      // Mock data for Phase 4 Demonstration
      setLogs([
        { id: 1, user: 'Admin Kerem', action: 'UPDATE', target: 'Project: Diplomasi360', ip: '192.168.1.1', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: 2, user: 'Coord. Elif', action: 'CREATE', target: 'Application #452', ip: '192.168.1.45', created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
        { id: 3, user: 'Admin Kerem', action: 'DELETE', target: 'Blog: Eski Duyuru', ip: '192.168.1.1', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: 4, user: 'Admin Kerem', action: 'LOGIN', target: 'System Access', ip: '192.168.1.1', created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const s = search.toLowerCase();
    const searchMatch = log.user?.toLowerCase().includes(s) || log.target?.toLowerCase().includes(s);
    const actionMatch = actionFilter === 'all' || log.action === actionFilter;
    return searchMatch && actionMatch;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-emerald-500 bg-emerald-50';
      case 'UPDATE': return 'text-amber-500 bg-amber-50';
      case 'DELETE': return 'text-red-500 bg-red-50';
      case 'LOGIN': return 'text-blue-500 bg-blue-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="max-w-7xl pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <PageHeader 
          title="İşlem Günlükleri"
          description="Sistem genelinde yapılan tüm kritik hareketleri ve veri değişikliklerini denetleyin."
          icon={<History />}
        />
        <button 
          onClick={fetchLogs}
          className="px-6 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          LİSTEYİ YENİLE
        </button>
      </div>

      {/* Filters */}
      <DashboardCard className="p-6 mb-10 !rounded-[2rem]">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Sorumlu veya hedef ara..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
               />
            </div>
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all cursor-pointer uppercase tracking-widest"
            >
               <option value="all">TÜM İŞLEMLER</option>
               <option value="CREATE">VERİ EKLEME</option>
               <option value="UPDATE">GÜNCELLEME</option>
               <option value="DELETE">SİLME / ARŞİV</option>
               <option value="LOGIN">GİRİŞLER</option>
            </select>
            <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
               <Download size={16} /> LOGLARI DIŞA AKTAR
            </button>
         </div>
      </DashboardCard>

      {/* Table Area */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16">#</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SORUMLU ÜYE</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">İŞLEM TÜRÜ</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">HEDEF VERİ / NOT</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">TARİH & SAAT</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12 text-center">İP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode='popLayout'>
            {filteredLogs.map((log) => (
              <motion.tr 
                key={log.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-slate-50/30 transition-colors group"
              >
                <td className="px-8 py-6 text-[10px] font-black text-slate-300 font-mono">{log.id}</td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                         <User size={14} />
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wide">{log.user}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                      {log.action}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <span className="text-xs font-bold text-slate-500">{log.target}</span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 tracking-tight">{new Date(log.created_at).toLocaleDateString('tr-TR')}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.created_at).toLocaleTimeString('tr-TR')}</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-center">
                   <div className="relative group/ip">
                      <Info size={14} className="text-slate-200 cursor-help mx-auto" />
                      <div className="absolute bottom-full right-0 mb-2 invisible group-hover/ip:visible bg-slate-900 text-white text-[9px] font-black px-3 py-2 rounded-xl whitespace-nowrap shadow-xl">
                         {log.ip}
                      </div>
                   </div>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredLogs.length === 0 && !loading && (
          <div className="py-32 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Database size={40} />
             </div>
             <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Kayıt bulunamadı.</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-8 bg-amber-50 border border-amber-100 rounded-[3rem] flex items-start gap-6">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <ShieldCheck size={24} />
         </div>
         <div className="flex-1">
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2">Güvenlik ve Gizlilik Bilgilendirmesi</h4>
            <p className="text-xs text-amber-800/60 font-medium leading-relaxed">
              Sistem günlüğü kayıtları (Audit Logs), KVKK kapsamında kritik öneme sahiptir. Bu kayıtlar silinemez ve sadece Super-Admin yetkisine sahip kullanıcılar tarafından görüntülenebilir. Kayıtlar, hukuki süreçlerde delil niteliği taşımaktadır.
            </p>
         </div>
      </div>
    </div>
  );
}
