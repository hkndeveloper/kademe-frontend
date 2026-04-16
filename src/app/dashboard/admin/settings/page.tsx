"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Save, 
  RefreshCcw, 
  ShieldCheck, 
  MessageSquare, 
  Coins, 
  AlertTriangle 
} from "lucide-react";
import api from "@/lib/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Ayarlar çekilemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/settings/bulk", { settings });
      alert("Hüm sistem ayarları başarıyla güncellendi!");
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center animate-pulse text-gray-400 font-medium italic">Ayarlar yükleniyor...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sistem Ayarları</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Global değişkenler ve operasyonel limitler.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all shadow-sm uppercase tracking-widest disabled:opacity-50"
        >
          {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="space-y-6">
        {/* Kredi Ayarları */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                 <Coins size={20} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Kredi ve Ceza Sistemi</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingInput 
                title="Başlangıç Kredisi" 
                desc="Her öğrenci döneme bu kredi ile başlar."
                value={settings.find(s => s.key === 'initial_credits')?.value || "100"}
                onChange={(val) => handleChange('initial_credits', val)}
              />
              <SettingInput 
                title="Uyarı Eşiği" 
                desc="Kredi bu değerin altına düşerse SMS gönderilir."
                value={settings.find(s => s.key === 'warning_threshold')?.value || "75"}
                onChange={(val) => handleChange('warning_threshold', val)}
              />
           </div>
        </section>

        {/* Kara Liste Ayarları */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                 <AlertTriangle size={20} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Kara Liste (Blacklist) Mekanizması</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingInput 
                title="Absence Limit" 
                desc="Üst üste kaç devamsızlık kara listeye sokar?"
                value={settings.find(s => s.key === 'blacklist_absence_limit')?.value || "3"}
                onChange={(val) => handleChange('blacklist_absence_limit', val)}
              />
              <SettingInput 
                title="Engelleme Süresi" 
                desc="Kara listeye alınan aday kaç gün başvuramaz?"
                value={settings.find(s => s.key === 'blacklist_duration_days')?.value || "365"}
                onChange={(val) => handleChange('blacklist_duration_days', val)}
              />
           </div>
        </section>

        {/* İletişim Ayarları */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                 <MessageSquare size={20} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">İletişim API Ayarları</h2>
           </div>
           
           <div className="space-y-6">
              <SettingInput 
                title="Webasist SMS API Key" 
                desc="SMS gönderimi için gerekli gizli anahtar."
                value={settings.find(s => s.key === 'sms_api_key')?.value || ""}
                onChange={(val) => handleChange('sms_api_key', val)}
                fullWidth
              />
           </div>
        </section>
      </div>
    </div>
  );
}

function SettingInput({ title, desc, value, onChange, fullWidth }: any) {
  return (
    <div className={`${fullWidth ? 'col-span-full' : ''} space-y-2`}>
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{title}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
      />
      <p className="text-[10px] text-gray-400 ml-1 font-medium">{desc}</p>
    </div>
  );
}
