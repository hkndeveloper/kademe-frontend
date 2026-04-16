"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Award, 
  ShieldCheck, 
  GraduationCap, 
  History,
  CheckCircle,
  Globe,
  Printer,
  FileText,
  BadgeCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';

export default function PublicCV() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicCV = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await axios.get(`${apiUrl}/cv/${params.publicId}`);
        setData(res.data);
      } catch (err) {
        console.error('CV çekilemedi:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (params.publicId) fetchPublicCV();
  }, [params.publicId]);

  if (loading) return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold animate-pulse">KADEME Doğrulanıyor...</p>
      </div>
  );

  if (error) return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl max-w-md">
              <h1 className="text-2xl font-black text-slate-900 mb-4">CV Bulunamadı</h1>
              <p className="text-slate-500 mb-8">Bu profil gizli olabilir veya bağlantı hatalıdır.</p>
              <a href="/" className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold transition-all hover:bg-orange-600">KADEME Ana Sayfası</a>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 md:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Verification Strip */}
        <div className="bg-orange-500 text-white px-8 py-4 rounded-t-[2.5rem] flex items-center justify-center space-x-3 text-xs md:text-sm font-black uppercase tracking-widest shadow-xl">
           <ShieldCheck size={20} />
           <span>BU DİJİTAL PROFİL KADEME YÖNETİM SİSTEMİ TARAFINDAN RESMİ OLARAK DOĞRULANMIŞTIR</span>
        </div>

        <div className="bg-white shadow-2xl rounded-b-[3rem] overflow-hidden flex flex-col md:flex-row min-h-[900px]">
          {/* Left Panel */}
          <div className="md:w-[350px] bg-[#1a1c23] text-white p-10 flex flex-col items-center border-r border-white/5">
             <div className="relative mb-10">
                 <div className="w-36 h-36 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-orange-500/20">
                     {data.name.charAt(0)}
                 </div>
                 {data.is_graduated && (
                    <div className="absolute -bottom-3 -right-3 bg-white text-orange-600 p-2 rounded-2xl shadow-xl">
                        <BadgeCheck size={28} />
                    </div>
                 )}
             </div>
             
             <h1 className="text-2xl font-black text-center mb-2 uppercase tracking-tight">{data.name}</h1>
             <div className="h-1.5 w-12 bg-orange-500 rounded-full mb-6"></div>
             
             {data.is_graduated ? (
                <div className="flex items-center space-x-2 text-orange-400 font-bold text-xs uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-full mb-10">
                    <GraduationCap size={16} />
                    <span>ONAYLI MEZUN</span>
                </div>
             ) : (
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10">AKTİF KATILIMCI</div>
             )}

             <div className="w-full space-y-8 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">PROJE KREDİSİ</span>
                    <span className="text-4xl font-black text-white">{data.credits}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">KAZANILAN ROZETLER</span>
                    <div className="flex justify-center -space-x-2 mt-2">
                        {data.badges?.slice(0, 5).map((b: any, i: number) => (
                            <div key={i} className="w-10 h-10 bg-white/5 rounded-full border-2 border-[#1a1c23] flex items-center justify-center shadow-lg" title={b.name}>
                                <Award size={18} className="text-orange-400" />
                            </div>
                        ))}
                        {data.badges?.length > 5 && (
                            <div className="w-10 h-10 bg-orange-500 text-white rounded-full border-2 border-[#1a1c23] flex items-center justify-center text-[10px] font-bold">
                                +{data.badges.length - 5}
                            </div>
                        )}
                    </div>
                </div>
             </div>

             <div className="mt-auto pt-20 flex flex-col items-center text-center">
                <div className="bg-white p-3 rounded-3xl mb-4 shadow-2xl">
                    <img src={data.qr_code} alt="Verification QR" className="w-32 h-32" />
                </div>
                <div className="text-[9px] text-gray-500 font-mono tracking-wider">DOĞRULAMA KODU: {data.certificate_id || 'KADEME-UNVERIFIED'}</div>
                <div className="text-[9px] text-gray-500 font-mono mt-1 uppercase">SON GÜNCELLEME: {data.verified_at}</div>
             </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-10 md:p-16 bg-white shrink-0">
             <div className="flex justify-between items-start mb-16">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/20">K</div>
                    <div>
                        <span className="font-black text-2xl tracking-tighter text-slate-900 block leading-none">KADEME</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em]">VERIFIED PROFILE</span>
                    </div>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all text-orange-600 shadow-sm"
                >
                    <Printer size={22} />
                </button>
             </div>

             {/* Header Info Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                        <GraduationCap className="mr-3 text-orange-500" size={18} /> AKADEMİK BİLGİLER
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <div className="font-bold text-slate-900 text-lg mb-1">{data.university}</div>
                        <div className="text-slate-500 font-medium text-sm">{data.department}</div>
                    </div>
                </div>
                <div>
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                        <Calendar className="mr-3 text-orange-500" size={18} /> ÖZET İSTATİSTİKLER
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100 text-center">
                            <div className="text-xl font-black text-orange-600">{data.stats?.total_attendance}</div>
                            <div className="text-[9px] font-bold text-orange-800 uppercase">YOKLAMA</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-3xl border border-gray-100 text-center">
                            <div className="text-xl font-black text-slate-800">{data.stats?.completed_projects}</div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase">PROJE</div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Program History */}
             <section className="mb-16">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                   <History className="mr-3 text-orange-500" size={18} /> PROGRAM VE FAALİYET GEÇMİŞİ
                </h3>
                <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 divide-y divide-gray-100">
                   {data.history?.map((h: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-6 transition-colors hover:bg-white first:rounded-t-[2rem] last:rounded-b-[2rem]">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-orange-500 shadow-sm">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{h.project_name}</div>
                                <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{h.date}</div>
                            </div>
                         </div>
                         <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${h.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                            {h.status}
                         </div>
                      </div>
                   ))}
                   {data.history?.length === 0 && (
                      <div className="p-10 text-center text-gray-400 font-medium italic">Kayıtlı program bulunmamaktadır.</div>
                   )}
                </div>
             </section>

             {/* Badges */}
             <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                   <Award className="mr-3 text-orange-500" size={18} /> KADEME YETERLİLİK ROZETLERİ
                </h3>
                <div className="flex flex-wrap gap-3">
                   {data.badges?.map((b: any) => (
                      <div key={b.id} className="group relative pr-6 py-3 pl-4 bg-slate-900 text-white text-[11px] font-black rounded-2xl uppercase tracking-wider flex items-center transition-all hover:scale-105 hover:bg-black shadow-lg">
                         <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform">
                             <Award size={14} className="text-white" />
                         </div>
                         {b.name}
                      </div>
                   ))}
                </div>
             </section>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12 text-[10px] font-bold text-gray-400">
           <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm"><ShieldCheck size={16} className="mr-2 text-emerald-500" /> RESMİ DİJİTAL BELGE NİTELİĞİNDEDİR</div>
           <div className="flex items-center"><Globe size={16} className="mr-2" /> kademe.org/verify üzerinden sorgulanabilir</div>
        </div>
      </div>
    </div>
  );
}
