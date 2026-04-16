"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ArrowLeft, RefreshCw, Timer, MapPin, Users } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ActivityQrPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id;

  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  const fetchQr = async () => {
    try {
      const res = await api.get(`/activities/${activityId}/dynamic-qr`);
      setQrData(res.data);
      setTimeLeft(res.data.expires_in);
      setLoading(false);
    } catch (err) {
      toast.error("QR kod yüklenirken hata oluştu.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQr();
    const refreshInterval = setInterval(() => {
      fetchQr();
    }, 30000); // 30 saniyede bir ana yenileme

    return () => clearInterval(refreshInterval);
  }, [activityId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Geri Dön</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
              <Timer size={18} className="text-orange-500" />
              <span className="font-mono font-bold text-gray-700">
                {timeLeft}s
              </span>
            </div>
            <button 
              onClick={fetchQr}
              className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          <div className="p-8 md:p-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {qrData?.activity_name}
            </h1>
            <p className="text-gray-500 mb-12 font-medium">
              Yoklama için aşağıdaki QR kodu telefonunuzdan okutun.
            </p>

            {/* QR Code Container */}
            <div className="relative inline-block mx-auto mb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={qrData?.secret}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-6 rounded-3xl border-4 border-orange-500 shadow-2xl relative z-10"
                >
                  <img 
                    src={qrData?.qr_url} 
                    alt="Attendance QR" 
                    className="w-64 h-64 md:w-80 md:h-80"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Decorative Background Circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-orange-50 rounded-full -z-0 opacity-50 blur-2xl"></div>
            </div>

            {/* Stats/Info */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                  <MapPin size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Konum</span>
                </div>
                <div className="font-bold text-gray-900">Aktif</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
                  <Users size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Durum</span>
                </div>
                <div className="font-bold text-gray-900 text-emerald-600">Yoklama Açık</div>
              </div>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="bg-orange-500 p-4 text-center">
            <p className="text-white font-bold text-sm tracking-wide">
              GÜVENLİK UYARISI: QR KOD 30 SANİYEDE BİR YENİLENMEKTEDİR
            </p>
          </div>
        </motion.div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400 text-sm font-medium">
          Dinamik Secret: <code className="bg-gray-100 px-2 py-1 rounded text-gray-600">{qrData?.secret.substring(0, 16)}...</code>
        </div>
      </div>
    </div>
  );
}
