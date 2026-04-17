"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Briefcase, 
  Type, 
  FileText, 
  Globe,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Lütfen proje adını girin.');

    setLoading(true);
    try {
      await api.post('/projects', formData);
      toast.success('Proje başarıyla oluşturuldu!');
      router.push('/dashboard/admin/projects');
    } catch (err) {
      toast.error('Proje oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/dashboard/admin" 
        className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Panele Dön
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
             <Briefcase size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Yeni Proje Oluştur</h1>
            <p className="text-slate-500 font-medium">KADEME bünyesine yeni bir faaliyet alanı ekleyin.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                <div className="flex items-center"><Type size={14} className="mr-2" /> PROJE ADI</div>
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Örn: Pergel Fellowship Programı"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-8 py-5 text-lg font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                <div className="flex items-center"><FileText size={14} className="mr-2" /> PROJE AÇIKLAMASI</div>
              </label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Projenin amacı, kapsamı ve hedefleri hakkında detaylı bilgi verin..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-8 py-5 text-sm font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <Globe className="text-slate-400" size={20} />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Proje Durumu</div>
                  <div className="text-xs text-slate-500">Bu proje şu an başvurulara açık mı?</div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                className={`w-14 h-8 rounded-full transition-all relative ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.is_active ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl flex items-center justify-center space-x-3 hover:bg-yellow-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">KAYDEDİLİYOR...</span>
            ) : (
              <>
                <Save size={20} />
                <span>PROJEYİ YAYINLA</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
