"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import api from '@/lib/api';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faqs')
      .then(res => setFaqs(res.data))
      .catch(err => console.error("FAQ Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 bg-white mt-10">
      <div className="text-center mb-24">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <HelpCircle className="text-orange-500" size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-950 mb-6 tracking-tighter uppercase italic">Sık Sorulan <span className="text-slate-300">Sorular</span></h1>
        <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-[0.3em]">Platform ve projelerimiz hakkında merak ettikleriniz.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
           <div className="py-20 text-center animate-pulse text-slate-300 font-black uppercase tracking-widest italic">Yükleniyor...</div>
        ) : faqs.length > 0 ? faqs.map((faq, index) => (
          <FAQItem key={faq.id || index} faq={faq} />
        )) : (
          <div className="py-20 text-center text-slate-300 font-bold italic">Kayıtlı soru bulunmuyor.</div>
        )}
      </div>

      <div className="mt-28 p-12 md:p-16 rounded-[4rem] bg-slate-950 text-center relative overflow-hidden shadow-3xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10">
          <MessageCircle className="mx-auto mb-8 text-orange-500" size={48} />
          <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter italic">Başka bir sorunuz mu var?</h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto text-sm font-medium leading-relaxed italic">
            Sorunuza burada cevap bulamadıysanız bize iletişim formundan veya destek hattımızdan ulaşabilirsiniz.
          </p>
          <Link href="/iletisim">
            <button className="px-10 py-4 bg-orange-500 text-white font-black text-xs rounded-2xl hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/20 uppercase tracking-widest">
              BİZE ULAŞIN
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ faq }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border border-slate-100 rounded-[2rem] bg-white overflow-hidden transition-all duration-500 ${isOpen ? 'ring-4 ring-slate-100 shadow-2xl' : 'hover:border-slate-300'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 md:p-10 flex justify-between items-center text-left"
      >
        <span className="text-lg md:text-xl font-black text-slate-950 pr-4 uppercase tracking-tight italic">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`transition-colors ${isOpen ? 'text-orange-500' : 'text-slate-300'}`}
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-8 md:px-10 pb-10 text-slate-500 text-sm md:text-lg font-medium leading-relaxed border-t border-slate-50 pt-8 italic">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
