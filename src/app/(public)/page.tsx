"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  Zap,
  Star,
  Calendar,
  ChevronRight,
  Globe,
  Camera,
  RefreshCw,
  Clock,
  MapPin,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    pinned_projects: [],
    pinned_activities: [],
    settings: {
      stats: {},
      insta_feed: []
    }
  });
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeContent();
    
    // Auto-advance slider
    const timer = setInterval(() => {
      setCurrentSlide(prev => {
        const total = (data.pinned_projects?.length || 0) + (data.pinned_activities?.length || 0);
        if (total <= 1) return 0;
        return (prev + 1) % total;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, [data.pinned_projects?.length, data.pinned_activities?.length]);

  const fetchHomeContent = async () => {
    try {
      const [homeRes, blogRes] = await Promise.all([
        api.get("/public-home"),
        api.get("/blogs?limit=3").catch(() => ({ data: [] }))
      ]);
      setData(homeRes.data);
      setBlogs(blogRes.data || []);
    } catch (err) {
      console.error("Content fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const slides = [
    ...(data.pinned_projects || []).map((p: any) => ({ ...p, slideType: 'project' })),
    ...(data.pinned_activities || []).map((a: any) => ({ ...a, slideType: 'activity' }))
  ];

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-950 font-black text-slate-300 uppercase tracking-widest animate-pulse italic">KADEME Yükleniyor...</div>;
  }

  return (
    <div className="bg-white">
      {/* Premium Hero Slider - Dynamic Content Managed by Admin */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          {slides.length > 0 ? (
            <motion.div 
               key={currentSlide}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1 }}
               className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&h=900&fit=crop" 
                className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
                alt="Hero Background"
              />
              
              <div className="max-w-6xl mx-auto px-6 relative z-20 w-full h-full flex items-center">
                 <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: 0.3 }}
                   className="max-w-2xl"
                 >
                    <span className="inline-flex items-center gap-2 text-[10px] font-black text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full mb-8 uppercase tracking-[0.2em] border border-orange-500/20">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                      {slides[currentSlide].slideType === 'project' ? 'ÖNE ÇIKAN PROGRAM' : 'GAZETE & ETKİNLİK'}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase">
                       {slides[currentSlide].name}
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed mb-12 max-w-xl font-medium line-clamp-3">
                       {slides[currentSlide].description || slides[currentSlide].sub_description || "Diplomasi, teknoloji ve sosyal gelişim odaklı projelerimizle Türkiye'nin en kapsamlı gençlik ekosistemine dahil olun."}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link href={slides[currentSlide].slideType === 'project' ? `/projeler/${slides[currentSlide].id}` : `/etkinlikler`}>
                        <button className="flex items-center gap-3 px-10 py-5 bg-orange-500 text-white text-[11px] font-black rounded-2xl hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/30 uppercase tracking-[0.2em] group">
                          DETAYLARINI GÖR
                          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </Link>
                    </div>
                 </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-6xl mx-auto px-6 relative z-20 w-full">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-full mb-8 inline-block">Hoş Geldiniz</span>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase mb-8">KADEME <br/><span className="text-orange-500">Gelecek Burada.</span></h1>
              <Link href="/projeler"><button className="px-8 py-4 bg-white text-slate-900 font-black text-xs rounded-2xl uppercase tracking-widest">Keşfetmeye Başla</button></Link>
            </div>
          )}
        </AnimatePresence>

        {/* Slider Navigation Dots */}
        {slides.length > 1 && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
             {slides.map((_, i) => (
               <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`w-1 transition-all duration-500 ${currentSlide === i ? 'h-12 bg-orange-500' : 'h-4 bg-white/20 hover:bg-white/40'}`} 
               />
             ))}
          </div>
        )}
      </section>

      {/* Dynamic Stats - Dynamic Data from Admin */}
      <section className="py-20 bg-white border-b border-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { value: data.settings.stats?.alumni_count || "500+", label: "Mezun Katılımcı", desc: "Sertifikalı Liderler" },
              { value: data.settings.stats?.active_projects || "4", label: "Aktif Program", desc: "Dinamik Müfredat" },
              { value: data.settings.stats?.total_activities || "12", label: "Toplam Etkinlik", desc: "Uygulamalı Eğitim" },
              { value: data.settings.stats?.satisfaction_rate || "%96", label: "Memnuniyet Oranı", desc: "Öğrenci Geri Bildirimi" },
            ].map((statItem, idx) => (
              <motion.div 
                key={statItem.label} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter group-hover:text-orange-500 transition-colors uppercase">
                   {statItem.value}
                </div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{statItem.label}</div>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{statItem.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid - Top pinned or latest */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4 block animate-pulse">Faaliyet Alanlarımız</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">Geleceği Dönüştüren <br /><span className="text-slate-300">Öncü Programlar</span></h2>
            </div>
            <Link href="/projeler">
              <button className="flex items-center gap-3 group text-[11px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100">
                Tümünü İncele <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(data.pinned_projects?.length > 0 ? data.pinned_projects : []).slice(0, 4).map((project: any, idx: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/projeler/${project.id}`}>
                    <div className="group h-full flex flex-col p-10 bg-white border border-slate-100 rounded-[3rem] hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 relative overflow-hidden">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                        <Star size={28} className="text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-tight">{project.name}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-10 font-medium line-clamp-3 italic">"{project.sub_description || project.description}"</p>
                      
                      <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-50">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Kayıt Ol</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                           <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section - Fully Dynamic from Admin */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-sm mb-6">
               <Camera className="text-orange-500" size={32} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Ekosistemden <span className="text-orange-500">Kareler</span></h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-6">@kademe_online sosyal medya akışı</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(data.settings.insta_feed?.length > 0 ? data.settings.insta_feed : [1,2,3,4]).map((post: any, idx: number) => (
              <motion.a 
                key={post.id || idx}
                href={post.url || "#"}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="relative aspect-square rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-slate-900/5 bg-slate-200"
              >
                {post.image ? (
                   <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Instagram Post" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Camera size={40} />
                   </div>
                )}
                <div className="absolute inset-0 bg-orange-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-600 transform scale-50 group-hover:scale-100 transition-transform">
                     <Camera size={24} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Snippets - Latest 3 */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-20">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">KADEME Journal</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">Haberler & <br/><span className="text-orange-500">Duyurular</span></h2>
            </div>
            <Link href="/blog" className="px-8 py-4 border-2 border-slate-900 text-[10px] font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all rounded-2xl uppercase tracking-widest">
              TÜMÜNÜ GÖR
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {blogs.map((blog: any, idx: number) => (
              <motion.div key={idx} className="group cursor-pointer">
                <Link href={`/blog/${blog.id}`}>
                   <div className="aspect-[12/9] bg-slate-100 rounded-[3rem] mb-8 overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all">
                     <img 
                       src={blog.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop&q=80`} 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                       alt="Blog Cover"
                     />
                     <div className="absolute top-6 left-6">
                        <span className="text-[9px] font-black bg-white text-slate-900 px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">GÜNCEL</span>
                     </div>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-500 transition-colors tracking-tighter leading-[1.1] mb-4 uppercase">
                     {blog.title}
                   </h3>
                   <p className="text-sm text-slate-400 font-medium line-clamp-2 mb-8 italic">
                     {blog.summary}
                   </p>
                   <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:gap-6 transition-all">
                     OKUMAYA DEVAM ET <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center"><ArrowRight size={12} /></div>
                   </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate linear;
        }
      `}</style>
    </div>
  );
}
