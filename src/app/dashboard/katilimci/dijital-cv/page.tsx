"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  ExternalLink, 
  Award, 
  ShieldCheck, 
  FileText,
  Briefcase,
  GraduationCap,
  History
} from 'lucide-react';
import api from '@/lib/api';

export default function DigitalCVPage() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const res = await api.get('/student/cv');
      setProfile(res.data.profile);
      setHistory(res.data.history);
      setBio(res.data.profile.participant_profile?.bio || '');
      setIsPublic(res.data.profile.participant_profile?.public_cv || false);
    } catch (err) {
      console.error('Veri çekilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put('/student/cv', { bio, public_cv: isPublic });
      setEditingBio(false);
      toast.success('CV bilgileriniz güncellendi.');
    } catch (err) {
      toast.error('Güncelleme sırasında hata oluştu.');
    }
  };

  const copyPublicLink = () => {
    const uuid = profile?.participant_profile?.cv_uuid;
    if (!uuid) return alert('Önce mezun olmanız veya CV kodunuzun oluşturulması gerekir.');
    const url = `${window.location.origin}/cv/${uuid}`;
    navigator.clipboard.writeText(url);
    toast.success('Kamuya açık CV linki kopyalandı!');
  };

  if (loading) return <div className="p-20 text-center">Dijital CV Hazırlanıyor...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Dijital CV</h1>
          <p className="text-slate-500">KADEME onaylı otomatik özgeçmiş profiliniz.</p>
        </div>
         <div className="flex space-x-3 text-sm">
           <button 
             onClick={() => setIsPublic(!isPublic)}
             className={`px-4 py-2 rounded-xl border font-bold transition-all ${isPublic ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
           >
             {isPublic ? 'Kamuya Açık' : 'Gizli Profile'}
           </button>
           <button 
             onClick={copyPublicLink}
             disabled={!isPublic}
             className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-600 hover:text-yellow-600 shadow-sm disabled:opacity-30"
             title="Link Paylaş"
           >
             <Share2 size={20} />
           </button>
           <button 
             onClick={() => window.print()}
             className="bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl flex items-center space-x-2"
           >
             <Download size={20} />
             <span>PDF Kaydet</span>
           </button>
         </div>
       </div>

      {/* CV Paper Component */}
      <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-1/3 bg-slate-950 text-white p-10 flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-800 rounded-3xl mb-6 border-4 border-yellow-500/20"></div>
          <h2 className="text-xl font-bold text-center mb-2 uppercase tracking-wide">{profile?.name}</h2>
          <p className="text-slate-500 text-xs text-center mb-8 uppercase font-bold tracking-widest">KADEME KATILIMCISI</p>
          
          <div className="w-full space-y-6 pt-8 border-t border-slate-800">
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-500">{profile?.participant_profile?.credits}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Mevcut Kredi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-500">{history.length}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Tamamlanan Proje</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-500">{profile?.badges?.length || 0}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Toplam Rozet</div>
            </div>
          </div>

          <div className="mt-auto pt-12 flex flex-col items-center text-center">
            <ShieldCheck className="text-emerald-500 mb-2" size={32} />
            <div className="text-[10px] text-slate-500 font-bold uppercase">KADEME SİSTEM ONAYLI</div>
            <div className="text-[8px] text-slate-600 font-mono mt-1">ID: KD-{profile?.id}-2026</div>
          </div>
        </div>

        {/* Main Section */}
        <div className="md:w-2/3 p-10 md:p-14 space-y-12">
          {/* Education */}
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              <GraduationCap className="mr-3 text-yellow-500" size={18} /> Eğitim Bilgileri
            </h3>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-900 dark:text-white leading-tight">{profile?.participant_profile?.university || 'Belirtilmemiş'}</div>
                <div className="text-sm text-slate-500">{profile?.participant_profile?.department || 'Bölüm'}</div>
              </div>
            </div>
          </section>

          {/* Kademe History */}
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              <History className="mr-3 text-yellow-500" size={18} /> KADEME Yolculuğu
            </h3>
            <div className="space-y-6">
              {history.map((h: any, i: number) => (
                <HistoryItem key={i} title={h.project_name} date={h.date} status={h.status} />
              ))}
              {history.length === 0 && <p className="text-xs text-slate-400">Henüz bir proje geçmişi bulunmuyor.</p>}
            </div>
          </section>

          {/* Badges and Skills */}
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              <Award className="mr-3 text-yellow-500" size={18} /> Rozetler & Yetkinlikler
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile?.badges?.map((b: any) => (
                <BadgeItem key={b.id} label={b.name} />
              ))}
              {(profile?.badges?.length === 0 || !profile?.badges) && <p className="text-xs text-slate-400">Rozet bulunmuyor.</p>}
            </div>
          </section>

          {/* Manual Section (Section 11.8: öğrenciler CV’lerine manuel eklemeler de yapabilirler) */}
          <section className="pt-8 border-t border-slate-100 dark:border-slate-800 border-dashed">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                  <FileText className="mr-3 text-yellow-500" size={18} /> Hakkımda & Bio
                </h3>
                <button 
                  onClick={() => editingBio ? handleUpdate() : setEditingBio(true)}
                  className="text-[10px] font-black text-blue-600 uppercase underline"
                >
                  {editingBio ? 'KAYDET' : 'DÜZENLE'}
                </button>
            </div>
            {editingBio ? (
               <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-yellow-200 rounded-2xl py-4 px-6 text-sm text-slate-900"
                rows={4}
              ></textarea>
            ) : (
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {bio || 'Kendinizden kısaca bahsedin...'}
                </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ title, date, status }: any) {
  return (
    <div className="flex justify-between items-center group">
      <div>
        <div className="text-slate-900 dark:text-white font-bold">{title}</div>
        <div className="text-xs text-slate-400">{date}</div>
      </div>
      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${status === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
        {status}
      </span>
    </div>
  );
}

function BadgeItem({ label }: any) {
  return (
    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-100 dark:border-slate-700">
      {label}
    </div>
  );
}
