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
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, activityRes, badgeRes] = await Promise.all([
          api.get('/user'),
          api.get('/activities'),
          api.get('/student/badges')
        ]);
        setProfile(profileRes.data.user);
        setActivities(activityRes.data);
        setBadges(badgeRes.data);
      } catch (err) {
        console.error('Veri çekilemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <ParticipantSkeleton />;

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

      {/* Welcome Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white mb-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Merhaba, {profile?.name}!</h1>
            <p className="text-slate-400">KADEME yolculuğunda bugün neler var?</p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-6">
            <div className="text-center px-6 border-r border-slate-800">
              <div className="text-3xl font-bold text-slate-300">{profile?.participant_profile?.credits || 100}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Mevcut Kredi</div>
            </div>
            <div className="text-center px-6">
              <div className="text-3xl font-bold text-slate-300">{badges.length}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Rozet</div>
            </div>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Activities */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Yaklaşan Faaliyetler</h2>
              <button className="text-slate-600 font-bold flex items-center text-sm">
                Tümünü Gör <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activities.length > 0 ? activities.slice(0, 4).map((activity: any) => (
                <div key={activity.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between mb-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{activity.type.toUpperCase()}</span>
                    <span className="text-slate-400"><Clock size={16} /></span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{activity.name}</h3>
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <MapPin size={14} className="mr-1" />
                    {activity.project?.name || 'KADEME'}
                  </div>
                  {activity.is_accessible === false ? (
                    <div className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 dark:bg-slate-800/50 rounded-2xl text-gray-400 font-bold cursor-not-allowed">
                      <AlertTriangle size={18} />
                      <span>Bu Programa Kayıtlı Değilsiniz</span>
                    </div>
                  ) : (
                    <Link 
                      href={`/dashboard/katilimci/yoklama?activity=${activity.id}`}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors text-slate-900 dark:text-white font-bold"
                    >
                      <Smartphone size={18} />
                      <span>QR Yoklama Ver</span>
                    </Link>
                  )}
                </div>
              )) : (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-3xl text-slate-400">
                  Henüz bir faaliyet bulunamadı.
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
              <Link href="/dashboard/katilimci/bohca"><BundleItem label="Eğitim Materyalleri" count="+" /></Link>
              <Link href="/dashboard/katilimci/sertifikalar"><BundleItem label="Sertifikalar" count="İndir" /></Link>
              <Link href="/dashboard/katilimci/mesajlar"><BundleItem label="Mesajlar" count="0" /></Link>
              <Link href="/dashboard/katilimci/raporlar"><BundleItem label="KPD Raporlarım" count="Görüntüle" /></Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <User size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{profile?.name}</h3>
                <p className="text-sm text-slate-500">{profile?.participant_profile?.university || 'Üniversite Belirtilmemiş'}</p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <ProfileInfoItem icon={CheckCircle} label="Durum" value="Aktif Katılımcı" color="text-emerald-500" />
              <ProfileInfoItem icon={CreditCard} label="Kredi Durumu" value="Kritik Değil" color="text-blue-500" />
            </div>
            <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center group">
              Profilimi Düzenle
              <ExternalLink size={18} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
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
            <Link href="/dashboard/katilimci/rozetler" className="block text-center mt-6 text-sm font-bold text-yellow-600">Tüm Rozetleri Gör</Link>
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
