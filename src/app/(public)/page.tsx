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
  MapPin,
  Rocket,
  Users,
  FolderKanban,
  Activity,
  Sparkles
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

  return (    <div className="bg-white">
      {/* Neuros Hero Section - DARK TECH */}
      <section className="relative min-h-[90vh] lg:h-screen flex items-center overflow-hidden neuros-mesh pt-20">
        {/* Navbar Visibility Overlay */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none" />
        
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-10 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-orange-500"></span>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">Geleceğin Akademisi</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-white neuros-heading mb-10 tracking-[-0.05em] leading-[0.85]">
                {currentSlider?.title || "KADEME"}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-200">EKOSİSTEMİ</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-xl">
                {currentSlider?.subtitle || "Kurumsal Akademik Eğitim ve Mezuniyet Ekosistemi ile geleceğin liderlerini bugünden hazırlıyoruz."}
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <Link href={currentSlider?.link_url || "/basvuru"}>
                  <button className="neuros-pill neuros-glow-hover bg-orange-500 text-white flex items-center gap-4 group">
                    HEMEN KEŞFET <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
                <Link href="/hakkimizda">
                  <button className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 hover:text-orange-400 transition-colors">
                    <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-orange-500">
                      <ChevronRight size={16} />
                    </span>
                    BİZ KİMİZ?
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               viewport={{ once: true }}
               className="relative hidden lg:block"
            >
               <div className="relative aspect-square w-full max-w-[600px] mx-auto rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-purple-500/20 z-10 pointer-events-none" />
                  {currentSlider?.image_path ? (
                    <Image 
                      src={getStorageUrl(currentSlider.image_path)} 
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt={currentSlider.title}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                       <Rocket size={100} className="text-slate-800" />
                    </div>
                  )}
               </div>
               {/* Background Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-600/30 blur-[150px] -z-10 rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-4 opacity-40">
           <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] origin-center -rotate-90 mb-10">KEŞFET</span>
           <div className="w-px h-20 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Stats Section - CONTRAST LIGHT */}
      <section className="py-24 relative overflow-hidden bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
            {[
              { value: data.settings.stats?.alumni_count || "250+", label: "MEZUN", icon: Users },
              { value: data.settings.stats?.active_projects || "12", label: "PROGRAM", icon: FolderKanban },
              { value: data.settings.stats?.total_activities || "85", label: "ETKİNLİK", icon: Activity },
              { value: data.settings.stats?.satisfaction_rate || "%98", label: "MEMNUNİYET", icon: Star },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col lg:flex-row items-center gap-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-orange-500 shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/20">
                  <stat.icon size={24} />
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter mb-1 uppercase">
                    {stat.value}
                  </h3>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pinned Projects - LIGHT TECH */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <Layers size={22} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block">Faaliyet Alanlarımız</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-950 neuros-heading uppercase leading-none">
                GELECEĞE <br /><span className="text-orange-500">ÖNCÜ PROGRAMLAR</span>
              </h2>
            </div>
            <Link href="/projeler">
              <button className="neuros-pill border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition-all text-[10px] flex items-center gap-3">
                TÜMÜNÜ KEŞFET <ChevronRight size={18} />
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.pinned_projects?.map((project: any, idx: number) => (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: idx * 0.1 }} 
                viewport={{ once: true }}
              >
                <Link href={`/projeler/${project.id}`}>
                  <div className="group h-full flex flex-col p-10 bg-slate-50 border border-slate-100 rounded-[3rem] hover:bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-orange-500/20 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                    
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-slate-950 group-hover:text-white transition-all">
                      <Star size={24} className="group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-950 mb-4 tracking-tighter uppercase leading-tight italic">{project.name}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-10 font-medium line-clamp-3">
                      {project.sub_description || project.description}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest group-hover:text-orange-500 transition-colors">PROGRAMI İNCELE</span>
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all">
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

      {/* Pinned Activities - DARK TECH */}
      <section className="py-40 neuros-mesh relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
             <div>
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                   <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] block">KADEME GAZETE</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-white neuros-heading tracking-tight uppercase leading-[0.85] italic">
                   OLAN <br /><span className="text-white/20">BİTENLER</span>
                </h2>
             </div>
             <Link href="/faaliyetler">
                <button className="neuros-pill bg-white text-slate-950 hover:bg-orange-500 hover:text-white transition-all shadow-2xl text-[10px]">
                   ETKİNLİK TAKVİMİ
                </button>
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {data.pinned_activities?.map((act: any, idx: number) => (
                <motion.div 
                   key={act.id} 
                   initial={{ opacity: 0, scale: 0.9 }} 
                   whileInView={{ opacity: 1, scale: 1 }} 
                   transition={{ duration: 0.8, delay: idx * 0.1 }} 
                   viewport={{ once: true }}
                >
                   <div className="group neuros-glass p-12 rounded-[3.5rem] hover:border-orange-500/30 transition-all duration-500 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-10">
                         <div className="px-5 py-2 neuros-glass border-orange-500/20 text-orange-500 text-[9px] font-black rounded-full uppercase tracking-widest italic group-hover:bg-orange-500 group-hover:text-white transition-all">
                            {act.type || 'ETKİNLİK'}
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                               {new Date(act.start_time).toLocaleDateString()}
                            </span>
                         </div>
                      </div>
                      
                      <h4 className="text-2xl font-black text-white mb-6 tracking-tighter uppercase italic leading-tight group-hover:text-orange-500 transition-colors">
                         {act.name}
                      </h4>
                      
                      <p className="text-sm text-slate-400 font-medium line-clamp-3 italic mb-10 leading-relaxed">
                         "{act.sub_description || act.description}"
                      </p>
                      
                      <div className="mt-auto flex items-center gap-3 text-slate-500 group-hover:text-white transition-colors">
                         <div className="w-8 h-8 rounded-lg neuros-glass flex items-center justify-center">
                            <MapPin size={14} className="text-orange-500" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">{act.location || 'KADEME MERKEZ'}</span>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed - LIGHT TECH */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center shadow-xl mb-10 group">
               <Camera className="text-orange-500 group-hover:scale-110 transition-transform" size={32} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-950 neuros-heading uppercase italic mb-6">
              EKOSİSTEMDEN <span className="text-slate-300">ANLAR</span>
            </h2>
            <div className="flex items-center gap-4">
               <div className="w-10 h-px bg-slate-200" />
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.6em]">@KADEME_ONLINE</p>
               <div className="w-10 h-px bg-slate-200" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
            {data.instagram_posts?.map((post: any, idx: number) => (
              <motion.a 
                key={post.id} href={post.post_url || "#"} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: idx * 0.05 }}
                className="group relative aspect-square rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-900/5 border border-slate-100"
              >
                {post.image_path && (
                   <Image src={getStorageUrl(post.image_path)} fill className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" alt={post.caption || 'Instagram'} />
                )}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-12 text-center backdrop-blur-sm">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-950 mb-6 scale-50 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                      <Camera size={24} />
                   </div>
                   <p className="text-white text-xs font-bold leading-relaxed line-clamp-2 uppercase tracking-wider">{post.caption}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Post - DARK TECH */}
      <section className="py-40 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                 <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] block">KADEME JOURNAL</span>
              </div>
              <h2 className="text-6xl md:text-[90px] font-black text-white neuros-heading uppercase leading-[0.85] italic">
                HABERLER & <br/><span className="text-white/20">DUYURULAR</span>
              </h2>
            </div>
            <Link href="/blog">
               <button className="neuros-pill bg-white text-slate-950 hover:bg-orange-500 hover:text-white transition-all text-[10px] shadow-2xl">
                 ARŞİVİ GÖR
               </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {data.latest_posts?.map((blog: any, idx: number) => (
              <motion.div 
                key={blog.id + idx} 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/blog/${blog.slug || blog.id}`} className="group block h-full">
                   <div className="h-full bg-white/5 border border-white/5 rounded-[3rem] p-4 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
                     <div className="aspect-[4/5] rounded-[2.5rem] mb-8 overflow-hidden relative">
                        <Image 
                          src={blog.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=1200&fit=crop`} 
                          fill 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                          alt={blog.title} 
                        />
                        <div className="absolute top-6 left-6">
                           <span className="text-[8px] font-black bg-orange-500 text-white px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl">HABER</span>
                        </div>
                     </div>
                     <div className="px-4 pb-4">
                        <h3 className="text-xl font-black text-white tracking-tighter leading-tight uppercase line-clamp-2 italic mb-4 group-hover:text-orange-500 transition-colors">
                          {blog.title}
                        </h3>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                           <ArrowRight size={14} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                        </div>
                     </div>
                   </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Snippet - LIGHT CLEAN */}
      <section className="py-40 bg-white relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-10 text-center">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl group">
               <HelpCircle className="text-orange-500 group-hover:rotate-12 transition-transform" size={32} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-950 neuros-heading uppercase italic mb-16 tracking-tight">
              MERAK <span className="text-slate-300">EDİLENLER</span>
            </h2>
            
            <div className="grid gap-6 text-left mb-20">
               {data.faqs?.map((faq: any, fidx: number) => (
                  <motion.div 
                    key={faq.id} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: fidx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-orange-500/20 hover:bg-white hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500"
                  >
                     <div className="flex items-start gap-6">
                        <span className="text-2xl font-black text-orange-500/20 uppercase italic">0{fidx + 1}</span>
                        <div>
                           <h4 className="font-black text-slate-950 text-lg mb-4 uppercase tracking-tight italic leading-tight">{faq.question}</h4>
                           <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">{faq.answer}</p>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
            
            <Link href="/sss">
               <button className="neuros-pill border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition-all text-[11px]">
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
