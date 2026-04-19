"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Save, 
  RefreshCcw, 
  ShieldCheck, 
  MessageSquare, 
  Coins, 
  AlertTriangle,
  Layout,
  Target,
  BarChart3,
  Camera,
  Plus,
  Trash2,
  Info
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("system"); // system, website, stats, social

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch (err) {
      toast.error("Ayarlar çekilemedi");
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string) => settings.find(s => s.key === key);

  const updateLocalSetting = (key: string, value: any) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: typeof value === 'string' ? value : JSON.stringify(value) } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // API expects settings array with key/value pairs
      await api.post("/settings/bulk", { settings });
      toast.success("Tüm ayarlar başarıyla güncellendi!");
    } catch (err) {
      toast.error("Ayarlar kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 font-medium italic animate-pulse">
      <RefreshCcw className="animate-spin mb-4" size={32} />
      Ayarlar yükleniyor...
    </div>
  );

  return (
    <div className="max-w-5xl pb-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kurumsal Yönetim Merkezi</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium italic">KADEME platformunun dijital ve fiziksel tüm parametrelerini buradan yönetin.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white text-[11px] font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 uppercase tracking-widest disabled:opacity-50 group"
        >
          {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} className="group-hover:scale-110 transition-transform" />}
          DEĞİŞİKLİKLERİ YAYINLA
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-2">
           <TabButton active={activeTab === "system"} icon={ShieldCheck} label="Sistem Ayarları" onClick={() => setActiveTab("system")} />
           <TabButton active={activeTab === "website"} icon={Layout} label="Site İçerikleri" onClick={() => setActiveTab("website")} />
           <TabButton active={activeTab === "stats"} icon={BarChart3} label="İstatistikler" onClick={() => setActiveTab("stats")} />
           <TabButton active={activeTab === "social"} icon={Camera} label="Sosyal Medya" onClick={() => setActiveTab("social")} />
        </aside>

        <main className="lg:col-span-3 space-y-8">
           <AnimatePresence mode="wait">
              {activeTab === "system" && (
                <motion.div key="system" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <SettingsSection title="Operasyonel Limitler" icon={Coins} accent="orange">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingInput title="Başlangıç Kredisi" desc="Öğrenci başlangıç kredisi." value={getSetting('initial_credits')?.value || "100"} onChange={(v: any) => updateLocalSetting('initial_credits', v)} />
                        <SettingInput title="Uyarı Eşiği" desc="SMS bildirimi için alt limit." value={getSetting('warning_threshold')?.value || "75"} onChange={(v: any) => updateLocalSetting('warning_threshold', v)} />
                        <SettingInput title="Devamsızlık Limiti" desc="Bloklama öncesi ihtar sayısı." value={getSetting('blacklist_absence_limit')?.value || "3"} onChange={(v: any) => updateLocalSetting('blacklist_absence_limit', v)} />
                        <SettingInput title="Blok Süresi (Gün)" desc="Yasaklama süresi." value={getSetting('blacklist_duration_days')?.value || "365"} onChange={(v: any) => updateLocalSetting('blacklist_duration_days', v)} />
                      </div>
                   </SettingsSection>
                   <SettingsSection title="İletişim & Entegrasyon" icon={MessageSquare} accent="blue">
                      <SettingInput title="Webasist SMS API Key" value={getSetting('sms_api_key')?.value || ""} onChange={(v: any) => updateLocalSetting('sms_api_key', v)} fullWidth />
                   </SettingsSection>
                </motion.div>
              )}

              {activeTab === "website" && (
                <motion.div key="website" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <SettingsSection title="Hakkımızda Metinleri" icon={Target} accent="indigo">
                      <div className="space-y-6">
                         <SettingTextArea title="Vizyonumuz" value={getSetting('vision_text')?.value || ""} onChange={(v: any) => updateLocalSetting('vision_text', v)} />
                         <SettingTextArea title="Misyonumuz" value={getSetting('mission_text')?.value || ""} onChange={(v: any) => updateLocalSetting('mission_text', v)} />
                      </div>
                   </SettingsSection>
                </motion.div>
              )}

              {activeTab === "stats" && (
                <motion.div key="stats" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <SettingsSection title="Anasayfa İstatistikleri" icon={BarChart3} accent="emerald">
                      <div className="mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                         <Info size={20} className="text-emerald-500" />
                         <p className="text-xs text-emerald-800 font-medium">Bu bölümdeki veriler anasayfada yer alan "KADEME Rakamlarla" kısmını etkiler.</p>
                      </div>
                      
                      <div className="mb-8 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div>
                            <span className="text-sm font-bold text-slate-900 block">Manuel Mod</span>
                            <span className="text-[10px] text-slate-400 font-medium italic leading-none">Verileri elle girmek için bu modu aktif edin.</span>
                         </div>
                         <button 
                            onClick={() => updateLocalSetting('manual_stats_enabled', getSetting('manual_stats_enabled')?.value === 'true' ? 'false' : 'true')}
                            className={`w-14 h-8 rounded-full transition-all relative ${getSetting('manual_stats_enabled')?.value === 'true' ? 'bg-orange-500' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${getSetting('manual_stats_enabled')?.value === 'true' ? 'left-7' : 'left-1'}`} />
                         </button>
                      </div>

                      {getSetting('manual_stats_enabled')?.value === 'true' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ManualStatInput title="Alumni Count" field="alumni_count" settings={settings} onChange={updateLocalSetting} />
                            <ManualStatInput title="Active Projects" field="active_projects" settings={settings} onChange={updateLocalSetting} />
                            <ManualStatInput title="Total Activities" field="total_activities" settings={settings} onChange={updateLocalSetting} />
                            <ManualStatInput title="Satisfaction Rate" field="satisfaction_rate" settings={settings} onChange={updateLocalSetting} />
                         </div>
                      )}
                   </SettingsSection>
                </motion.div>
              )}

              {activeTab === "social" && (
                <motion.div key="social" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <SettingsSection title="Instagram Galerisi" icon={Camera} accent="pink">
                      <InstagramGallerySection settings={settings} onChange={updateLocalSetting} />
                   </SettingsSection>
                </motion.div>
              )}
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function TabButton({ active, icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
        active ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100/50"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function SettingsSection({ title, icon: Icon, children, accent }: any) {
  const accentColors: any = {
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-500",
    indigo: "bg-indigo-50 text-indigo-500",
    emerald: "bg-emerald-50 text-emerald-500",
    pink: "bg-pink-50 text-pink-500"
  };

  return (
    <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
       <div className="flex items-center gap-4 mb-10">
          <div className={`w-12 h-12 ${accentColors[accent]} rounded-2xl flex items-center justify-center`}>
             <Icon size={24} />
          </div>
          <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h2>
       </div>
       {children}
    </section>
  );
}

function SettingInput({ title, desc, value, onChange, fullWidth }: any) {
  return (
    <div className={`${fullWidth ? 'col-span-full' : ''} space-y-3`}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{title}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-[13px] font-black text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all"
      />
      {desc && <p className="text-[10px] text-slate-400 ml-1 font-medium italic">{desc}</p>}
    </div>
  );
}

function SettingTextArea({ title, value, onChange }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{title}</label>
      <textarea 
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-[13px] font-medium text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all leading-relaxed"
      />
    </div>
  );
}

