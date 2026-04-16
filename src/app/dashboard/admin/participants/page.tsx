"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  GraduationCap, 
  Mail, 
  Phone,
  ShieldAlert,
  User,
  Download,
  FileBox,
  FileText,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  X,
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from "sonner";

export default function AdminParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ status: '', university: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tc_no: '',
    phone: '',
    university: '',
    department: '',
    class: '',
    hometown: '',
    period: '',
    credits: 100,
    status: 'active'
  });

  useEffect(() => {
    fetchParticipants();
  }, [filter]);

  const fetchParticipants = async () => {
    try {
      const res = await api.get('/participants', { params: { ...filter, search } });
      setParticipants(res.data.data || []);
    } catch (err) {
      console.error('Katılımcılar çekilemedi:', err);
      toast.error('Katılımcı listesi yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchParticipants();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const handleMakeAlumni = async (userId: number) => {
    if (!confirm('Bu öğrenciyi mezun etmek istediğinize emin misiniz? Rolü Alumni olarak güncellenecek.')) return;
    try {
      await api.post(`/admin/users/${userId}/make-alumni`);
      toast.success('Öğrenci başarıyla mezun edildi!');
      fetchParticipants();
    } catch (err) {
      toast.error('Mezuniyet işlemi başarısız oldu.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/participants/${editingId}`, formData);
        toast.success('Katılımcı bilgileri güncellendi.');
      } else {
        await api.post('/participants', formData);
        toast.success('Yeni katılımcı başarıyla eklendi.');
      }
      handleClose();
      fetchParticipants();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'İşlem başarısız oldu.';
      toast.error(msg);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', password: '', tc_no: '', phone: '',
      university: '', department: '', class: '', hometown: '', period: '',
      credits: 100, status: 'active'
    });
    setEditingId(null);
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  }

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.user?.name || '',
      email: p.user?.email || '',
      password: '',
      tc_no: p.tc_no || '',
      phone: p.phone || '',
      university: p.university || '',
      department: p.department || '',
      class: p.class || '',
      hometown: p.hometown || '',
      period: p.period || '',
      credits: p.credits || 0,
      status: p.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
     if (!confirm('Bu katılımcıyı tamamen silmek istediğinize emin misiniz? Kullanıcı hesabı da silinecek.')) return;
     try {
       await api.delete(`/participants/${id}`);
       fetchParticipants();
     } catch {
       alert('Silme işlemi başarısız.');
     }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      toast.loading("Dosya hazırlanıyor...");
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.dismiss();
      toast.success("Dosya başarıyla indirildi.");
    } catch (err) {
      toast.dismiss();
      toast.error('Dosya indirilirken bir hata oluştu.');
    }
  };

  const exportToCSV = () => {
    downloadFile('/participants/export/csv', `kademe_katilimci_listesi_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      active: 'bg-emerald-50 text-emerald-600',
      passive: 'bg-gray-100 text-gray-400',
      alumni: 'bg-blue-50 text-blue-600',
      blacklisted: 'bg-red-50 text-red-600',
      failed: 'bg-orange-50 text-orange-600',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Katılımcı Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Başvuru onayları, kredi takibi ve mezuniyet süreci yönetimi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => exportToCSV()}
              className="p-2.5 text-gray-400 hover:text-emerald-600 transition-colors"
              title="CSV"
            >
              <Download size={16} />
            </button>
            <button 
              onClick={() => downloadFile(`/participants/export/excel`, `kademe_katilimcilar_${new Date().toISOString().slice(0,10)}.xlsx`)}
              className="p-2.5 text-gray-400 hover:text-blue-600 transition-colors border-l border-gray-50"
              title="Excel"
            >
              <FileText size={16} />
            </button>
            <button 
              onClick={() => downloadFile(`/participants/export/pdf`, `kademe_katilimcilar_${new Date().toISOString().slice(0,10)}.pdf`)}
              className="p-2.5 text-gray-400 hover:text-red-600 transition-colors border-l border-gray-50"
              title="PDF"
            >
              <FileBox size={16} />
            </button>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-[11px] font-bold rounded-xl hover:bg-black transition-all uppercase tracking-widest shadow-lg shadow-gray-900/10"
          >
            <Plus size={16} />
            YENİ KATILIMCI
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="İsim veya TC No..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
          </div>
          <select 
            onChange={(e) => setFilter({...filter, status: e.target.value})}
            className="bg-gray-50 border-none rounded-2xl py-3.5 px-6 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all cursor-pointer"
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="alumni">Mezun</option>
            <option value="blacklisted">Kara Liste</option>
          </select>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Üniversite Filtrele" 
              onChange={(e) => setFilter({...filter, university: e.target.value})}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Participants Table/List */}
      <div className="space-y-3">
        {loading ? (
             [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse h-20"></div>
             ))
        ) : participants.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm font-medium">Kriterlere uygun katılımcı bulunamadı.</div>
        ) : participants.map((p: any) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={p.id}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:border-orange-100 transition-all flex flex-col md:flex-row items-center gap-6 group"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-50 group-hover:bg-white group-hover:border-orange-100 transition-all">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 capitalize">{p.user?.name}</h3>
                <div className="flex items-center space-x-3 mt-0.5">
                   <p className="text-[11px] text-gray-400 font-medium">{p.university} · {p.department}</p>
                   <span className="text-[9px] bg-gray-50 px-2 py-0.5 rounded text-gray-400 font-bold tracking-wider">{p.tc_no_masked}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-12 px-8 border-l border-gray-50 hidden lg:flex">
              <div className="w-20">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">KREDİ</div>
                <div className={`text-base font-bold ${p.credits < 75 ? 'text-red-500' : 'text-gray-900'}`}>{p.credits}</div>
              </div>
              <div className="w-24">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">DURUM</div>
                {getStatusBadge(p.status)}
              </div>
              <div className="w-24">
                  {p.status !== 'alumni' ? (
                    <button 
                      onClick={() => handleMakeAlumni(p.user_id)}
                      className="px-4 py-2 bg-gray-900 text-white text-[9px] font-bold rounded-lg uppercase tracking-widest hover:bg-orange-600 transition-colors"
                    >
                      Mezun Et
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                        <UserCheck size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">ONAYLI</span>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(p)}
                  className="p-3 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
                <Link href={`/dashboard/admin/participants/${p.id}`}>
                  <button className="p-3 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all">
                    <ChevronRight size={18} />
                  </button>
                </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New/Edit Participant Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 overflow-y-auto max-h-[90vh] shadow-2xl">
                
                <button 
                  onClick={handleClose}
                  className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">{editingId ? 'Katılımcıyı Düzenle' : 'Yeni Katılımcı Kaydı'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="col-span-full">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tam İsim</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="Örn: Ahmet Yılmaz" required />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-posta</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="email@example.com" required />
                   </div>
                   {!editingId && (
                     <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Şifre</label>
                        <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="********" required />
                     </div>
                   )}
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">TC Kimlik No</label>
                      <input value={formData.tc_no} onChange={e => setFormData({...formData, tc_no: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="11 haneli" maxLength={11} required />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Telefon</label>
                      <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="05xx..." />
                   </div>
                   
                   {editingId && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kredi Puanı</label>
                        <input type="number" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Üyelik Durumu</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10 cursor-pointer">
                          <option value="active">Aktif</option>
                          <option value="passive">Pasif</option>
                          <option value="alumni">Mezun</option>
                          <option value="blacklisted">Kara Liste</option>
                          <option value="failed">Başarısız</option>
                        </select>
                      </div>
                    </>
                   )}

                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Üniversite</label>
                      <input value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="Üniversite adı" />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bölüm</label>
                      <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="Bölüm adı" />
                   </div>
                   <div className="col-span-full pt-8 flex gap-4">
                      <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-[11px] tracking-widest shadow-xl shadow-gray-900/10">KAYDET</button>
                      <button type="button" onClick={handleClose} className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all uppercase text-[11px] tracking-widest underline">İPTAL</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
