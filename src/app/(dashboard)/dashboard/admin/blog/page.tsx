"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Calendar, 
  User, 
  Edit2, 
  Trash2, 
  Eye, 
  MoreVertical,
  Filter,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from "sonner";
import Link from 'next/link';

// UI Core Bileşenleri
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatusBadge from '@/components/dashboard/StatusBadge';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data || res.data);
    } catch (err) {
      // Mock data for initial development if API is not fully ready
      setBlogs([
        { id: 1, title: 'Diplomasi360 Eğitimleri Devam Ediyor', category: 'Eğitim', status: 'published', created_at: new Date().toISOString(), author: 'KADEME Yönetim', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80' },
        { id: 2, title: 'KADEME+ Başvuruları Hakkında Bilgilendirme', category: 'Duyuru', status: 'draft', created_at: new Date().toISOString(), author: 'Ahmet Yılmaz', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' }
      ]);
      // toast.error('Blog yazıları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yazıyı arşivlemek istediğinize emin misiniz?')) return;
    
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b.id !== id));
      toast.success('Yazı arşivlendi.');
    } catch (err) {
      toast.error('İşlem başarısız oldu.');
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await api.put(`/blogs/${id}/status`, { status: newStatus });
      setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Durum ${newStatus.toUpperCase()} olarak güncellendi.`);
    } catch (err) {
      toast.error('Guncelleme başarısız.');
    }
  };

  const filteredBlogs = (blogs || []).filter((blog: any) => {
    const authorName = typeof blog.author === 'object' ? blog.author?.name : blog.author;
    const matchesSearch = (blog.title?.toLowerCase().includes(search.toLowerCase()) || false) || 
                          (authorName?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <PageHeader 
          title="Blog Yönetimi"
          description="Kurumsal blog yazılarını yönetin, yeni içerikler paylaşın ve dinamik yapıyı koruyun."
          icon={<BookOpen />}
        />
        <Link href="/dashboard/admin/blog/new">
          <button className="px-8 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
            <Plus size={18} />
            YENI YAZI EKLE
          </button>
        </Link>
      </div>

      {/* Kontrol Paneli */}
      <DashboardCard className="p-6 mb-10 !rounded-[2rem]">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative group flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Yazı başlığı ile ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-slate-300"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <select 
               value={category}
               onChange={(e) => setCategory(e.target.value)}
               className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all cursor-pointer uppercase tracking-widest min-w-[160px]"
             >
               <option value="all">TÜM KATEGORİLER</option>
               <option value="Eğitim">EĞİTİM</option>
               <option value="Haber">HABER</option>
               <option value="Duyuru">DUYURU</option>
               <option value="Etkinlik">ETKİNLİK</option>
             </select>

             <div className="hidden lg:flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-3 rounded-xl transition-all ${viewType === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ListIcon size={18} />
                </button>
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-3 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={18} />
                </button>
             </div>
          </div>
        </div>
      </DashboardCard>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-slate-300 font-black text-xs uppercase tracking-widest italic">Veriler Hazırlanıyor...</div>
      ) : (
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          <AnimatePresence mode='popLayout'>
            {filteredBlogs.map((blog: any) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 transition-all overflow-hidden group ${viewType === 'list' ? 'p-6 flex flex-col lg:flex-row items-center justify-between gap-8' : ''}`}
              >
                {/* Image Section */}
                <div className={`${viewType === 'list' ? 'w-24 h-24 rounded-2xl' : 'aspect-video w-full'} bg-slate-50 overflow-hidden relative shrink-0`}>
                   <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={blog.title} />
                   <div className="absolute top-3 right-3">
                      <StatusBadge status={blog.status} />
                   </div>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{blog.category || 'GÜNCEL'}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10} /> {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className={`font-black text-slate-900 tracking-tight leading-tight group-hover:text-orange-600 transition-colors ${viewType === 'list' ? 'text-lg' : 'text-xl mb-4'}`}>
                    {blog.title}
                  </h3>
                  {viewType === 'list' && (
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><User size={12} className="text-slate-300" /> {typeof blog.author === 'object' ? blog.author?.name : blog.author}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-3 ${viewType === 'grid' ? 'p-6 pt-2 border-t border-slate-50' : ''}`}>
                   <div className="flex-1 flex gap-2">
                      <button 
                        onClick={() => handleStatusToggle(blog.id, blog.status)}
                        className={`px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${blog.status === 'published' ? 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                      >
                         {blog.status === 'published' ? 'TASLAĞA ÇEK' : 'YAYINLA'}
                      </button>
                      <Link href={`/dashboard/admin/blog/${blog.id}/edit`} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </Link>
                   </div>
                   <button 
                    onClick={() => handleDelete(blog.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredBlogs.length === 0 && (
            <div className="col-span-full py-32 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <BookOpen size={40} />
               </div>
               <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Yazı bulunamadı.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
