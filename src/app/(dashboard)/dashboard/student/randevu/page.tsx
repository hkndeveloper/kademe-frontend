"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Globe, 
  CheckCircle,
  Info,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'online',
    room_id: '1',
    topic: ''
  });

  const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  useEffect(() => {
    if (formData.date) {
      fetchAvailability();
    }
  }, [formData.date]);

  const fetchAvailability = async () => {
    try {
      const res = await api.get(`/student/kpd/availability?date=${formData.date}`);
      setOccupiedSlots(res.data);
    } catch (err) {
      console.error("Musaitlik alinamadi");
    }
  };

  const isSlotOccupied = (time: string, roomId: string) => {
    return occupiedSlots.some(s => s.time === time && s.room.toString() === roomId);
  };

  const handleBook = async () => {
    if (!formData.time) return toast.error("Lütfen bir saat seçin.");
    
    setLoading(true);
    try {
      await api.post('/student/kpd/appointments', formData);
      setStep(3);
      toast.success("Randevu talebiniz başarıyla oluşturuldu.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Randevu alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 underline decoration-yellow-500 underline-offset-8">Seans Randevusu</h1>
        <p className="text-slate-500 font-medium mt-4">Kariyer Psikolojik Danışmanlık (KPD) için uzmanlarımızdan randevu alın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Progress Sidebar */}
        <div className="space-y-4">
          <StepIndicator active={step === 1} done={step > 1} label="Seans Türü & Konu" stepNumber={1} />
          <StepIndicator active={step === 2} done={step > 2} label="Tarih & Saat Seçimi" stepNumber={2} />
          <StepIndicator active={step === 3} done={step === 3} label="Onay" stepNumber={3} />
          
          <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/20">
            <Info className="text-blue-600 mb-4" size={24} />
            <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Önemli Bilgilendirme</h4>
            <p className="text-[11px] text-blue-700 dark:text-blue-500 leading-relaxed font-bold uppercase tracking-wider">
              KPD seansları 45 dakika sürer. Randevunuzdan 15 dakika önce bekleme odasında olmanız rica olunur. Online seans linki onay sonrası mail adresinize iletilecektir.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black mb-8 text-slate-900 dark:text-white">Seans Detayları</h2>
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setFormData({...formData, type: 'online'})}
                        className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${formData.type === 'online' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                      >
                        <Globe className={`mb-3 ${formData.type === 'online' ? 'text-yellow-600' : 'text-slate-300'}`} size={32} />
                        <div className={`font-bold uppercase tracking-widest text-xs ${formData.type === 'online' ? 'text-yellow-900 dark:text-yellow-500' : 'text-slate-400'}`}>Online Seans</div>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, type: 'office'})}
                        className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${formData.type === 'office' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                      >
                        <MapPin className={`mb-3 ${formData.type === 'office' ? 'text-yellow-600' : 'text-slate-300'}`} size={32} />
                        <div className={`font-bold uppercase tracking-widest text-xs ${formData.type === 'office' ? 'text-yellow-900 dark:text-yellow-500' : 'text-slate-400'}`}>Ofis Seansı</div>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Danışmanlık Almak İstediğiniz Konu</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-yellow-500 rounded-[2rem] py-5 px-8 outline-none transition-all text-sm font-medium"
                        placeholder="Örn: Kariyer planlama, mülakat teknikleri, yetkinlik analizi..."
                        value={formData.topic}
                        onChange={(e: any) => setFormData({...formData, topic: e.target.value})}
                      ></textarea>
                    </div>

                    <button 
                      onClick={() => setStep(2)} 
                      disabled={!formData.topic}
                      className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      ZAMAN SEÇİMİNE GEÇ
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-4 mb-8">
                     <button onClick={() => setStep(1)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                        <ChevronLeft size={20} />
                     </button>
                     <h2 className="text-2xl font-black text-slate-900 dark:text-white">Tarih ve Saat</h2>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Tarih Seçin</label>
                       <input 
                         type="date" 
                         min={new Date().toISOString().split('T')[0]}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-8 font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500/20"
                         value={formData.date}
                         onChange={(e: any) => setFormData({...formData, date: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         onClick={() => setFormData({...formData, room_id: '1'})}
                         className={`py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${formData.room_id === '1' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                       >
                         Oda 1
                       </button>
                       <button 
                         onClick={() => setFormData({...formData, room_id: '2'})}
                         className={`py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${formData.room_id === '2' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                       >
                         Oda 2
                       </button>
                    </div>

                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Uygun Saat Dilimleri</div>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {slots.map(t => {
                          const occupied = isSlotOccupied(t, formData.room_id);
                          return (
                            <button 
                              key={t}
                              disabled={occupied}
                              onClick={() => setFormData({...formData, time: t})}
                              className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${
                                occupied 
                                ? 'bg-slate-50 border-transparent text-slate-200 cursor-not-allowed opacity-50' 
                                : formData.time === t 
                                  ? 'border-yellow-500 bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' 
                                  : 'border-slate-50 dark:border-slate-800 text-slate-600 hover:border-yellow-200'
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      onClick={handleBook} 
                      disabled={loading || !formData.time}
                      className="w-full py-5 bg-yellow-500 text-white font-black rounded-2xl shadow-xl shadow-yellow-500/20 hover:bg-yellow-600 transition-all flex items-center justify-center space-x-2"
                    >
                      {loading ? 'İŞLENİYOR...' : 'RANDEVU TALEBİNİ GÖNDER'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                     <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Harika! Talebiniz Alındı</h3>
                  <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Uzmanımız randevunuzu inceleyip onayladığında size bir bildirim ve e-posta göndereceğiz.</p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] text-left space-y-4 mb-10 border border-slate-100 dark:border-slate-700">
                    <SummaryRow label="Seans Türü" value={formData.type === 'online' ? 'Online' : 'Ofis'} />
                    <SummaryRow label="Oda" value={`Danışmanlık Odası ${formData.room_id}`} />
                    <SummaryRow label="Tarih" value={new Date(formData.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} />
                    <SummaryRow label="Saat" value={formData.time} />
                    <SummaryRow label="Konu" value={formData.topic} />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                     <button 
                       onClick={() => window.location.reload()} 
                       className="flex-1 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
                     >
                       TAMAM
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ active, done, label, stepNumber }: any) {
  return (
    <div className={`p-5 rounded-3xl flex items-center space-x-4 border-2 transition-all duration-500 ${active ? 'bg-white dark:bg-slate-800 border-yellow-500 shadow-xl shadow-yellow-500/5' : done ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20' : 'border-transparent opacity-30 shadow-none'}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-colors ${active ? 'bg-yellow-500 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
        {done ? <CheckCircle size={20} /> : stepNumber}
      </div>
      <span className={`font-black text-xs uppercase tracking-widest ${active ? 'text-slate-900 dark:text-white' : done ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700 pb-3 last:border-0">
      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</span>
      <span className="font-bold text-slate-800 dark:text-white text-sm">{value || 'N/A'}</span>
    </div>
  );
}

