"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  ImageIcon, 
  Type, 
  FileText, 
  Hash, 
  ChevronDown,
  Sparkles,
  Loader2,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from "sonner";

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "Haber",
    status: "published",
    tags: "",
    is_featured: false
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/admin/blogs/${params.id}`);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Yazı yüklenemedi.");
        router.push('/dashboard/admin/blog');
      }
    };
    if (params.id) fetchPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.put(`/admin/blogs/${params.id}`, formData);
      toast.success("Yazı başarıyla güncellendi!");
      router.push('/dashboard/admin/blog');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    
    try {
      await api.delete(`/admin/blogs/${params.id}`);
      toast.success("Yazı silindi.");
      router.push('/dashboard/admin/blog');
    } catch (err) {
      toast.error("Silinemedi.");
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-slate-400" size={40} /></div>;

  return (
    <div className="max-w-7xl pb-32 font-sans">
      <div className="flex items-center justify-between mb-12 sticky top-0 bg-white/80 backdrop-blur-md z-30 py-4 border-b border-slate-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/admin/blog" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Yazıyı Düzenle</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KADEME Blog Ekosistemi</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> GÜNCELLE</>}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Yazı Başlığı..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full text-4xl md:text-5xl font-black text-slate-900 placeholder:text-slate-100 border-none outline-none bg-transparent tracking-tighter focus:placeholder:text-slate-50 transition-all"
            />
            <div className="flex items-center gap-2 text-slate-300 font-mono text-[10px] bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
               <span>URL: /{formData.slug}</span>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={18} className="text-orange-500" />
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Öz / Özet</label>
            </div>
            <textarea 
              rows={3}
              placeholder="Yazının kısa bir özetini buraya yazın..."
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              className="w-full bg-transparent border-none outline-none text-slate-600 font-medium text-base resize-none"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 px-4">
               <Type size={18} className="text-orange-500" />
               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">İçerik</label>
            </div>
            <textarea 
              rows={25}
              placeholder="Hikayenizi anlatın..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm outline-none focus:ring-4 focus:ring-slate-50 transition-all text-lg text-slate-600 leading-relaxed font-medium"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Kategori</label>
                <div className="relative group">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/10 appearance-none transition-all uppercase tracking-widest"
                  >
                    <option value="Haber">HABER</option>
                    <option value="Duyuru">DUYURU</option>
                    <option value="Etkinlik">ETKİNLİK</option>
                    <option value="Eğitim">EĞİTİM</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" size={16} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Etiketler</label>
                <div className="relative group">
                  <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="virgülle ayırın..."
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ÖNE ÇIKARILMIŞ YAZI</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                      className={`w-12 h-6 rounded-full transition-all relative ${formData.is_featured ? 'bg-orange-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_featured ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-red-50/50 border border-red-100 rounded-[3rem] text-center">
              <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mb-4">KRİTİK ALAN</p>
              <button 
                type="button"
                onClick={handleDelete}
                className="text-[10px] font-black text-red-600 hover:text-red-700 flex items-center gap-2 mx-auto transition-colors"
              >
                <Trash2 size={14} /> YAZIYI SİL
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
