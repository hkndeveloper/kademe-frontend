"use client";

import React, { useEffect, useState } from 'react';
import { 
  Award, 
  Flag, 
  Heart, 
  BookOpen, 
  Clock, 
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';
import api from '@/lib/api';

const iconMap: any = {
  Flag: Flag,
  Heart: Heart,
  BookOpen: BookOpen,
  Clock: Clock,
};

export default function BadgesPage() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await api.get('/student/badges');
        setBadges(res.data);
      } catch (err) {
        console.error('Rozetler çekilemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 underline decoration-yellow-500 underline-offset-8">Gelişim ve Rozetlerim</h1>
        <p className="text-slate-500 font-medium mt-4">KADEME yolculuğunda kazandığın başarılar ve hedeflerin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
             [1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-[3rem]"></div>)
        ) : badges.length > 0 ? badges.map((badge: any) => {
          const IconComponent = iconMap[badge.icon] || Award;
          return (
            <div 
              key={badge.id}
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border-2 border-yellow-500 shadow-xl shadow-yellow-500/5 relative overflow-hidden group"
            >
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-yellow-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               
               <div className="w-20 h-20 bg-yellow-500 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-yellow-500/20">
                  <IconComponent size={40} />
               </div>

               <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{badge.name}</h3>
                  <CheckCircle2 size={20} className="text-emerald-500" />
               </div>
               
               <p className="text-slate-500 font-medium leading-relaxed mb-6">{badge.description}</p>
               
               <div className="text-[10px] font-black text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-full inline-block">
                  KAZANILDI: {new Date(badge.pivot?.awarded_at || badge.updated_at).toLocaleDateString()}
               </div>
            </div>
          );
        }) : (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200">
               <Award size={64} className="text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-bold">Henüz hiç rozet kazanmadın.</p>
            </div>
        )}

        {/* Locked Badges Placeholder */}
        {!loading && (
          <>
            <LockedBadge 
              name="Akademisyen" 
              desc="Bir projenin tüm eğitimlerini tamamladığında açılır." 
              icon={BookOpen} 
            />
             <LockedBadge 
              name="Dakik" 
              desc="Tüm yoklamalarını vaktinde verdiğinde kazanılır." 
              icon={Clock} 
            />
          </>
        )}
      </div>

      <div className="mt-20 p-8 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="absolute left-0 bottom-0 w-64 h-64 bg-yellow-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
         <div className="w-24 h-24 bg-yellow-500 rounded-3xl flex items-center justify-center shrink-0">
            <Info size={40} />
         </div>
         <div className="flex-1 text-center md:text-left relative z-10">
            <h4 className="text-2xl font-bold mb-2">Rozetler Ne İşe Yarar?</h4>
            <p className="text-slate-400 font-medium leading-relaxed">Kazandığın rozetler dijital CV'nde otomatik olarak görüntülenir. Bazı rozetler belirli projelere katılım hakkı veya özel hediye kitleri kazanmanı sağlar. Daha fazla faaliyet, daha fazla rozet!</p>
         </div>
      </div>
    </div>
  );
}

function LockedBadge({ name, desc, icon: Icon }: any) {
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 opacity-60 relative overflow-hidden group grayscale hover:grayscale-0 transition-all">
            <div className="absolute right-8 top-8 text-slate-300">
                <Lock size={20} />
            </div>
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-[2rem] flex items-center justify-center mb-8">
                <Icon size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-2">{name}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}
