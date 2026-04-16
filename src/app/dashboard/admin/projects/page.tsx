"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle,
  MoreHorizontal,
  FolderOpen
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    location: '',
    capacity: 50,
    application_deadline: '',
    format: 'Hibrit',
    period: '',
    sub_description: '',
    timeline: [] as any | string,
    documents: [] as any | string
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Projeler çekilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        application_deadline: formData.application_deadline || null,
        timeline: typeof formData.timeline === 'string' ? JSON.parse(formData.timeline) : formData.timeline,
        documents: typeof formData.documents === 'string' ? JSON.parse(formData.documents) : formData.documents,
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, data);
      } else {
        await api.post('/projects', data);
      }
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      alert('İşlem sırasında bir hata oluştu. JSON formatlarını kontrol edin.');
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', description: '', location: '', capacity: 50, 
      application_deadline: '', format: 'Hibrit', period: '', 
      sub_description: '', timeline: [], documents: [] 
    });
    setEditingId(null);
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ 
      name: p.name, 
      description: p.description || '',
      location: p.location || '',
      capacity: p.capacity || 50,
      application_deadline: p.application_deadline ? p.application_deadline.split('T')[0] : '',
      format: p.format || 'Hibrit',
      period: p.period || '',
      sub_description: p.sub_description || '',
      timeline: p.timeline ? JSON.stringify(p.timeline, null, 2) : '[]',
      documents: p.documents ? JSON.stringify(p.documents, null, 2) : '[]'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu projeyi silmek istediginize emin misiniz?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert('Proje silinemedi.');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Proje Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Tüm kurumsal projeleri buradan dinamik olarak yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all shadow-sm uppercase tracking-widest"
        >
          <Plus size={16} />
          Yeni Proje Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>)
        ) : projects.map((project: any) => (
          <motion.div layout key={project.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:border-orange-100 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
                <FolderOpen size={24} />
              </div>
              <div className="flex gap-2">
                 <button onClick={() => handleEdit(project)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                  <Edit2 size={16} />
                </button>
                 <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{project.name}</h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">{project.period || 'DÖNEM BELİRTİLMEDİ'}</p>
            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                {project.is_active ? (
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    <CheckCircle size={12} className="mr-1.5" /> AKTİF
                  </span>
                ) : (
                  <span className="flex items-center text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    <XCircle size={12} className="mr-1.5" /> PASİF
                  </span>
                )}
                <span className="text-[10px] font-bold text-gray-400">{project.location || 'Konya'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-8">{editingId ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Proje Adı</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sayfa Sloganı / Alt Başlık</label>
                  <input type="text" value={formData.sub_description} onChange={(e) => setFormData({...formData, sub_description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Lokasyon</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kontenjan</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Başvuru Bitiş Tarihi</label>
                  <input type="date" value={formData.application_deadline} onChange={(e) => setFormData({...formData, application_deadline: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Dönem (Örn: 2024 Bahar)</label>
                  <input type="text" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Format (Hibrit/Online/Yüzyüze)</label>
                  <input type="text" value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Geniş Açıklama</label>
                  <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-medium"></textarea>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Program Akışı (JSON Format)</label>
                  <textarea rows={4} value={formData.timeline} onChange={(e) => setFormData({...formData, timeline: e.target.value})} className="w-full bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl py-4 px-6 outline-none" placeholder='[{"label": "Açılış", "date": "Mart 2026"}]'></textarea>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Belgeler (JSON Format)</label>
                  <textarea rows={4} value={formData.documents} onChange={(e) => setFormData({...formData, documents: e.target.value})} className="w-full bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl py-4 px-6 outline-none" placeholder='[{"title": "Kılavuz", "url": "..."}]'></textarea>
                </div>
                <div className="flex gap-4 pt-4 md:col-span-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">İptal</button>
                  <button type="submit" className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all">Projeyi Kaydet</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
