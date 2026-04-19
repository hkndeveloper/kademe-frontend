"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Link as LinkIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

import DOMPurify from 'dompurify';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sanitization helper
  const getSanitizedContent = (content: string) => {
    if (typeof window === 'undefined') return content;
    return DOMPurify.sanitize(content);
  };

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then(res => setBlog(res.data))
      .catch(() => setBlog({
        title: "KADEME 2024 Dönem Başvuruları Başladı",
        content: "<p>KADEME ekosistemi yeni dönem katılımcılarını arıyor. Bu yıl 4 farklı programda eğitimler verilecek...</p><p>Detaylı bilgi için programlar sayfasını ziyaret edebilirsiniz.</p>",
        category: "Duyuru",
        created_at: new Date().toISOString(),
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80",
        author: "KADEME Yönetim"
      }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen pt-40 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse">Yazı Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-white pb-32 pt-20">
      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
          <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-20 w-full mb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-[0.2em] mb-8">
            <ArrowLeft size={14} /> Blog Arşivine Dön
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{blog.category}</span>
            <span className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest"><Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">{blog.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <article className="flex-1">
            <div 
              className="prose prose-slate prose-lg max-w-none 
              prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
              prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium
              prose-strong:text-slate-900 prose-strong:font-black
              prose-img:rounded-[2.5rem] prose-img:shadow-xl"
              dangerouslySetInnerHTML={{ __html: getSanitizedContent(blog.content) }}
            />
            
            {/* Post Footer */}
            <div className="mt-20 pt-12 border-t border-slate-100 flex flex-wrap items-center justify-between gap-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 tracking-widest">KY</div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yazar</div>
                    <div className="text-sm font-black text-slate-900 uppercase tracking-wider">{blog.author || 'KADEME Yönetim'}</div>
                  </div>
               </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paylaş:</span>
                   <div className="flex gap-2">
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all" title="Bağlantıyı Kopyala"><LinkIcon size={16} /></button>
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all" title="Paylaş"><Share2 size={16} /></button>
                   </div>
                </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related Snippets Placeholder */}
      <section className="max-w-6xl mx-auto px-6 mt-32">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 text-center">Diğer Yazılarımız</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-slate-50 rounded-3xl mb-6 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <h5 className="text-sm font-black text-slate-900 line-clamp-2 uppercase tracking-wide">Diplomasi360 Programı 2026 Tanıtım Toplantısı Hazırlıkları</h5>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
