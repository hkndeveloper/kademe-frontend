"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Calendar, Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function BlogArchive() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    api.get("/blogs")
      .then(res => setBlogs(res.data))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", "Haber", "Duyuru", "Etkinlik", "Eğitim"];

  const filtered = blogs.filter(b => {
    const s = search.toLowerCase();
    const titleMatch = b.title?.toLowerCase().includes(s);
    const catMatch = category === "all" || b.category === category;
    return titleMatch && catMatch;
  });

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 font-sans">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-4 block">KADEME Blog</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Gündem, Haberler ve <br />Teknik Yazılar</h1>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Yazı ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-80 bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      category === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'all' ? 'HEPSİ' : cat}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="aspect-[16/11] bg-slate-100 rounded-[2.5rem]"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center text-slate-300 font-black text-xs uppercase tracking-widest">Henüz bir yazı bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {filtered.map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <Link href={`/blog/${blog.id}`}>
                    <div className="relative aspect-[16/11] bg-slate-100 rounded-[2.5rem] mb-8 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-orange-500/10 transition-all duration-500">
                      <img 
                        src={blog.image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={blog.title} 
                      />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                          {blog.category || 'GÜNCEL'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="opacity-50" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Tag size={14} className="opacity-50" /> {blog.tags || 'Genel'}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-500 transition-colors tracking-tight leading-tight mb-4">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2 mb-6">
                      {blog.summary}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 group-hover:gap-4 transition-all">
                      OKUMAYA DEVAM ET <ArrowRight size={14} className="text-orange-500" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Newsletter Snippet */}
      <section className="max-w-6xl mx-auto px-6 mt-32">
        <div className="bg-slate-950 rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-6 leading-tight">
                Gelişmeleri Kaçırmayın, <br /><span className="text-orange-500">KADEME Bültene</span> Abone Olun.
              </h2>
              <p className="text-slate-400 font-medium">En yeni etkinlikler, blog yazıları ve duyurular haftalık olarak e-postanıza gelsin.</p>
            </div>
            <div className="w-full md:w-auto relative z-10">
              <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz..." 
                  className="bg-transparent border-none px-6 py-4 outline-none text-white font-bold text-sm w-full md:w-64 placeholder:text-slate-600" 
                />
                <button className="bg-orange-500 text-white p-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}
