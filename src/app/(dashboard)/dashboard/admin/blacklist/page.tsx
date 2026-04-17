"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserX,
  ShieldAlert,
  Calendar,
  Search,
  RefreshCw,
  AlertTriangle,
  Mail,
  Smartphone
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from "sonner";

export default function BlacklistPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlacklist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/blacklist');
      setUsers(res.data);
    } catch (err) {
      toast.error('Kara liste verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const handleRemoveFromBlacklist = async (userId: number) => {
    if (!confirm('Bu kullanıcıyı kara listeden çıkarmak ve kredilerini sıfırlamak (100) istediğinize emin misiniz?')) return;
    try {
        await api.post(`/admin/users/${userId}/adjust-credits`, {
            credits: 100,
            status: 'active',
            reason: 'Manuel Af - Admin Kararı'
        });
        // Ayrıca statüsünü de güncellememiz lazım. AdjustCredits statü güncellemez. 
        // AdminController'ı güncelleyip adjust-credits'e statü parametresi eklemeliyim.
        toast.success('Kullanıcı affedildi ve kredileri yenilendi.');
        fetchBlacklist();
    } catch (err) {
        toast.error('İşlem başarısız.');
    }
  };

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.participant_profile?.blacklist_reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <ShieldAlert className="text-red-500" size={32} />
             Kara Liste (Blacklist)
          </h1>
          <p className="text-slate-500 font-medium mt-2">Mazeretsiz devamsızlık veya kural ihlali nedeniyle engellenen katılımcılar.</p>
        </div>
        <button 
          onClick={fetchBlacklist}
          className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-400"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-16 h-16 bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-amber-500/20">
           <AlertTriangle size={32} />
        </div>
        <div className="flex-1">
           <h4 className="font-black text-amber-900 mb-1">Otomasyon Kuralları (Section 14.1)</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-xs font-bold text-amber-800/70 uppercase tracking-widest">
              <p>• 3 mazeretsiz devamsızlık -> Otomatik kara liste</p>
              <p>• Kredi eşiği (75) altı -> SMS uyarısı</p>
              <p>• Kara listedekiler yeni projeye başvuramaz</p>
              <p>• Tüm mevcut başvurular otomatik iptal edilir</p>
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10 overflow-hidden">
         <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="İsim veya engel nedeni ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-3xl py-5 pl-16 pr-8 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
            />
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
           <Users size={64} className="mx-auto text-slate-100 mb-4" />
           <p className="text-slate-400 font-bold">Kara listede kimse bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {filteredUsers.map((user: any) => (
             <motion.div 
               layout
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               key={user.id} 
               className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative group"
             >
                <div className="flex items-start justify-between mb-8">
                   <div className="flex gap-4">
                      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100">
                         <UserX size={28} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
                         <div className="flex items-center gap-3 mt-1 underline decoration-slate-200 underline-offset-4 decoration-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.participant_profile?.university}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Kredi</div>
                      <div className="text-2xl font-black text-red-500">{user.participant_profile?.credits}</div>
                   </div>
                </div>

                <div className="bg-red-50/50 p-6 rounded-3xl border border-red-50 mb-8">
                   <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert size={14} className="text-red-400" />
                      <span className="text-[10px] font-black text-red-900 uppercase tracking-widest">Engel Nedeni</span>
                   </div>
                   <p className="text-sm font-bold text-red-700/80 italic">"{user.participant_profile?.blacklist_reason || 'Belirtilmedi'}"</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                   <div className="flex gap-4">
                      <button className="text-slate-300 hover:text-slate-900 transition-colors"><Mail size={18} /></button>
                      <button className="text-slate-300 hover:text-slate-900 transition-colors"><Smartphone size={18} /></button>
                      <button className="text-slate-300 hover:text-slate-900 transition-colors"><Calendar size={18} /></button>
                   </div>
                   <button 
                     onClick={() => handleRemoveFromBlacklist(user.id)}
                     className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-emerald-500 transition-all"
                   >
                     Affet & Temizle
                   </button>
                </div>

                {user.participant_profile?.blacklisted_at && (
                  <div className="absolute top-8 right-8 text-[9px] font-black text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                     ENGEL: {new Date(user.participant_profile.blacklisted_at).toLocaleDateString()}
                  </div>
                )}
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
}
