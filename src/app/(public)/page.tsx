"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Camera,
  Star,
  Layers,
  HelpCircle,
  MapPin
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    sliders: [],
    pinned_projects: [],
    pinned_activities: [],
    instagram_posts: [],
    faqs: [],
    latest_posts: [],
    settings: {
      stats: {}
    }
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  useEffect(() => {
    if (data.sliders?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % data.sliders.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [data.sliders?.length]);

  const fetchHomeContent = async () => {
    try {
      const res = await api.get("/public-home");
      setData(res.data);
    } catch (err) {
      console.error("Content fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentSlider = data.sliders?.[currentSlide];
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "https://kademe-backend-production.up.railway.app/storage";

  const getStorageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    const cleanUrl = storageUrl.endsWith("/") ? storageUrl : `${storageUrl}/`;
    return `${cleanUrl}${cleanPath}`;
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-white font-black text-slate-950 uppercase tracking-widest animate-pulse italic">KADEME Yükleniyor...</div>;
  }

  return (
    <div className="bg-white">
      {/* Dynamic Hero Slider */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          {data.sliders?.length > 0 ? (
            <motion.div 
               key={currentSlide}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1 }}
               className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10" />
              {currentSlider.image_path && (
                <Image 
                  src={getStorageUrl(currentSlider.image_path)} 
                  fill
                  className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                  alt={currentSlider.title}
                  priority
                />
              )}
              
              <div className="max-w-6xl mx-auto px-6 relative z-20 w-full h-full flex items-center">
                 <motion.div
                   initial={{ opacity: 0, x: -30 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.8, delay: 0.3 }}
                   className="max-w-3xl"
                 >
                    <span className="inline-flex items-center gap-2 text-[10px] font-black text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full mb-8 uppercase tracking-[0.2em] border border-orange-500/20">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                      ÖNE ÇIKAN DUYURU
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black text-slate-950 tracking-tighter leading-[0.85] mb-8 uppercase italic">
                       {currentSlider.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-xl font-medium line-clamp-3">
                       {currentSlider.subtitle}
                    </p>
                    {currentSlider.link_url && (
                      <div className="flex flex-wrap gap-4">
                        <Link href={currentSlider.link_url}>
                          <button className="flex items-center gap-3 px-10 py-5 bg-slate-950 text-white text-[11px] font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-2xl uppercase tracking-[0.2em] group">
                            ŞİMDİ İNCELE
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    )}
                 </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-6xl mx-auto px-6 relative z-20 w-full">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-full mb-8 inline-block">Hoş Geldiniz</span>
              <h1 className="text-6xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.85] uppercase mb-8 italic">KADEME <br/><span className="text-orange-500 underline decoration-slate-200">Gelecek Burada.</span></h1>
            </div>
          )}
        </AnimatePresence>

        {/* Slider Navigation Dots */}
        {data.sliders?.length > 1 && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
             {data.sliders.map((_: any, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`w-1.5 transition-all duration-500 ${currentSlide === i ? 'h-16 bg-orange-500 ring-4 ring-orange-500/20' : 'h-6 bg-slate-200 hover:bg-slate-300'}`} 
                />
             ))}
          </div>
        )}
      </section>

      {/* Dynamic Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { value: data.settings.stats?.alumni_count || "0+", label: "Mezun Katılımcı", desc: "Sertifikalı Liderler" },
              { value: data.settings.stats?.active_projects || "0", label: "Aktif Program", desc: "Dinamik Müfredat" },
              { value: data.settings.stats?.total_activities || "0", label: "Toplam Etkinlik", desc: "Uygulamalı Eğitim" },
              { value: data.settings.stats?.satisfaction_rate || "%0", label: "Memnuniyet Oranı", desc: "Öğrenci Geri Bildirimi" },
            ].map((statItem, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center group border-r border-slate-50 last:border-0"
              >
                <div className="text-6xl font-black text-slate-950 mb-3 tracking-tighter group-hover:text-orange-500 transition-colors uppercase italic underline decoration-slate-100 decoration-8 underline-offset-4">
                   {statItem.value}
                </div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{statItem.label}</div>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{statItem.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pinned Projects */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <Layers size={22} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block">Faaliyet Alanlarımız</span>
              </div>
              <h2 className="text-6xl font-black text-slate-950 tracking-tighter leading-[0.85] uppercase italic">Geleceği <br /><span className="text-orange-500">Öncü Programlar</span></h2>
            </div>
            <Link href="/projeler">
              <button className="flex items-center gap-3 group text-[11px] font-black text-slate-950 hover:bg-slate-950 hover:text-white transition-all uppercase tracking-[0.2em] bg-white px-10 py-5 rounded-3xl border border-slate-100 shadow-xl">
                Tümünü Keşfet <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.pinned_projects?.map((project: any, idx: number) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
                  <Link href={`/projeler/${project.id}`}>
                    <div className="group h-full flex flex-col p-10 bg-white border border-slate-100 rounded-[3.5rem] hover:ring-8 hover:ring-slate-50/50 hover:shadow-3xl transition-all duration-500 relative">
                      <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-slate-950 group-hover:text-white transition-all">
                        <Star size={24} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-950 mb-4 tracking-tighter uppercase leading-tight italic">{project.name}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-10 font-medium line-clamp-3">
                         {project.sub_description || project.description}
                      </p>
                      
                      <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Programı İncele</span>
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                           <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pinned Activities / Events */}
      <section className="py-40 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/5 blur-[120px] -z-10" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
             <div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-6 block">KADEME GAZETE</span>
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-widest uppercase leading-[0.85] italic">Olan <br /><span className="text-slate-700">Bitenler</span></h2>
             </div>
             <Link href="/faaliyetler">
                <button className="px-10 py-5 bg-white text-slate-950 font-black text-[10px] rounded-[2rem] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-2xl">ETKİNLİK TAKVİMİ</button>
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {data.pinned_activities?.map((act: any, idx: number) => (
                <motion.div key={act.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
                   <div className="group bg-white/5 border border-white/5 p-10 rounded-[4rem] hover:bg-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-10">
                         <div className="px-4 py-2 bg-orange-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest italic">{act.type || 'ETKİNLİK'}</div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(act.start_time).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase italic leading-tight group-hover:text-orange-500 transition-colors">{act.name}</h4>
                      <p className="text-sm text-slate-500 font-medium line-clamp-2 italic mb-8">"{act.sub_description || act.description}"</p>
                      <div className="flex items-center gap-2 text-slate-400">
                         <MapPin size={14} className="text-orange-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{act.location || 'KADEME MERKEZ'}</span>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Manual Instagram Feed - Dynamic */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center shadow-xl mb-10">
               <Camera className="text-orange-500" size={36} />
            </div>
            <h2 className="text-6xl font-black text-slate-950 tracking-tighter uppercase italic">Ekosistemden <span className="text-slate-300">Anlar</span></h2>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-8 flex items-center gap-3">
               <span className="w-8 h-px bg-slate-200"></span> @kademe_online <span className="w-8 h-px bg-slate-200"></span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {data.instagram_posts?.map((post: any, idx: number) => (
              <motion.a 
                key={post.id} href={post.post_url || "#"} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="group relative aspect-square rounded-[3.5rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-900/5"
              >
                {post.image_path && (
                   <Image src={getStorageUrl(post.image_path)} fill className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={post.caption || 'Instagram'} />
                )}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-10 text-center backdrop-blur-sm">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-950 mb-6 scale-50 group-hover:scale-100 transition-transform duration-500">
                      <Camera size={28} />
                   </div>
                   <p className="text-white text-xs font-bold leading-relaxed line-clamp-2">{post.caption}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Post */}
      <section className="py-40 bg-slate-950 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-6 block">KADEME Journal</span>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-widest uppercase leading-[0.85] italic underline decoration-white/10 underline-offset-[12px]">Haberler & <br/><span className="text-slate-700 hover:text-white transition-colors">Duyurular</span></h2>
            </div>
            <Link href="/blog" className="px-12 py-5 bg-white text-[11px] font-black text-slate-950 hover:bg-orange-500 hover:text-white transition-all rounded-[2rem] uppercase tracking-widest shadow-2xl">
              ARŞİVİ GÖR
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {data.latest_posts?.map((blog: any, idx: number) => (
              <motion.div key={blog.id + idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Link href={`/blog/${blog.slug || blog.id}`} className="group block">
                   <div className="aspect-[3/4] bg-slate-900 rounded-[3.5rem] mb-8 overflow-hidden relative border border-white/5 group-hover:border-white/20 transition-all">
                     <Image src={blog.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=1200&fit=crop`} fill className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" alt={blog.title} />
                     <div className="absolute bottom-10 left-10 right-10">
                        <span className="text-[9px] font-black bg-orange-500 text-white px-5 py-2 rounded-full uppercase tracking-widest shadow-2xl mb-4 inline-block">YENİ</span>
                        <h3 className="text-2xl font-black text-white tracking-tighter leading-tight uppercase line-clamp-3 italic">
                          {blog.title}
                        </h3>
                     </div>
                   </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Snippet (Footer before FAQ) */}
      <section className="py-40 bg-white">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl">
               <HelpCircle className="text-orange-500" size={36} />
            </div>
            <h2 className="text-6xl font-black text-slate-950 tracking-tighter uppercase italic mb-10">Merak <span className="text-slate-300">Edilenler</span></h2>
            <div className="space-y-4 text-left max-w-3xl mx-auto mb-20">
               {data.faqs?.map((faq: any) => (
                  <div key={faq.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-orange-200 transition-colors">
                     <h4 className="font-black text-slate-950 text-base mb-3 uppercase tracking-tight italic">Q: {faq.question}</h4>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed">{faq.answer}</p>
                  </div>
               ))}
            </div>
            <Link href="/sss">
               <button className="px-12 py-5 border-2 border-slate-950 text-slate-950 text-[11px] font-black rounded-2xl hover:bg-slate-950 hover:text-white transition-all uppercase tracking-widest">
                  TÜM SORULAR & CEVAPLAR
               </button>
            </Link>
         </div>
      </section>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 25s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
}
