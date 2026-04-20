"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Shield, 
  Trash2, 
  Edit2, 
  Mail, 
  X,
  UserPlus,
  Loader2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function MasterUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showRoleModal, setShowRoleModal] = useState<any>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  const allRoles = ['super-admin', 'coordinator', 'staff', 'student', 'alumni', 'personel'];

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', { params: { search } });
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Kullanıcı listesi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleUpdateRoles = async () => {
    try {
      await api.put(`/admin/users/${showRoleModal.id}/roles`, { roles: selectedRoles });
      toast.success("Roller güncellendi.");
      setShowRoleModal(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Hata oluştu.");
    }
  };

  const handleDelete = async (user: any) => {
    if (!confirm(`${user.name} kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success("Kullanıcı silindi.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Silme başarısız.");
    }
  };

  const openRoleModal = (user: any) => {
    setShowRoleModal(user);
    setSelectedRoles(user.roles.map((r: any) => r.name));
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Sistem Kullanıcıları</h1>
          <p className="text-slate-500 font-medium text-sm">Tüm yönetici, koordinatör ve katılımcıların merkezi listesi.</p>
        </div>
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="İsim veya e-posta ile ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-slate-900/10 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Kullanıcı</th>
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Roller</th>
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Durum</th>
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
               <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold italic animate-pulse">Veriler Çekiliyor...</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-all">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                       <Users size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Mail size={10} /> {user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((r: any) => (
                      <span key={r.id} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${r.name === 'super-admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {r.name}
                      </span>
                    ))}
                    {user.roles.length === 0 && <span className="text-[10px] text-slate-300 italic">Rolsüz Kullanıcı</span>}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-900 uppercase">Aktif</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                   <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openRoleModal(user)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl transition-all"
                      >
                        <Shield size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user)}
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Management Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRoleModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer" />
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"></div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Rol Düzenle</h2>
                <p className="text-sm text-slate-400 font-medium mb-10">{showRoleModal.name} kullanıcısının sistem yetkileri.</p>

                <div className="space-y-3 mb-10">
                   {allRoles.map(role => (
                     <button
                       key={role}
                       onClick={() => toggleRole(role)}
                       className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all border-2 ${selectedRoles.includes(role) ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-50 text-slate-300 hover:border-slate-100'}`}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedRoles.includes(role) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}>
                           <Shield size={14} />
                         </div>
                         <span className={`text-xs font-black uppercase tracking-widest ${selectedRoles.includes(role) ? 'text-slate-900' : 'text-slate-300'}`}>{role}</span>
                       </div>
                       {selectedRoles.includes(role) && <CheckCircle2 size={18} className="text-slate-900" />}
                     </button>
                   ))}
                </div>

                <div className="flex gap-4">
                   <button 
                    onClick={handleUpdateRoles}
                    className="flex-1 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                   >
                     <ShieldCheck size={20} /> GÜNCELLE
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
