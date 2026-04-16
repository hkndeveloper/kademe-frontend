"use client";

import React, { useEffect, useState } from 'react';
import { 
  Award, 
  Download, 
  ChevronRight, 
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import api from '@/lib/api';

export default function CertificatesPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, profRes] = await Promise.all([
          api.get('/student/certificates'),
          api.get('/user')
        ]);
        setProjects(projRes.data);
        setProfile(profRes.data.user);
      } catch (err) {
        console.error('Sertifikalar çekilemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadCert = (projectId: number) => {
    const userId = profile?.id;
    if (!userId) return;
    
    // PHP Artisan serve ile yerelde çalıştığımız için direkt link veriyoruz
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/certificates/${projectId}/${userId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Sertifikalarım & Mezuniyet</h1>
        <p className="text-slate-500 font-medium">Büyük bir özveriyle tamamladığınız projelerin resmi belgeleri.</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
             {[1,2].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-3xl"></div>)}
          </div>
        ) : projects.length > 0 ? projects.map((project: any) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
          >
            {/* Success background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>

            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shrink-0">
               <ShieldCheck size={40} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h3>
                 <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">TAMAMLANDI</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Bu proje kapsamında gerekli tüm eğitim ve faaliyetleri başarıyla tamamladınız.</p>
            </div>

            <button 
              onClick={() => downloadCert(project.id)}
              className="flex items-center space-x-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              <Download size={20} />
              <span>Sertifikayı İndir</span>
            </button>
          </div>
        )) : (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <Award size={64} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Henüz tamamlanan bir projeniz bulunmuyor.</p>
            <p className="text-xs text-slate-400 mt-2">Projelerinizin tüm gereksinimlerini tamamladığınızda sertifikalarınız burada görünecektir.</p>
          </div>
        )}
      </div>

      <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800 flex items-start space-x-4">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-blue-600 shadow-sm">
             <Award size={24} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1 text-lg">Resmi Geçerlilik</h4>
            <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed font-medium">Tüm sertifikalar KADEME tarafından dijital olarak imzalanmış ve doğrulanabilir karekod (QR Code) ile sunulmaktadır. Dijital CV'nize ekleyerek doğruluğunu her zaman ispatlayabilirsiniz.</p>
          </div>
      </div>
    </div>
  );
}
