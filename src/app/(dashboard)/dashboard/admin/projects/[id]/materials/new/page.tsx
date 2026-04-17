"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Video, 
  Image as ImageIcon,
  Link as LinkIcon,
  UploadCloud
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';

export default function NewMaterialPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('document');
  const [formData, setFormData] = useState({
    title: '',
    type: 'document',
    content: '', // URL veya dosya yolu
    is_public: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return toast.error('Lütfen tüm alanları doldurun.');

    setLoading(true);
    try {
      await api.post(`/projects/${params.id}/materials`, { ...formData, type });
      toast.success('Materyal başarıyla eklendi!');
      router.push(`/dashboard/admin/projects/${params.id}/materials`);
    } catch (err) {
      toast.error('Materyal eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href={`/dashboard/admin/projects/${params.id}/materials`}
        className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Materyallere Dön
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
             <UploadCloud size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Yeni Materyal Ekle</h1>
            <p className="text-slate-500 font-medium">Katılımcılar için eğitim materyali veya kaynak yükleyin.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           {/* Tip Seçimi */}
           <div className="flex space-x-4">
              {[
                { id: 'document', icon: FileText, label: 'DOSYA / PDF' },
                { id: 'video', icon: Video, label: 'VİDEO (YOUTUBE)' },
                { id: 'image', icon: ImageIcon, label: 'GÖRSEL' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id)}
                  className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${type === item.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}
                >
                  <item.icon size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
           </div>

           <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">MATERYAL BAŞLIĞI</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Örn: Hafta 1 Sunumu"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                  {type === 'video' ? 'YOUTUBE URL' : 'İÇERİK URL / DOSYA YOLU'}
                </label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder={type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-medium"
                  />
                </div>
              </div>
           </div>

           <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl flex items-center justify-center space-x-3 hover:bg-yellow-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">YÜKLENİYOR...</span>
                ) : (
                  <>
                    <Save size={20} />
                    <span>MATERYALİ KAYDET</span>
                  </>
                )}
           </button>
        </form>
      </div>
    </div>
  );
}
