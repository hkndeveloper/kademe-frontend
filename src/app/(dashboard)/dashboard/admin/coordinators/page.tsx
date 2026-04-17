"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus,
  Mail,
  Lock,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CoordinatorManagement() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    password: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    try {
      const res = await api.get('/admin/coordinators');
      setCoordinators(res.data);
    } catch (err) {
      toast.error('Koordinatörler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/admin/coordinators/${editingId}`, formData);
        toast.success('Koordinatör güncellendi.');
      } else {
        await api.post('/admin/coordinators', formData);
        toast.success('Yeni koordinatör oluşturuldu.');
      }
      setShowModal(false);
      resetForm();
      fetchCoordinators();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'İşlem başarısız.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setEditingId(null);
  };

  const handleEdit = (c: any) => {
    setEditingId(c.id);
    setFormData({ 
      name: c.name, 
      email: c.email,
      password: '' // Şifre boş bırakılırsa güncellenmez
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu koordinatörü silmek istediğinize emin misiniz? (Tüm yetkileri kaldırılacaktır)')) return;
    try {
      await api.delete(`/admin/coordinators/${id}`);
      toast.success('Koordinatör silindi.');
      fetchCoordinators();
    } catch (err) {
      toast.error('Silme işlemi başarısız.');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             <ShieldCheck className="text-orange-500" /> Koordinatör Yönetimi
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Sistemdeki proje sorumlularını buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-sm uppercase tracking-widest"
        >
          <UserPlus size={16} />
          Yeni Koordinatör Ekle
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kullanıcı Bilgileri</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rol</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="px-8 py-6 h-20 bg-gray-50/20"></td>
                </tr>
              ))
            ) : coordinators.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{c.name}</span>
                    <span className="text-xs text-gray-400 font-medium">{c.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                    KOORDİNATÖR
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(c)} className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2.5 bg-gray-100 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-8">{editingId ? 'Bilgileri Düzenle' : 'Yeni Kayıt'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tam İsim</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" placeholder="Ahmet Yılmaz" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta Adresi</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" placeholder="ornek@kademe.org" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{editingId ? 'Yeni Şifre (Değişmeyecekse boş bırakın)' : 'Şifre'}</label>
                  <input type="password" required={!editingId} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" placeholder="••••••••" />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">İptal</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Kaydet'}
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