function ManualStatInput({ title, field, settings, onChange }: any) {
  const jsonSetting = settings.find((s: any) => s.key === 'manual_stats_json');
  const stats = jsonSetting ? JSON.parse(jsonSetting.value) : {};
  
  const handleValChange = (val: string) => {
    const newStats = { ...stats, [field]: val };
    onChange('manual_stats_json', newStats);
  };

  return (
    <div className="space-y-3">
       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{title}</label>
       <input 
         type="text"
         value={stats[field] || ""}
         onChange={(e) => handleValChange(e.target.value)}
         placeholder="Örn: 500+ veya %94"
         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-[13px] font-black text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all"
       />
    </div>
  );
}

function InstagramGallerySection({ settings, onChange }: any) {
  const jsonSetting = settings.find((s: any) => s.key === 'insta_feed_json');
  const feed = jsonSetting ? JSON.parse(jsonSetting.value) : [];

  const addPost = () => {
    const newFeed = [...feed, { id: Date.now(), url: "", image: "" }];
    onChange('insta_feed_json', newFeed);
  };

  const removePost = (id: number) => {
    const newFeed = feed.filter((p: any) => p.id !== id);
    onChange('insta_feed_json', newFeed);
  };

  const updatePost = (id: number, key: string, val: string) => {
    const newFeed = feed.map((p: any) => p.id === id ? { ...p, [key]: val } : p);
    onChange('insta_feed_json', newFeed);
  };

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 gap-6">
          {feed.map((post: any, idx: number) => (
             <div key={post.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                <button 
                   onClick={() => removePost(post.id)}
                   className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                   <Trash2 size={14} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Görsel URL</label>
                      <input 
                         type="text" value={post.image} onChange={(e) => updatePost(post.id, 'image', e.target.value)}
                         className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-medium outline-none"
                         placeholder="https://..."
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Post Linki</label>
                      <input 
                         type="text" value={post.url} onChange={(e) => updatePost(post.id, 'url', e.target.value)}
                         className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-medium outline-none"
                         placeholder="https://instagram.com/p/..."
                      />
                   </div>
                </div>
             </div>
          ))}
       </div>
       <button 
          onClick={addPost}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
       >
          <Plus size={18} /> Yeni Post Ekle
       </button>
    </div>
  );
}
