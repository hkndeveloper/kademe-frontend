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
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [timelineItems, setTimelineItems] = useState([{ label: '', date: '' }]);
  const [selectedFiles, setSelectedFiles] = useState<{file: File, title: string}[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("user_roles") || "[]");
    setIsSuperAdmin(roles.includes("super-admin"));
    fetchProjects();
    fetchCoordinators();
  }, []);

  const addTimelineItem = () => setTimelineItems([...timelineItems, { label: '', date: '' }]);
  const removeTimelineItem = (index: number) => setTimelineItems(timelineItems.filter((_, i) => i !== index));
  const updateTimelineItem = (index: number, field: string, value: string) => {
    const newItems = [...timelineItems];
    (newItems[index] as any)[field] = value;
    setTimelineItems(newItems);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFiles([...selectedFiles, { file, title: file.name }]);
    }
  };

  const removeSelectedFile = (index: number) => setSelectedFiles(selectedFiles.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'coordinator_ids') {
          formData.coordinator_ids.forEach(id => form.append('coordinator_ids[]', String(id)));
        } else if (key !== 'timeline' && key !== 'documents') {
          form.append(key, (formData as any)[key]);
        }
      });

      form.append('timeline', JSON.stringify(timelineItems.filter(i => i.label && i.date)));
      
      selectedFiles.forEach((sf, index) => {
        form.append(`document_files[${index}]`, sf.file);
        form.append(`document_titles[${index}]`, sf.title);
      });

      // Laravel needs _method=PUT for multipart/form-data updates
      if (editingId) {
        form.append('_method', 'PUT');
        await api.post(`/projects/${editingId}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/projects', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      resetForm();
      fetchProjects();
      toast.success('Proje başarıyla kaydedildi.');
    } catch (err: any) {
      toast.error('Giriş yapılan verileri kontrol edin.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', description: '', location: '', capacity: 50, 
      application_deadline: '', format: 'Hibrit', period: '', 
      sub_description: '', timeline: [], documents: [],
      coordinator_ids: []
    });
    setTimelineItems([{ label: '', date: '' }]);
    setSelectedFiles([]);
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
      timeline: p.timeline || [],
      documents: p.documents || [],
      coordinator_ids: p.coordinators ? p.coordinators.map((c: any) => c.id) : []
    });
    setTimelineItems(p.timeline && p.timeline.length > 0 ? p.timeline : [{ label: '', date: '' }]);
    setSelectedFiles([]); // Mevcut dosyalar backend'de korunuyor, yenileri buradan ekleniyor
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu projeyi silmek istediginize emin misiniz?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
      toast.success('Proje silindi.');
    } catch (err) {
      toast.error('Proje silinemedi.');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             <ShieldCheck className="text-orange-500" /> Proje Yönetimi
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Tüm kurumsal projeleri buradan dinamik olarak yönetebilirsiniz.</p>
        </div>
        {isSuperAdmin && (
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-sm uppercase tracking-widest"
          >
            <Plus size={16} />
            Yeni Proje Ekle
          </button>
        )}
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
                 <button onClick={() => handleEdit(project)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                  <Edit2 size={16} />
                </button>
                 {isSuperAdmin && (
                   <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                   </button>
                 )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{project.name}</h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">{project.period || 'DÖNEM BELİRTİLMEDİ'}</p>
            <div className="flex flex-wrap gap-1 mb-4">
               {project.coordinators?.map((c: any) => (
                 <span key={c.id} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold truncate max-w-[100px]">{c.name}</span>
               ))}
            </div>
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
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 scrollbar-hide">
              <h2 className="text-3xl font-black text-slate-900 mb-8">{editingId ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proje Adı</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sayfa Sloganı / Alt Başlık</label>
                  <input type="text" value={formData.sub_description} onChange={(e) => setFormData({...formData, sub_description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Uygulama Formatı</label>
                  <select 
                    value={formData.format} 
                    onChange={(e) => setFormData({...formData, format: e.target.value})} 
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold"
                  >
                    <option value="Hibrit">Hibrit</option>
                    <option value="Online">Online</option>
                    <option value="Yüz Yüze">Yüz Yüze</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dönem (Örn: 2024 Bahar)</label>
                  <input type="text" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>

                {isSuperAdmin && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proje Koordinatörleri (Çoklu Seçim)</label>
                    <div className="relative group">
                      <select 
                        multiple 
                        className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold min-h-[120px] scrollbar-hide"
                        value={formData.coordinator_ids.map(id => String(id))}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                          setFormData({...formData, coordinator_ids: values});
                        }}
                      >
                        {coordinators.map((c: any) => (
                          <option key={c.id} value={c.id} className="py-2 px-1 rounded-lg checked:bg-orange-500 checked:text-white mb-1 uppercase tracking-tighter">
                            👤 {c.name} ({c.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokasyon</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kontenjan</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Başvuru Bitiş Tarihi</label>
                  <input type="date" value={formData.application_deadline} onChange={(e) => setFormData({...formData, application_deadline: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-bold" />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Geniş Açıklama</label>
                  <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-orange-500/10 font-medium"></textarea>
                </div>

                {/* Dinamik Program Akışı */}
                <div className="space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Akışı (Zaman Çizelgesi)</label>
                    <button type="button" onClick={addTimelineItem} className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 flex items-center gap-1">
                      <Plus size={14} /> Yeni Adım Ekle
                    </button>
                  </div>
                  <div className="space-y-3">
                    {timelineItems.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input type="text" placeholder="Başlık (Örn: Mülakatlar)" value={item.label} onChange={(e) => updateTimelineItem(index, 'label', e.target.value)} className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none ring-1 ring-slate-100" />
                        <input type="text" placeholder="Tarih (Örn: Mart 2026)" value={item.date} onChange={(e) => updateTimelineItem(index, 'date', e.target.value)} className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none ring-1 ring-slate-100" />
                        <button type="button" onClick={() => removeTimelineItem(index)} className="p-2 bg-slate-50 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Belge Yükleme */}
                <div className="space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Belgeler & Dosyalar</label>
                    <label className="cursor-pointer text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 flex items-center gap-1">
                      <Plus size={14} /> Bilgisayardan Ekle
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  
                  {/* Yeni Seçilen Dosyalar */}
                  <div className="space-y-2">
                    {selectedFiles.map((sf, index) => (
                      <div key={index} className="flex gap-3 items-center bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                        <FolderOpen size={16} className="text-orange-500" />
                        <input type="text" value={sf.title} onChange={(e) => {
                          const newFiles = [...selectedFiles];
                          newFiles[index].title = e.target.value;
                          setSelectedFiles(newFiles);
                        }} className="flex-1 bg-transparent border-none text-xs font-bold outline-none" />
                        <span className="text-[9px] text-orange-400 font-bold uppercase tracking-widest">Yüklenecek</span>
                        <button type="button" onClick={() => removeSelectedFile(index)} className="p-1 text-orange-300 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    {/* Mevcut Dosyalar (Editing ise) */}
                    {editingId && formData.documents && (formData.documents as any).map((doc: any, index: number) => (
                      <div key={`old-${index}`} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <FolderOpen size={16} className="text-slate-400" />
                        <span className="flex-1 text-xs font-bold text-slate-600">{doc.title}</span>
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Görüntüle</a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-8 md:col-span-2 border-t border-slate-50 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]">İptal</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black shadow-xl shadow-slate-900/10 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Projeyi Kaydet'}
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
