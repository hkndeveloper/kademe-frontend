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
  const [formData, setFormData] = useState({ name: '', description: '' });
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
      if (editingId) {
        await api.put(`/projects/${editingId}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      alert('İşlem sırasında bir hata oluştu.');
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({ name: project.name, description: project.description || '' });
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
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all shadow-sm uppercase tracking-widest"
        >
          <Plus size={16} />
          Yeni Proje Ekle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Proje ismine göre ara..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium text-sm"
          />
        </div>
        <button className="px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all uppercase tracking-widest">
          Filtrele
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>)
        ) : projects.map((project: any) => (
          <motion.div 
            layout
            key={project.id}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:border-orange-100 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
                <FolderOpen size={24} />
              </div>
              <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{project.name}</h3>
            <p className="text-gray-400 text-xs mb-8 line-clamp-3 leading-relaxed font-medium">
              {project.description || 'Bu proje için henüz bir açıklama girilmedi.'}
            </p>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {project.is_active ? (
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    <CheckCircle size={12} className="mr-1.5" /> AKTİF
                  </span>
                ) : (
                  <span className="flex items-center text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    <XCircle size={12} className="mr-1.5" /> PASİF
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => handleEdit(project)}
                  className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all"
                >
                  <Edit2 size={16} />
                </button>
                 <button 
                  onClick={() => handleDelete(project.id)}
                  className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      {/* New Project Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
                {editingId ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Proje Adı</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-yellow-500/20 font-bold text-lg"
                    placeholder="Örn: Diplomasi360"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Açıklama</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-yellow-500/20 font-medium"
                    placeholder="Proje detaylarını buraya girebilirsiniz..."
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-yellow-500 text-white font-bold rounded-2xl hover:bg-yellow-600 shadow-lg shadow-yellow-500/20 transition-all"
                  >
                    Projeyi Kaydet
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
