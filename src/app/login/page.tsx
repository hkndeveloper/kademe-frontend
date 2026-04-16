"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Login, 2: 2FA
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      
      if (res.data.two_factor_required) {
        setStep(2);
        toast.info("Lütfen e-postanıza gönderilen 6 haneli kodu girin.");
        return;
      }

      completeLogin(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "E-posta veya şifre hatalı.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/verify-2fa", {
        email: email,
        code: twoFactorCode
      });
      completeLogin(res.data);
    } catch (err: any) {
      toast.error("Doğrulama kodu hatalı veya süresi dolmuş.");
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (data: any) => {
    const { token, roles, user } = data;
    localStorage.setItem("kademe_token", token);
    localStorage.setItem("user_roles", JSON.stringify(roles));
    localStorage.setItem("user_name", user.name);
    
    toast.success(`Hoş geldiniz, ${user.name}!`);

    if (roles.includes("super-admin") || roles.includes("coordinator")) {
      router.push("/dashboard/admin");
    } else if (roles.includes("alumni")) {
      router.push("/dashboard/alumni");
    } else {
      router.push("/dashboard/student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
            <Sparkles size={24} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">KADEME Sistemi</h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            {step === 1 ? 'Erişim Paneli' : 'Güvenlik Doğrulaması'}
          </p>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                {error && (
                  <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold rounded-xl uppercase tracking-widest">
                    {error}
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Kurumsal E-posta</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="isim@kademe.org"
                        className="w-full pl-12 pr-4 py-4 text-sm font-bold bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Şifre</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 text-sm font-bold bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/10 placeholder:text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-4 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Giriş Yap <ArrowRight size={16} /></>}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="2fa"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ShieldCheck size={32} />
                </div>
                <h3 className="text-sm font-bold mb-2">Doğrulama Kodu</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                   E-postanıza gönderilen 6 haneli kodu aşağıya girin.
                </p>
                <form onSubmit={verify2FA} className="space-y-6">
                  <input
                    type="text" maxLength={6} required
                    value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="000000"
                    className="w-full text-center text-2xl font-black tracking-[0.5em] py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none"
                  />
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-4 bg-blue-500 text-white text-xs font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 uppercase tracking-widest"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "DOĞRULAMAYI TAMAMLA"}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900">
                    Geri Dön
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
