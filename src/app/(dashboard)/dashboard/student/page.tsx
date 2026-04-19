"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  MapPin, 
  Smartphone, 
  CreditCard,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
  AlertTriangle
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ParticipantDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [bundleStats, setBundleStats] = useState({
    materials: 0,
    certificates: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, activityRes, badgeRes, materialsRes, certsRes, reportsRes] = await Promise.all([
          api.get('/user'),
          api.get('/activities'),
          api.get('/student/badges'),
          api.get('/student/bundle'),
          api.get('/student/certificates'),
          api.get('/student/reports')
        ]);
        setProfile(profileRes.data.user);
        setActivities(activityRes.data);
        setBadges(badgeRes.data);
        
        setBundleStats({
          materials: materialsRes.data?.length || 0,
          certificates: certsRes.data?.length || 0,
          reports: reportsRes.data?.length || 0,
        });
      } catch (err) {
        console.error('Veri çekilemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Zamanı her 10 saniyede bir güncelle (Live geçişleri için)
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <ParticipantSkeleton />;
  
  const liveActivities = activities.filter((a: any) => {
    const start = new Date(a.start_time);
    const end = new Date(a.end_time);
    return currentTime >= start && currentTime <= end && a.is_accessible !== false;
  });

  const upcomingActivities = activities.filter((a: any) => {
    const start = new Date(a.start_time);
    return start > currentTime && a.is_accessible !== false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Credit Warning Banner (Section 6.3) */}
      {profile?.participant_profile?.credits < 75 && (
        <div className="bg-red-500 text-white px-8 py-4 rounded-[2rem] mb-10 flex items-center justify-between shadow-lg shadow-red-500/20 animate-pulse">
          <div className="flex items-center space-x-4">
            <AlertTriangle size={24} />
            <div>
              <p className="font-bold underline text-lg">Kritik Kredi Uyarısı!</p>
              <p className="text-sm opacity-90 text-slate-100">Krediniz 75'in altına düştü. Bir faaliyete daha katılmazsanız sistemden çıkarılabilirsiniz.</p>
            </div>
          </div>
          <div className="text-3xl font-black">{profile?.participant_profile?.credits}</div>
        </div>
      )}

      {/* Welcome Header - Refined Corporate Light */}
      <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200/60 mb-10 relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-orange-100">Sistem Aktif</span>
              <span className="text-slate-400 text-[10px] font-medium tracking-widest">
                {currentTime.toLocaleTimeString('tr-TR')}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Merhaba, {profile?.name}!</h1>
            <p className="text-slate-500 font-medium text-sm">KADEME Dijital Yönetim Sistemi'ne hoş geldiniz.</p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-8">
            <div className="text-center px-6 border-r border-slate-100">
              <div className="text-3xl font-bold text-slate-900">{profile?.participant_profile?.credits || 100}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mevcut Kredi</div>
            </div>
            <div className="text-center px-6">
              <div className="text-3xl font-bold text-slate-900">{badges.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Rozet</div>
            </div>
          </div>
        </div>
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          
          {/* 1. SECTION: CANLI ETKINLIKLER (LIVE) */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">KADEME Canlı Akış</h2>
                <p className="text-slate-500 text-xs font-medium">Şu an gerçekleşen aktif kullanım alanları.</p>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Canlı</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {liveActivities.length > 0 ? liveActivities.map((activity: any) => (
                <motion.div 
                  layout
                  key={activity.id} 
                  className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-2.5 py-1 bg-orange-500 text-white text-[9px] font-bold rounded-md uppercase tracking-wider">{activity.type}</span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-md uppercase tracking-wider">ŞİMDİ</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{activity.name}</h3>
                      <div className="flex items-center space-x-6 text-xs text-slate-500 font-semibold">
                        <span className="flex items-center"><MapPin size={14} className="mr-2 text-orange-500" /> {activity.room_name || 'Ana Salon'}</span>
                        <span className="flex items-center"><Clock size={14} className="mr-2 text-orange-500" /> Bitiş: {new Date(activity.end_time).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    
                    {activity.has_attended ? (
                      <div className="w-full md:w-auto px-8 py-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center space-x-3 border border-emerald-100">
                        <CheckCircle size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">Yoklama Verildi</span>
                      </div>
                    ) : (
                      <Link 
                        href={`/dashboard/student/yoklama?activity=${activity.id}`}
                        className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 group-hover:shadow-slate-900/20"
                      >
                        <Smartphone size={20} />
                        <span className="font-bold text-xs uppercase tracking-widest">QR OKUT</span>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="py-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
                  <Clock size={40} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-semibold text-sm">Şu an devam eden bir faaliyet bulunmuyor.</p>
                </div>
              )}
            </div>
          </section>

          {/* 2. SECTION: YAKLASANLAR (AGENDA) */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">KADEME Ajandası</h2>
                <p className="text-slate-500 text-xs font-medium">Önümüzdeki günlerin faaliyet planı.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {upcomingActivities.length > 0 ? upcomingActivities.slice(0, 6).map((activity: any) => (
                <div key={activity.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:border-orange-200 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 font-bold">
                      <span className="text-[9px] leading-none uppercase">
                        {new Date(activity.start_time).toLocaleDateString('tr-TR', {month: 'short'})}
                      </span>
                      <span className="text-lg leading-tight">
                        {new Date(activity.start_time).getDate()}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-md uppercase tracking-widest border border-slate-100">YAKLAŞAN</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-orange-600 transition-colors">{activity.name}</h3>
                  <div className="flex flex-col space-y-2 mb-6">
                    <div className="flex items-center text-xs font-semibold text-slate-400">
                      <MapPin size={14} className="mr-2 text-slate-200" />
                      {activity.project?.name || 'KADEME'}
                    </div>
                    <div className="flex items-center text-xs font-semibold text-slate-400">
                      <Clock size={14} className="mr-2 text-slate-200" />
                      Başlangıç: {new Date(activity.start_time).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="w-full py-2.5 bg-slate-50 text-slate-300 text-[9px] font-bold rounded-lg text-center uppercase tracking-widest border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-400 group-hover:border-orange-100 transition-all">
                     Henüz Başlamadı
                  </div>
                </div>
              )) : (
                <div className="col-span-2 py-10 text-center text-slate-300 italic font-medium">
                  Kayıtlı programlarınızda yaklaşan etkinlik bulunamadı.
                </div>
              )}
            </div>
          </section>

          {/* Education Bundle */}
          <section className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-8 border border-dashed border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Award className="mr-2 text-yellow-500" />
              Dijital Bohça
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/student/bohca"><BundleItem label="Eğitim Materyali" count={bundleStats.materials} /></Link>
              <Link href="/dashboard/student/sertifikalar"><BundleItem label="Sertifikalar" count={bundleStats.certificates} /></Link>
              <Link href="/dashboard/student/mesajlar"><BundleItem label="Mesajlar" count={0} /></Link>
              <Link href="/dashboard/student/raporlar"><BundleItem label="KPD Raporları" count={bundleStats.reports} /></Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <User size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{profile?.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{profile?.participant_profile?.university || 'Üniversite Belirtilmemiş'}</p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <ProfileInfoItem 
                icon={CheckCircle} 
                label="Durum" 
                value={profile?.participant_profile?.status === 'active' ? 'Aktif Katılımcı' : (profile?.participant_profile?.status || 'Bilinmiyor')} 
                color="text-emerald-600" 
              />
              <ProfileInfoItem 
                icon={CreditCard} 
                label="Kredi Durumu" 
                value={profile?.participant_profile?.credits < 75 ? 'Riskli Seviye' : 'Yeterli (Güvenli)'} 
                color={profile?.participant_profile?.credits < 75 ? 'text-red-600' : 'text-blue-600'} 
              />
            </div>
            <Link href="/dashboard/student/dijital-cv" className="w-full mt-8 py-3.5 bg-slate-950 text-white rounded-xl text-xs font-bold flex items-center justify-center group uppercase tracking-widest transition-all hover:bg-slate-800">
              Profilimi Düzenle
              <ExternalLink size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Recent Badges */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Son Kazandığın Rozetler</h3>
            <div className="flex flex-wrap gap-4">
              {badges.length > 0 ? badges.slice(0, 6).map((b: any) => (
                <div key={b.id} className="w-12 h-12 rounded-full border-2 border-yellow-500 bg-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm" title={b.name}>
                  <Award size={20} />
                </div>
              )) : (
                <p className="text-xs text-slate-400">Henüz rozet kazanılmadı.</p>
              )}
            </div>
            <Link href="/dashboard/student/rozetler" className="block text-center mt-6 text-sm font-bold text-yellow-600">Tüm Rozetleri Gör</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParticipantSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="shimmer h-48 rounded-[3rem] mb-10"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <div className="shimmer h-8 w-48 rounded-lg"></div>
            <div className="shimmer h-6 w-24 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="shimmer h-40 rounded-3xl"></div>
            ))}
          </div>
          <div className="shimmer h-32 rounded-3xl"></div>
        </div>
        <div className="space-y-6">
          <div className="shimmer h-64 rounded-3xl"></div>
          <div className="shimmer h-48 rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
}

function BundleItem({ label, count }: any) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{count}</div>
      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">{label}</div>
    </div>
  );
}

function ProfileInfoItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center text-sm text-slate-500">
        <Icon size={16} className="mr-2" />
        {label}
      </div>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}
