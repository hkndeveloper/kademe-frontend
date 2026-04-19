"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Lock, 
    CheckCircle2, 
    Sparkles, 
    ArrowRight, 
    Loader2, 
    ShieldCheck,
    PartyPopper
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AccountActivation() {
    const { token } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        // Token validasyonu simülasyonu
        const validateToken = async () => {
            try {
                // api.get(`/activation-token/${token}`)
                setTimeout(() => {
                    setUserData({ name: "Ahmet Yılmaz", email: "ahmet@mail.com" });
                    setValidating(false);
                }, 1500);
            } catch (err) {
                toast.error("Geçersiz veya süresi dolmuş onay linki.");
                router.push("/");
            }
        };
        validateToken();
    }, [token]);

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Şifreler uyuşmuyor.");
            return;
        }
        if (password.length < 6) {
            toast.error("Şifre en az 6 karakter olmalıdır.");
            return;
        }

        setLoading(true);
        try {
            // api.post(`/activate-account/${token}`, { password })
            setTimeout(() => {
                setIsSuccess(true);
                toast.success("Hesabınız aktive edildi! Yönlendiriliyorsunuz...");
                setTimeout(() => router.push("/login"), 3000);
            }, 2000);
        } catch (err) {
            toast.error("Aktivasyon sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Link Doğrulanıyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-24 font-sans">
            <div className="max-w-xl w-full">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div 
                            key="activation-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 text-center"
                        >
                            <div className="w-20 h-20 bg-orange-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/30">
                                <PartyPopper className="text-white" size={40} />
                            </div>

                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Tebrikler {userData?.name.split(' ')[0]}!</h1>
                            <p className="text-slate-500 font-medium mb-12">
                                KADEME programına kabul edildin. Hesabını tamamlamak için lütfen yeni bir şifre belirle.
                            </p>

                            <form onSubmit={handleActivate} className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yeni Şifre</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                        <input 
                                            type="password" 
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Şifreyi Onayla</label>
                                    <div className="relative group">
                                        <ShieldCheck size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                        <input 
                                            type="password" 
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 mt-10"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>HESABIMI AKTİVE ET <ArrowRight size={18} /></>}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="success-screen"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-16 border border-slate-100 shadow-2xl text-center"
                        >
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-white animate-bounce shadow-xl shadow-emerald-500/30">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Hoş Geldin, Kademe Üyesi!</h2>
                            <p className="text-slate-400 font-medium mb-12 uppercase text-[10px] tracking-[0.3em]">HESABINIZ BAŞARIYLA AKTİVE EDİLDİ</p>
                            
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10 flex items-center gap-6 text-left">
                                <Sparkles size={32} className="text-orange-500 shrink-0" />
                                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                    Artık projelerine erişebilir, yoklamanı takip edebilir ve KADEME topluluğuna katılabilirsin. Seni giriş sayfasına yönlendiriyoruz...
                                </p>
                            </div>
                            <Loader2 className="animate-spin mx-auto text-slate-300" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

import { AnimatePresence } from 'framer-motion';
