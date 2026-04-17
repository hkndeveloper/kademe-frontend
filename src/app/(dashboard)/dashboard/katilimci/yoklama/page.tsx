"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scanner } from '@yudiel/react-qr-scanner';
import { 
  MapPin, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

function AttendanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('activity');

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    // Sayfa acildiginda konumu iste
    getLocation();
  }, []);

  const getLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setLoadingLocation(false);
          setStatus('scanning');
        },
        (err) => {
          setStatus('error');
          setMessage('Konum izni verilmedi. Yoklama için konumunuz gereklidir.');
          setLoadingLocation(false);
        }
      );
    } else {
      setStatus('error');
      setMessage('Tarayıcınız konum özelliğini desteklemiyor.');
    }
  };

  const handleScan = async (result: string) => {
    if (!location || status === 'verifying') return;

    setStatus('verifying');
    try {
      // Parse QR payload to extract secret
      let qrCodeSecret = result;
      try {
        const payload = JSON.parse(result);
        qrCodeSecret = payload.secret || result;
      } catch {
        // If not JSON, use as-is
        qrCodeSecret = result;
      }

      const response = await api.post('/attendances', {
        activity_id: activityId,
        qr_code_secret: qrCodeSecret,
        latitude: location.lat,
        longitude: location.lng
      });

      setStatus('success');
      setMessage(response.data.message);

      // 3 saniye sonra geri yonlendir
      setTimeout(() => router.push('/dashboard/katilimci'), 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Yoklama verilemedi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-4">
      <div className="w-full max-md mt-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-slate-500 font-bold mb-8 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Vazgeç
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">QR Yoklama</h1>
          <p className="text-slate-500 text-sm mb-10">Lütfen ekrandaki QR kodu taratın.</p>

          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20 mb-6"
              >
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <p className="text-red-700 dark:text-red-400 font-bold leading-relaxed">{message}</p>
                <button 
                  onClick={() => { setStatus('idle'); getLocation(); }}
                  className="mt-6 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm"
                >
                  Tekrar Dene
                </button>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10"
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-emerald-500" size={60} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tebrikler!</h2>
                <p className="text-emerald-600 font-medium">{message}</p>
              </motion.div>
            )}

            {(status === 'scanning' || status === 'verifying') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <div className="aspect-square rounded-[2rem] overflow-hidden border-4 border-yellow-500 relative mb-8">
                  <Scanner 
                    onScan={(detected) => handleScan(detected[0].rawValue)}
                    onError={(err) => console.error(err)}
                    paused={status === 'verifying'}
                  />
                  {status === 'verifying' && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="animate-spin text-white mx-auto mb-4" size={48} />
                        <p className="text-white font-bold">Doğrulanıyor...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-6">
                  <div className={`flex items-center text-sm font-bold ${location ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <MapPin size={16} className="mr-1" /> Konum {location ? 'Tamam' : 'Alınıyor...'}
                  </div>
                  <div className="flex items-center text-sm font-bold text-yellow-500">
                    <Camera size={16} className="mr-1" /> Kamera Aktif
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'idle' && (
              <div className="py-12">
                <Smartphone className="mx-auto text-slate-200 mb-6" size={80} />
                <p className="text-slate-400 font-medium tracking-wide">Lütfen konum ve kamera yetkilerini onaylayın.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    }>
      <AttendanceContent />
    </Suspense>
  );
}
