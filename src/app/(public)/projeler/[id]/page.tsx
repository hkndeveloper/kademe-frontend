"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Users, BookOpen, MapPin, Clock, Download, ArrowLeft, FileText, Star, Trophy, Award, GraduationCap, ChevronRight, Globe } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch project
    api.get(`/public-projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => {});

    // Fetch user context
    const token = localStorage.getItem("kademe_token");
    if (token) {
      api.get("/user")
        .then((res) => setUser(res.data.user))
        .catch(() => {});
    }
    setLoading(false);
  }, [id]);

  const hasApplied = user?.applications?.find((app: any) => app.project_id === Number(id));

  // Mock "Ayın Yıldızı" (Will be dynamic in Phase 5)
  const monthlyStar = {
    name: "Enes Güçlü",
    school: "Selçuk Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    badges: ["Katılım %100", "En İyi Sunum", "Takım Lideri"],
    image: null
  };

  if (loading) return <div className="min-h-screen pt-40 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Proje Yükleniyor...</div>;
  if (!project) return <div className="min-h-screen pt-40 text-center text-slate-400 font-bold">Proje bulunamadı. <br /> <Link href="/projeler" className="text-orange-500 underline mt-4 inline-block">Geri Dön</Link></div>;

  const isClosed = project.project?.application_deadline && new Date(project.project.application_deadline) < new Date();

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
           <img 
            src={project.project?.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80"} 
            className="w-full h-full object-cover opacity-20 grayscale brightness-75" 
            alt="Hero" 
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-20">
          <Link href="/projeler" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] mb-12">
            <ArrowLeft size={14} /> Tüm Programlar
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-16 items-start">
             <div className="flex-1">
                <span className="inline-flex text-[9px] font-black px-4 py-1.5 rounded-full bg-orange-500 text-white uppercase tracking-[0.2em] mb-8">
                  {project.project?.is_active ? "AKTİF PROGRAM" : "DÖNEMLİK ARŞİV"}
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-6">
                  {project.project?.name || project.name}
                </h1>
                <p className="text-xl text-orange-500 font-black tracking-tight mb-8 uppercase italic border-l-4 border-orange-500 pl-6">
                  {project.project?.sub_description || "Gençliğin Gelişim Ekosistemi"}
                </p>
                
                <div className="flex flex-wrap gap-10 mt-12">
                  <StatItem icon={Users} label="KATILIMCI" value={project.participants?.length || 0} />
                  <StatItem icon={MapPin} label="KONUM" value={project.project?.location || "Konya / Hibrit"} />
                  <StatItem icon={Calendar} label="DÖNEM" value={project.project?.period || "2026 Güz"} />
                </div>
             </div>

             {/* Application Card */}
             <div className="w-full lg:w-96 bg-white rounded-[3.5rem] p-10 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-6 rounded-[2rem] shadow-xl rotate-12 hidden md:block">
                  <Star size={32} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Kayıt Olun</h3>
                <p className="text-sm text-slate-400 font-medium mb-10">Geleceğinize yatırım yapın.</p>
                
                <div className="space-y-6 mb-10">
                   <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-4">
                      <span className="font-bold text-slate-400 uppercase tracking-widest">Başvuru Bitiş</span>
                      <span className="font-black text-slate-900">{isClosed ? 'Kapandı' : '15 Mart 2026'}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-4">
                      <span className="font-bold text-slate-400 uppercase tracking-widest">Kapasite</span>
                      <span className="font-black text-slate-900">{project.project?.capacity || 50} Kişi</span>
                   </div>
                </div>

                {hasApplied ? (
                   <button disabled className="w-full py-5 bg-slate-900 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest opacity-50">
                      BAŞVURUNUZ ALINDI
                   </button>
                ) : isClosed ? (
                  <button disabled className="w-full py-5 bg-red-50 text-red-500 font-black text-[11px] rounded-2xl uppercase tracking-widest">
                      BAŞVURULAR KAPANDI
                  </button>
                ) : (
                  <Link href={`/basvuru?project_id=${id}`}>
                    <button className="w-full py-5 bg-orange-500 text-white font-black text-[11px] rounded-2xl uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
                      ŞİMDİ BAŞVUR
                    </button>
                  </Link>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* About & Features */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 mb-10 tracking-tighter">
                <BookOpen className="text-orange-500" size={32} /> Program Hakkında Detaylar
              </h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-500 font-medium leading-relaxed mb-20">
                <p>{project.project?.description || project.description}</p>
                <p>Program süresince katılımcılar hem teorik eğitimler alacak hem de saha uygulamalarıyla yetkinliklerini test etme fırsatı bulacaklardır.</p>
              </div>

              {/* Monthly Star - Highlight Segment */}
              <div className="bg-slate-50 rounded-[4rem] p-12 lg:p-20 border border-slate-100 relative overflow-hidden mb-32">
                 <div className="absolute top-0 right-0 p-12 text-slate-100 opacity-40">
                   <Trophy size={160} />
                 </div>
                 <div className="relative z-10">
                    <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 inline-block">AYIN BAŞARI ÖYKÜSÜ</span>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                       <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center relative border-4 border-white overflow-hidden">
                          {monthlyStar.image ? <img src={monthlyStar.image} alt={monthlyStar.name} /> : <div className="text-4xl font-black text-slate-200 uppercase">EG</div>}
                          <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-tl-xl"><Award size={16} /></div>
                       </div>
                       <div>
                          <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{monthlyStar.name}</h4>
                          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-6">{monthlyStar.school} | {monthlyStar.department}</p>
                          <div className="flex flex-wrap gap-3">
                             {monthlyStar.badges.map(b => (
                               <span key={b} className="bg-white px-4 py-2 rounded-xl text-[9px] font-black text-slate-900 shadow-sm border border-slate-100 uppercase tracking-widest">{b}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Program Timeline */}
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 mb-12 tracking-tighter">
                <Calendar className="text-orange-500" size={32} /> Program Akışı
              </h2>
              <div className="space-y-4 mb-32">
                 {(project.project?.timeline || project.timeline || [1,2,3]).map((item: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-orange-500/20 hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-slate-50 text-slate-400 font-black rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">{i+1}</div>
                         <div className="font-black text-lg text-slate-900 tracking-tight">{item.label || 'Eğitim Modülü'}</div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">{item.date || 'Mart 2026'}</span>
                   </div>
                 ))}
              </div>

              {/* Participant Grid */}
              <div className="flex items-end justify-between mb-12">
                 <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter leading-none">
                   <Users className="text-orange-500" size={32} /> Mevcut Katılımcılar
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {(project.participants || [1,2,3,4]).map((p: any, i: number) => (
                   <div key={i} className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:shadow-xl transition-all flex items-center gap-6 group">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-black text-2xl group-hover:bg-slate-950 group-hover:text-white transition-all">
                        {p.name ? p.name.charAt(0) : 'P'}
                      </div>
                      <div>
                         <div className="font-black text-slate-900 uppercase tracking-wide">{p.name || 'Gizli Katılımcı'}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                           {p.university || 'Selçuk Üniversitesi'} {p.is_alumni ? '• KADEME Mezunu' : ''}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Side Assets */}
            <div className="space-y-12">
               {/* Alumni Gallery Snippet */}
               <div className="bg-slate-950 rounded-[3rem] p-10 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent z-0" />
                  <div className="relative z-10">
                     <GraduationCap className="mx-auto mb-6 text-orange-500" size={48} />
                     <h4 className="text-white font-black text-2xl tracking-tighter mb-4">Mezun Galerisi</h4>
                     <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">Önceki dönemlerde bu programı başarıyla tamamlayanların başarı hikayeleri.</p>
                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:border-orange-500 transition-all">GALERİYİ GÖR</button>
                  </div>
               </div>

               {/* Materials */}
               <div className="p-10 bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[3rem]">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                    <FileText className="text-orange-500" size={16} /> PROGRAM DÖKÜMANLARI
                  </h4>
                  <div className="space-y-4">
                     {[1,2].map(i => (
                       <button key={i} className="w-full p-4 bg-slate-50 rounded-2xl text-left hover:bg-slate-950 group transition-all">
                          <div className="flex items-center justify-between">
                             <span className="text-[11px] font-bold text-slate-600 group-hover:text-white uppercase">Program Rehberi v2.pdf</span>
                             <Download size={16} className="text-slate-300 group-hover:text-orange-500" />
                          </div>
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-2">
       <div className="flex items-center gap-2 text-orange-500">
         <Icon size={16} />
         <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
       </div>
       <div className="text-2xl font-black text-white tracking-tight">{value}</div>
    </div>
  );
}
