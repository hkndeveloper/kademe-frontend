"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  Award, 
  Activity, 
  Mail, 
  Phone, 
  Building,
  ShieldCheck,
  CreditCard,
  FileText,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ParticipantDetailPage() {
  const params = useParams();
  const [participant, setParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipant();
  }, [params.id]);

  const fetchParticipant = async () => {
    try {
      const res = await api.get(`/participants/${params.id}`);
      setParticipant(res.data);
    } catch (err) {
      console.error('Veri çekilemedi');
      toast.error("Katılımcı bilgileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center font-black animate-pulse text-slate-400 uppercase tracking-widest text-xs italic">Veriler Hazırlanıyor...</div>;
  if (!participant) return <div className="p-12 text-center font-black text-red-500 uppercase tracking-widest text-xs italic">KATILIMCI BULUNAMADI</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard/admin/participants" className="inline-flex items-center text-xs font-black text-slate-400 hover:text-orange-500 mb-8 transition-colors uppercase tracking-widest">
        <ArrowLeft size={16} className="mr-2" /> Katılımcı Listesine Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sol Panel: Kimlik Kartı */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-slate-900 rounded-[2rem] mx-auto flex items-center justify-center text-white mb-6 shadow-2xl">
                 <User size={48} />
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{participant.user?.name}</h2>
              <span className={`mt-4 inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${participant.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                 {participant.status === 'active' ? 'AKTİF ÖĞRENCİ' : participant.status.toUpperCase()}
              </span>

              <div className="mt-10 space-y-6 text-left border-t pt-8 border-slate-50">
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                       <Mail size={12} className="mr-2 text-orange-500" /> E-POSTA
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">{participant.user?.email}</div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                       <Phone size={12} className="mr-2 text-orange-500" /> TELEFON
                    </div>
                    <div className="text-xs font-bold text-slate-900">{participant.phone || 'Girilmemiş'}</div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                       <Building size={12} className="mr-2 text-orange-500" /> ÜNİVERSİTE
                    </div>
                    <div className="text-xs font-bold text-slate-900">{participant.university}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">{participant.department}</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Sağ Panel: Detaylar */}
        <div className="lg:col-span-3 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={CreditCard} label="MEVCUT KREDİ" value={participant.credits} color="text-slate-900" />
              <StatCard icon={Award} label="KAZANILAN ROZETLER" value={participant.badges_count || 0} color="text-orange-500" />
              <StatCard icon={Activity} label="FAALİYET KATILIMI" value={participant.attendances_count || 0} color="text-blue-600" />
           </div>

           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm min-h-[500px]">
              <div className="flex justify-between items-center mb-12">
                 <h2 className="text-xl font-black text-slate-900 flex items-center tracking-tighter uppercase">
                    <ShieldCheck className="mr-3 text-emerald-500" size={24} /> Kazanımlar & CV Geçmişi
                 </h2>
                 {participant.cv_uuid && (
                    <Link href={`/cv/${participant.cv_uuid}`} target="_blank">
                        <button className="flex items-center gap-2 bg-slate-900 text-white text-[10px] py-2.5 px-6 font-black tracking-widest uppercase rounded-xl hover:bg-orange-500 transition-all shadow-xl shadow-slate-900/10">
                            CV GÖRÜNTÜLE <ExternalLink size={14} />
                        </button>
                    </Link>
                 )}
              </div>

              <div className="space-y-8">
                 <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Briefcase size={14} className="text-slate-300" /> Kayıtlı Olduğu Projeler
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {participant.user?.applications?.filter((a: any) => a.status === 'accepted').map((app: any) => (
                             <div key={app.id} className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-white border border-transparent hover:border-orange-100 transition-all">
                                <div className="flex items-center space-x-6">
                                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 group-hover:text-orange-500 transition-colors">
                                      <Briefcase size={22} />
                                   </div>
                                   <div>
                                      <div className="text-sm font-bold text-slate-900">{app.project?.name}</div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{app.project?.project_code || 'KADEME-PROJE'} · {new Date(app.created_at).getFullYear()}</div>
                                   </div>
                                </div>
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-tight">KAYITLI</span>
                             </div>
                        ))}
                        {(!participant.user?.applications?.find((a: any) => a.status === 'accepted')) && (
                            <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2rem] text-slate-300 text-xs font-bold uppercase tracking-widest">Henüz Onaylanmış Proje Bulunmuyor</div>
                        )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all">
       <div className="relative z-10">
          <div className="p-3 bg-slate-50 rounded-xl w-fit mb-6 group-hover:bg-orange-50 transition-colors">
             <Icon size={20} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
          <div className={`text-4xl font-black ${color} tracking-tighter`}>{value}</div>
       </div>
    </div>
  );
}
