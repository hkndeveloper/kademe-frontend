"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  MapPin, 
  Download, 
  ArrowLeft, 
  FileText, 
  Star, 
  Trophy, 
  Award, 
  GraduationCap, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Medal
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Image from "next/image";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
    fetchUserContext();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const res = await api.get(`/public-projects/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Project detail fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContext = async () => {
    const token = localStorage.getItem("kademe_token");
    if (token) {
      api.get("/user")
        .then((res) => setUser(res.data.user))
        .catch(() => {});
    }
  };

  if (loading) return <div className="min-h-screen pt-40 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse italic">KADEME Yükleniyor...</div>;
  if (!data || !data.project) return <div className="min-h-screen pt-40 text-center text-slate-400 font-bold">Proje bulunamadı. <br /> <Link href="/projeler" className="text-orange-500 underline mt-4 inline-block">Geri Dön</Link></div>;

  const { project, participants, public_materials } = data;
  const isApplied = user?.applications?.some((app: any) => app.project_id === project.id);
  const isClosed = project.application_deadline && new Date(project.application_deadline) < new Date();
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-28 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
           {project.image && (
             <Image 
                src={`${storageUrl}/${project.image}`}
                fill 
                className="w-full h-full object-cover opacity-30 grayscale brightness-50 scale-105" 
                alt={project.name} 
             />
           )}
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-20">
          <Link href="/projeler" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.4em] mb-16">
            <ArrowLeft size={16} /> TÜM PROGRAMLAR
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-20 items-start">
             <div className="flex-1">
                <div className="flex items-center gap-4 mb-10">
                   <span className="inline-flex text-[9px] font-black px-5 py-2 rounded-full bg-orange-500 text-white uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/20">
                     {project.is_active ? "AKTİF PROGRAM" : "DÖNEMLİK ARŞİV"}
                   </span>
                   {project.application_deadline && (
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Son Başvuru: {new Date(project.application_deadline).toLocaleDateString()}</span>
                   )}
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-10 uppercase italic">
                   {project.name}
                </h1>
                <p className="text-2xl text-orange-500 font-black tracking-tight mb-12 uppercase italic border-l-4 border-orange-500 pl-8 leading-none">
                   {project.sub_description || "Geleceğin Liderlik Akademisi"}
                </p>
                
                <div className="flex flex-wrap gap-12 mt-16 pt-12 border-t border-white/5">
                  <StatItem icon={Users} label="ONAYLI KATILIMCI" value={`${participants?.length || 0} / ${project.capacity || 50}`} />
                  <StatItem icon={MapPin} label="OPERASYON MERKEZİ" value={project.location || "Hibrit"} />
                  <StatItem icon={Calendar} label="PROGRAM DÖNEMİ" value={project.period || "2026"} />
                </div>
             </div>

             {/* Application Card */}
             <div className="w-full lg:w-[400px] bg-white rounded-[4rem] p-12 shadow-3xl relative mt-10 lg:mt-0">
                <div className="absolute -top-6 -right-6 bg-slate-900 text-white w-20 h-20 rounded-[2rem] shadow-2xl flex items-center justify-center rotate-12">
                   <Medal size={40} className="text-orange-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-950 mb-3 tracking-tighter uppercase italic">Kayıt Olun</h3>
                <p className="text-sm text-slate-400 font-medium mb-12 leading-relaxed">Başvurunuzu yapın, mülakat sürecine dahil olun ve KADEME ekosistemine katılın.</p>
                
                <div className="space-y-6 mb-12">
                   <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-5">
                      <span className="font-black text-slate-300 uppercase tracking-widest">Sertifika Programı</span>
                      <span className="font-black text-slate-950 uppercase">DAHİL</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-5">
                      <span className="font-black text-slate-300 uppercase tracking-widest">Kontenjan</span>
                      <span className="font-black text-slate-950 uppercase">{project.capacity || 'Sınırlı'} KİŞİ</span>
                   </div>
                </div>

                {isApplied ? (
                   <div className="w-full py-6 bg-emerald-50 text-emerald-600 font-black text-xs rounded-2xl uppercase tracking-widest text-center flex items-center justify-center gap-2">
                      <ShieldCheck size={18} /> BAŞVURUNUZ SİSTEMDE
                   </div>
                ) : isClosed ? (
                   <div className="w-full py-6 bg-red-50 text-red-500 font-black text-xs rounded-2xl uppercase tracking-widest text-center border-2 border-dashed border-red-100">
                      KAYITLAR SONA ERDİ
                   </div>
                ) : (
                   <Link href={`/basvuru?project_id=${project.id}`} className="block">
                      <button className="w-full py-6 bg-slate-950 text-white font-black text-xs rounded-[2rem] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-2xl shadow-slate-950/20 group flex items-center justify-center gap-3">
                         KATILIM FORMU <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </Link>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-start">
            <div className="lg:col-span-2 space-y-32">
              
              {/* Description */}
              <div className="relative">
                 <div className="absolute -left-20 top-0 text-slate-50 font-black text-9xl -z-10 select-none">INFO</div>
                 <h2 className="text-4xl font-black text-slate-950 flex items-center gap-6 mb-12 tracking-tighter uppercase italic">
                    <BookOpen className="text-orange-500" size={40} /> Program Vizyonu
                 </h2>
                 <div className="prose prose-slate prose-xl max-w-none text-slate-600 font-medium leading-relaxed italic">
                    {project.description}
                 </div>
              </div>

              {/* Participants Grid - Dynamic */}
              <div>
                 <div className="flex items-end justify-between mb-16">
                    <h2 className="text-4xl font-black text-slate-950 flex items-center gap-6 tracking-tighter uppercase italic leading-none">
                       <Users className="text-orange-500" size={40} /> Program Katılımcıları
                    </h2>
                    {participants?.length > 0 && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{participants.length} AKTİF ÖĞRENCİ</span>
                    )}
                 </div>
                 
                 {participants?.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {participants.map((p: any) => (
                        <motion.div 
                          key={p.id} 
                          whileHover={{ y: -5 }}
                          className="p-8 rounded-[3rem] bg-white border border-slate-100 hover:shadow-2xl transition-all group flex flex-col gap-6"
                        >
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 font-black text-2xl group-hover:bg-slate-950 group-hover:text-white transition-all">
                                {p.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                 <div className="font-black text-slate-950 uppercase tracking-tighter text-lg leading-none mb-1 group-hover:text-orange-500 transition-colors italic">{p.name}</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                   {p.university} • {p.department}
                                 </div>
                              </div>
                              {p.is_alumni && (
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center" title="KADEME Mezunu">
                                   <ShieldCheck size={20} />
                                </div>
                              )}
                           </div>
                           
                           {/* Participant Badges */}
                           {p.badges && p.badges.length > 0 && (
                             <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                                {p.badges.map((badge: any) => (
                                   <div key={badge.id} className="px-3 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-slate-100 flex items-center gap-1.5">
                                      <Zap size={10} /> {badge.name}
                                   </div>
                                ))}
                             </div>
                           )}
                        </motion.div>
                      ))}
                   </div>
                 ) : (
                    <div className="p-20 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase tracking-widest italic">
                       Katılımcı listesi henüz ilan edilmedi.
                    </div>
                 )}
              </div>

              {/* Timeline (If available) */}
              {project.activities && project.activities.length > 0 && (
                <div>
                    <h2 className="text-4xl font-black text-slate-950 flex items-center gap-6 mb-16 tracking-tighter uppercase italic">
                       <CalendarIcon className="text-orange-500" size={40} /> Operasyonel Akış
                    </h2>
                    <div className="space-y-6">
                       {project.activities.map((act: any, idx: number) => (
                          <div key={act.id} className="p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-xl transition-all group flex items-center gap-8">
                             <div className="w-14 h-14 bg-slate-50 text-slate-300 font-black rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
                                {idx + 1}
                             </div>
                             <div className="flex-1">
                                <h4 className="font-black text-slate-950 text-lg uppercase tracking-tight italic group-hover:text-orange-600 transition-colors">{act.name}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> {new Date(act.start_time).toLocaleDateString('tr-TR')}</span>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> {act.location || 'Online'}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                </div>
              )}
            </div>

            {/* Side Column */}
            <div className="space-y-16">
               {/* Digital Archive */}
               <div className="bg-slate-950 rounded-[4rem] p-12 text-center relative overflow-hidden shadow-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-transparent z-0" />
                  <div className="relative z-10">
                     <GraduationCap className="mx-auto mb-8 text-orange-500" size={56} />
                     <h4 className="text-white font-black text-3xl tracking-tighter mb-4 uppercase italic">Mezuniyet <br/>Duvarda</h4>
                     <p className="text-slate-500 text-sm font-medium mb-12 leading-relaxed italic">Bu programdan mezun olan liderlerin dijital sertifikaları ve başarı kimlikleri.</p>
                     <button className="w-full py-5 bg-white text-slate-950 font-black text-[10px] rounded-[2rem] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">MEZUNLARI GÖR</button>
                  </div>
               </div>

               {/* Materials - Dynamic */}
               <div className="p-12 bg-white border border-slate-100 shadow-2xl rounded-[4rem]">
                  <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                    <FileText className="text-orange-500" size={20} /> HALKA AÇIK BELGELER
                  </h4>
                  <div className="space-y-4">
                     {public_materials && public_materials.length > 0 ? public_materials.map((mat: any) => (
                       <a key={mat.id} href={`${storageUrl}/${mat.file_path}`} target="_blank" className="block">
                          <button className="w-full p-6 bg-slate-50 rounded-3xl text-left hover:bg-slate-950 group transition-all flex items-center justify-between">
                             <div className="flex flex-col">
                                <span className="text-[11px] font-black text-slate-950 group-hover:text-white uppercase tracking-tight">{mat.title}</span>
                                <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">Döküman / PDF</span>
                             </div>
                             <Download size={18} className="text-slate-200 group-hover:text-orange-500 transition-colors" />
                          </button>
                       </a>
                     )) : (
                        <div className="py-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest italic border-2 border-dashed border-slate-50 rounded-3xl">Döküman bulunmuyor.</div>
                     )}
                  </div>
               </div>

               {/* QR & Support Integration */}
               <div className="p-10 bg-slate-900 rounded-[3rem] text-center border-t-8 border-orange-500 shadow-2xl">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
                     <Globe className="text-orange-500" size={32} />
                  </div>
                  <h4 className="text-white font-black text-lg mb-4 uppercase tracking-tighter italic">Bize Katılın</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed italic">Platform destekli eğitimlerimiz için bizi takip edin.</p>
                  <Link href="/sosyal-medya" className="text-orange-500 font-black text-[10px] uppercase tracking-widest hover:underline">SOSYAL MEDYA AKIŞI</Link>
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
    <div className="flex flex-col gap-3 group">
       <div className="flex items-center gap-3 text-orange-500/70 group-hover:text-orange-500 transition-colors">
         <Icon size={18} />
         <span className="text-[10px] font-black uppercase tracking-[0.4em]">{label}</span>
       </div>
       <div className="text-3xl font-black text-white tracking-widest uppercase italic group-hover:translate-x-1 transition-transform">{value}</div>
    </div>
  );
}
