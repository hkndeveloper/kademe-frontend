"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText,
  Building
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';

// UI Core Bileşenleri
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatusBadge from '@/components/dashboard/StatusBadge';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  const fetchApplication = async () => {
    try {
      const res = await api.get('/applications');
      const app = res.data.find((a: any) => a.id === parseInt(params.id as string));
      setApplication(app);
    } catch (err) {
      toast.error('Başvuru bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await api.put(`/applications/${params.id}/status`, { status });
      toast.success(`Başvuru durumu ${status.toUpperCase()} olarak güncellendi.`);
      
      // UI'ı anlık güncellemek için state'i setle, sonra yönlendir
      setApplication((prev: any) => ({ ...prev, status }));
      
      setTimeout(() => {
        router.push('/dashboard/admin/applications');
      }, 1000);
    } catch (err) {
      toast.error('İşlem gerçekleştirilemedi.');
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-gray-300 uppercase tracking-widest italic">Yükleniyor...</div>;
  if (!application) return <div className="p-20 text-center font-black text-red-500 uppercase tracking-widest">BAŞVURU BULUNAMADI</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <PageHeader 
        title="Başvuru Detayı"
        description="Adayın motivasyon mektubunu ve bilgilerini inceleyerek karar verin."
        backLink="/dashboard/admin/applications"
        backText="Başvurulara Dön"
        icon={<User />}
        badge={<StatusBadge status={application.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sol Kolon: Kişisel Bilgiler */}
        <div className="lg:col-span-1 space-y-8">
           <DashboardCard className="p-10 text-center">
              <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-[2.5rem] mx-auto flex items-center justify-center text-gray-400 mb-8 shadow-sm">
                 <User size={48} />
              </div>
              <h2 className="text-xl font-black text-gray-900 leading-tight mb-2">{application.user?.name}</h2>
              <div className="inline-block px-4 py-1.5 bg-orange-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest mb-10">
                {application.project?.name}
              </div>
              
              <div className="space-y-6 text-left border-t border-gray-50 pt-10">
                 <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <Mail size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{application.user?.email}</span>
                 </div>
                 <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <Phone size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{application.user?.phone || 'Belirtilmedi'}</span>
                 </div>
                 <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <Building size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 line-clamp-1">{application.user?.university || 'Bilgi Yok'}</span>
                 </div>
              </div>
           </DashboardCard>
        </div>

        {/* Sağ Kolon: Başvuru Detayı & Karar */}
        <div className="lg:col-span-2 space-y-8">
           <DashboardCard className="p-10">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                 <FileText size={18} /> MOTİVASYON MEKTUBU
              </h3>
              <div className="bg-gray-50 p-8 rounded-[2rem] text-gray-600 leading-relaxed font-medium italic border border-gray-100/50">
                 "{application.motivation_letter || 'Başvuru sahibi herhangi bir motivasyon metni girmedi.'}"
              </div>

              <div className="mt-12 pt-12 border-t border-gray-50">
                 <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-8">BAŞVURU KARARI</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                       onClick={() => handleStatusUpdate('accepted')}
                       className="flex items-center justify-center gap-3 bg-emerald-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                    >
                       <CheckCircle size={18} />
                       KABUL ET
                    </button>
                    <button 
                       onClick={() => handleStatusUpdate('waitlisted')}
                       className="flex items-center justify-center gap-3 bg-amber-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20"
                    >
                       <Clock size={18} />
                       YEDEĞE AL
                    </button>
                    <button 
                       onClick={() => handleStatusUpdate('rejected')}
                       className="flex items-center justify-center gap-3 bg-red-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                    >
                       <XCircle size={18} />
                       REDDET
                    </button>
                 </div>
                 <p className="mt-8 text-[10px] text-gray-400 font-bold leading-relaxed pr-10 italic">
                    * Karar verdiğinizde katılımcıya otomatik SMS/E-posta bilgilendirmesi yapılacak ve statüsü anlık olarak güncellenecektir.
                 </p>
              </div>
           </DashboardCard>
        </div>
      </div>
    </div>
  );
}
  );
}
