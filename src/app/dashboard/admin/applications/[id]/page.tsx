"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText,
  BadgeCheck,
  Building
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const res = await api.get('/applications');
      const app = res.data.find((a: any) => a.id === parseInt(params.id as string));
      setApplication(app);
    } catch (err) {
      toast.error('Başvuru yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await api.put(`/applications/${params.id}/status`, { status });
      toast.success(`Başvuru durumu '${status}' olarak güncellendi.`);
      router.push('/dashboard/admin/applications');
    } catch (err) {
      toast.error('İşlem başarısız oldu.');
    }
  };

  if (loading) return <div className="p-12 text-center animate-pulse font-black text-slate-400">YÜKLENİYOR...</div>;
  if (!application) return <div className="p-12 text-center font-black text-red-500">BAŞVURU BULUNAMADI</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard/admin/applications" className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Başvurulara Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon: Kişisel Bilgiler */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center text-slate-400 mb-6">
                 <User size={48} />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{application.user?.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{application.project?.name}</p>
              
              <div className="mt-8 space-y-4 text-left">
                 <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span>{application.user?.email}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>{application.user?.phone || 'Belirtilmedi'}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                    <Building size={16} className="text-slate-400" />
                    <span>{application.user?.university || 'Üniversite Bilgisi Yok'}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Sağ Kolon: Başvuru Detayı & Karar */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                 <FileText size={16} className="mr-2" /> MOTİVASYON MEKTUBU
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                 {application.motivation_letter || 'Başvuru sahibi herhangi bir motivasyon metni girmedi.'}
              </div>

              <div className="mt-12">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">BAŞVURU KARARI (Section 10.2)</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                       onClick={() => handleStatusUpdate('accepted')}
                       className="flex items-center justify-center space-x-2 bg-emerald-500 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                       <CheckCircle size={18} />
                       <span>KABUL ET</span>
                    </button>
                    <button 
                       onClick={() => handleStatusUpdate('waitlisted')}
                       className="flex items-center justify-center space-x-2 bg-yellow-500 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
                    >
                       <Clock size={18} />
                       <span>YEDEĞE AL</span>
                    </button>
                    <button 
                       onClick={() => handleStatusUpdate('rejected')}
                       className="flex items-center justify-center space-x-2 bg-red-500 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                    >
                       <XCircle size={18} />
                       <span>REDDET</span>
                    </button>
                 </div>
                 <p className="mt-6 text-[10px] text-slate-400 font-bold leading-tight">
                    * Başvuru kabul edildiğinde kullanıcı otomatik olarak "Katılımcı" statüsüne geçirilecek ve dijital cv alanı oluşturulacaktır. (Section 11)
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
