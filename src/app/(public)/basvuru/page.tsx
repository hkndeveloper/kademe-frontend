"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Book, School, Phone, FileText, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tc_no: "",
    phone: "",
    university: "",
    department: "",
    class: "",
    project_id: searchParams.get("project_id") || "",
    motivation_letter: ""
  });

  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data))
      .catch(() => {})
      .finally(() => setFetchingProjects(false));

    // Eğer kullanıcı giriş yapmışsa verilerini otomatik doldur
    if (localStorage.getItem("kademe_token")) {
      api.get("/user").then(res => {
        setIsLoggedIn(true);
        const { user } = res.data;
        const profile = user.participantProfile || {};
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          tc_no: profile.tc_no || "",
          phone: profile.phone || "",
          university: profile.university || "",
          department: profile.department || "",
          class: profile.class || ""
        }));
      }).catch(() => {});
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLoggedIn) {
        // Zaten hesapları varsa sadece projeye başvuru atsın (mevcut sisteme entegrasyon)
        await api.post("/applications", {
          project_id: formData.project_id,
          motivation_letter: formData.motivation_letter
        });
        toast.success("Başvurunuz başarıyla sisteme eklendi!");
        router.push("/dashboard/student");
      } else {
        // Sıfırdan yeni kayıt ve başvuru
        const res = await api.post("/register", formData);
        const { token, roles, user } = res.data;
        
        localStorage.setItem("kademe_token", token);
        localStorage.setItem("user_roles", JSON.stringify(roles));
        localStorage.setItem("user_name", user.name);

        toast.success("Hesabınız oluşturuldu ve başvurunuz alındı!");
        router.push("/dashboard/student");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Başvuru sırasında bir hata oluştu.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
            <Sparkles size={24} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">KADEME Başvuru Formu</h1>
          <p className="text-gray-500 mt-2 font-medium">Sistemimize dahil olmak için aşağıdaki formu doldurun.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-8 md:p-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personel Bilgiler */}
            <div>
              <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={14} /> Kişisel Bilgiler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Tam İsim" icon={User} placeholder="Ahmet Yılmaz" value={formData.name} readOnly={isLoggedIn} onChange={val => setFormData({...formData, name: val})} required />
                <InputField label="E-posta Adresi" type="email" icon={Mail} placeholder="ornek@mail.com" value={formData.email} readOnly={isLoggedIn} onChange={val => setFormData({...formData, email: val})} required />
                {!isLoggedIn && (
                  <InputField label="Şifre" type="password" icon={Lock} placeholder="••••••••" value={formData.password} onChange={val => setFormData({...formData, password: val})} required />
                )}
                <InputField label="TC Kimlik No" icon={FileText} placeholder="11 haneli" maxLength={11} value={formData.tc_no} readOnly={isLoggedIn} onChange={val => setFormData({...formData, tc_no: val})} required />
                <InputField label="Cep Telefonu" icon={Phone} placeholder="05xx xxx xx xx" value={formData.phone} readOnly={isLoggedIn} onChange={val => setFormData({...formData, phone: val})} />
              </div>
            </div>

            {/* Eğitim Bilgileri */}
            <div>
              <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <School size={14} /> Eğitim Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Üniversite" icon={School} placeholder="Hangi üniversitede okuyorsunuz?" value={formData.university} readOnly={isLoggedIn} onChange={val => setFormData({...formData, university: val})} />
                <InputField label="Bölüm" icon={Book} placeholder="Hangi bölümde okuyorsunuz?" value={formData.department} readOnly={isLoggedIn} onChange={val => setFormData({...formData, department: val})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sınıf</label>
                  <select 
                    value={formData.class}
                    disabled={isLoggedIn}
                    onChange={e => setFormData({...formData, class: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all disabled:opacity-50"
                  >
                    <option value="">Seçiniz</option>
                    <option value="hazirlik">Hazırlık</option>
                    <option value="1">1. Sınıf</option>
                    <option value="2">2. Sınıf</option>
                    <option value="3">3. Sınıf</option>
                    <option value="4">4. Sınıf</option>
                    <option value="mezun">Mezun</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Proje Başvurusu */}
            <div>
              <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles size={14} /> Program Seçimi
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Başvurmak İstediğiniz Program</label>
                  <select 
                    required
                    value={formData.project_id}
                    onChange={e => setFormData({...formData, project_id: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                  >
                    <option value="">Lütfen program seçin</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Motivasyon Mektubu (Opsiyonel)</label>
                  <textarea 
                    rows={5}
                    placeholder="Bu programa neden katılmak istiyorsunuz? Beklentileriniz neler?"
                    value={formData.motivation_letter}
                    onChange={e => setFormData({...formData, motivation_letter: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-gray-50">
               <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
               >
                 {loading ? <Loader2 size={18} className="animate-spin" /> : <>BAŞVURUYU TAMAMLA <ArrowRight size={18} /></>}
               </button>
               <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest leading-relaxed">
                 BU FORMU DOLDURARAK KADEME <u>BAŞVURU KOŞULLARI</u> VE <u>KVKK AYDINLATMA METNİNİ</u> <br /> OKUDUĞUNUZU VE KABUL ETTİĞİNİZİ ONAYLARSINIZ.
               </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    }>
      <ApplicationForm />
    </Suspense>
  );
}

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  icon: React.ComponentType<any>;
  onChange?: (val: string) => void;
}

function InputField({ label, icon: Icon, type = "text", onChange, ...props }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={16} />
        <input 
          type={type}
          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-gray-300"
          onChange={(e: any) => onChange?.(e.target.value)}
          {...props}
        />
      </div>
    </div>
  );
}
