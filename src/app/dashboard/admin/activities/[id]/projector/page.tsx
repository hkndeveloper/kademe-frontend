"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin, Users } from 'lucide-react';
import api from '@/lib/api';

export default function ProjectorScreen() {
  const { id } = useParams();
  const [qrPayload, setQrPayload] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [activity, setActivity] = useState<any>(null);

  const fetchQRCode = async () => {
    try {
      const res = await api.post(`/activities/${id}/refresh-qr`);
      setQrPayload(res.data.payload);
      setActivity(res.data.activity);
      setTimeLeft(15);
    } catch (err) {
      console.error('QR Kod çekilemedi', err);
    }
  };

  useEffect(() => {
    fetchQRCode();
    
    // Her 15 saniyede bir QR kodu sunucudan yenile
    const interval = setInterval(() => {
      fetchQRCode();
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  if (!qrPayload) return <div className="h-screen bg-slate-950 text-white flex items-center justify-center text-4xl font-black">YÜKLENİYOR...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
      
      <div className="absolute top-10 left-10 flex items-center space-x-4 z-10">
        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 text-slate-900 font-black text-3xl font-serif">K</div>
        <div>
          <h1 className="text-3xl font-black">{activity?.name || 'KADEME Etkinliği'}</h1>
          <p className="text-slate-400 text-xl flex items-center"><MapPin size={24} className="mr-2"/> Konum Doğrulaması Aktif</p>
        </div>
      </div>

      <motion.div 
        key={qrPayload}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-12 rounded-[4rem] shadow-2xl relative z-10"
      >
        <QRCodeSVG value={qrPayload} size={400} level="H" includeMargin={true} />
        
        {/* Dynamic Scan Line Effect */}
        <motion.div 
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-2 bg-yellow-500/50 shadow-[0_0_20px_5px_rgba(234,179,8,0.5)] z-20 pointer-events-none"
        ></motion.div>
      </motion.div>

      <div className="mt-16 text-center z-10">
        <div className="inline-flex items-center space-x-4 bg-slate-900 px-8 py-4 rounded-full border border-slate-800">
          <RefreshCw size={28} className={`text-yellow-500 ${timeLeft < 5 ? 'animate-spin' : ''}`} />
          <span className="text-3xl font-bold font-mono text-yellow-500">
            {timeLeft} Saniye
          </span>
          <span className="text-slate-400 text-xl ml-2">içinde QR kod yenilenecek</span>
        </div>
      </div>

      <div className="absolute bottom-10 text-center text-slate-500 w-full z-10">
        <p className="font-bold tracking-widest uppercase mb-2"><Users size={20} className="inline mr-2" /> KADEME YOKLAMA SİSTEMİ</p>
        <p className="text-sm">Lütfen mobil cihazınızdan yoklama ekranını açarak QR kodu kameranıza okutunuz.</p>
      </div>
    </div>
  );
}
