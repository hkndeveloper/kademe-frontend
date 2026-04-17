"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Globe, Share2, ExternalLink, Activity } from 'lucide-react';
import api from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/contact', formData);
      setStatus({ type: 'success', message: res.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Formu sıfırla
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Mesaj gönderilirken bir hata oluştu.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white pt-20">
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">İletişime Geçin</h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-500 font-medium leading-relaxed">
              Sorularınız, iş birlikleri veya destek talepleriniz için bize her zaman ulaşabilirsiniz.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Bize Mesaj Gönderin</h2>
              
              {status && (
                <div className={`mb-8 p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ad Soyad</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm text-gray-900" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">E-posta</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm text-gray-900" 
                      placeholder="johndoe@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Konu</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm text-gray-900" 
                    placeholder="Proje Başvurusu Hakkında" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mesajınız</label>
                  <textarea 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm text-gray-900" 
                    placeholder="Nasıl yardımcı olabiliriz?"
                  ></textarea>
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:bg-orange-600 transition-all group disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={18} className="transition-transform group-hover:translate-x-1" />
                      <span>MESAJI GÖNDER</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-12 lg:pl-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">İletişim Bilgileri</h2>
                <div className="space-y-8">
                  <ContactInfoItem icon={MapPin} title="Merkez Ofis" detail="Ankara, Türkiye" />
                  <ContactInfoItem icon={Mail} title="E-posta" detail="iletisim@kademe.org" />
                  <ContactInfoItem icon={Phone} title="Telefon" detail="+90 (000) 000 00 00" />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Sosyal Medya</h3>
                <div className="flex gap-3">
                  <SocialLink icon={Globe} href="#" />
                  <SocialLink icon={Share2} href="#" />
                  <SocialLink icon={ExternalLink} href="#" />
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-56 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center text-gray-300 font-bold text-sm">
                HARİTA GÖRÜNÜMÜ
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfoItem({ icon: Icon, title, detail }: any) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="w-12 h-12 bg-white border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center group-hover:text-orange-500 group-hover:border-orange-100 transition-colors shadow-sm shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</h4>
        <p className="text-lg font-bold text-gray-900">{detail}</p>
      </div>
    </div>
  );
}

function SocialLink({ icon: Icon, href }: any) {
  return (
    <a href={href} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-white hover:text-orange-500 hover:border-orange-100 border border-transparent transition-all shadow-sm">
      <Icon size={20} />
    </a>
  );
}
