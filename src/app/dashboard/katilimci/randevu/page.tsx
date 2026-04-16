"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  MessageSquare,
  CheckCircle,
  ChevronRight,
  Info
} from 'lucide-react';

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'online',
    topic: ''
  });

  const availableSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Seans Randevusu</h1>
        <p className="text-slate-500">Kariyer Psikolojik Danışmanlık (KPD) için uygun bir zaman dilimi seçin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Progress Sidebar */}
        <div className="space-y-4">
          <StepIndicator active={step >= 1} label="Seans Türü & Konu" />
          <StepIndicator active={step >= 2} label="Tarih & Saat Seçimi" />
          <StepIndicator active={step >= 3} label="Onay" />
          
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20">
            <Info className="text-blue-600 mb-2" size={24} />
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-bold">
              KPD seansları 45 dakika sürer. Randevunuzdan 15 dakika önce bekleme odasında olmanız rica olunur.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold mb-8">Seans Detayları</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({...formData, type: 'online'})}
                      className={`p-6 rounded-2xl border-2 transition-all text-center ${formData.type === 'online' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-slate-100 dark:border-slate-800'}`}
                    >
                      <Globe className="mx-auto mb-2 text-slate-400" size={24} />
                      <div className="font-bold">Online</div>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, type: 'office'})}
                      className={`p-6 rounded-2xl border-2 transition-all text-center ${formData.type === 'office' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-slate-100 dark:border-slate-800'}`}
                    >
                      <MapPin className="mx-auto mb-2 text-slate-400" size={24} />
                      <div className="font-bold">Ofiste</div>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Danışmanlık Almak İstediğiniz Konu</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 outline-none"
                      placeholder="Kariyer planlama, mülakat teknikleri vb."
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    ></textarea>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl">
                    Devam Et
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold mb-8">Tarih ve Saat</h2>
                <div className="space-y-8">
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 font-bold"
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Uygun Saatler</div>
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map(t => (
                        <button 
                          key={t}
                          onClick={() => setFormData({...formData, time: t})}
                          className={`py-3 rounded-xl font-bold border-2 transition-all ${formData.time === t ? 'border-yellow-500 bg-yellow-500 text-white' : 'border-slate-50 dark:border-slate-800'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 font-bold rounded-2xl">Geri</button>
                    <button onClick={() => setStep(3)} className="flex-1 py-5 bg-yellow-500 text-white font-bold rounded-2xl">Özetle</button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <CheckCircle className="mx-auto text-emerald-500 mb-6" size={64} />
                <h3 className="text-2xl font-black mb-8">Randevu Özeti</h3>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl text-left space-y-4 mb-8">
                  <SummaryRow label="Seans Türü" value={formData.type.toUpperCase()} />
                  <SummaryRow label="Tarih" value={formData.date} />
                  <SummaryRow label="Saat" value={formData.time} />
                  <SummaryRow label="Konu" value={formData.topic} />
                </div>
                <button 
                  onClick={() => alert('Randevunuz kaydedildi.')} 
                  className="w-full py-5 bg-yellow-500 text-white font-black rounded-2xl shadow-xl shadow-yellow-500/20"
                >
                  RANDEVUYU ONAYLA
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ active, label }: any) {
  return (
    <div className={`p-4 rounded-2xl flex items-center space-x-4 border ${active ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm' : 'border-transparent opacity-50'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${active ? 'bg-yellow-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
        {active ? <CheckCircle size={16} /> : 1}
      </div>
      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{label}</span>
    </div>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-bold text-slate-800 dark:text-white capitalize">{value || 'N/A'}</span>
    </div>
  );
}
