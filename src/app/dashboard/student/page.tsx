"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Settings, Activity, MessageSquare, Trophy, LayoutGrid, ShieldCheck,
  FileText, Download, Award
} from "lucide-react";
import RewardChart from "@/components/RewardChart";
import KPDReports from "@/components/KPDReports";
import Forum from "@/components/Forum";
import api from "@/lib/api";
import Link from 'next/link';

const tabs = [
  { id: "overview", label: "Genel Durum", icon: LayoutGrid },
  { id: "attendance", label: "Yoklama & Kredi", icon: Activity },
  { id: "badges", label: "Rozetlerim", icon: Trophy },
  { id: "kpd", label: "KPD Raporları", icon: ShieldCheck },
  { id: "forum", label: "Forum", icon: MessageSquare },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("Katılımcı");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side only: get name from localStorage
    const savedName = localStorage.getItem("user_name");
    if (savedName) setName(savedName);

    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data.user);
        if (res.data.user.name) setName(res.data.user.name);
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const profile = user?.participant_profile || {};

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border-2"
            style={{ 
              borderColor: user?.current_tier?.frame_color || '#f3f4f6',
              boxShadow: user?.current_tier ? `0 0 10px ${user?.current_tier?.frame_color}22` : 'none'
            }}
          >
            <User size={28} className="text-gray-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{name}</h1>
              {user?.current_tier && (
                <span 
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${user.current_tier.frame_color}11`, color: user.current_tier.frame_color }}
                >
                  {user.current_tier.title}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-5">{user?.current_tier ? `Kademe ${user.current_tier.name} Lisanslı` : 'KADEME ekosistemine hoş geldiniz.'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Stat label="Mevcut Kredi" value={profile.credits?.toString() || "0"} />
              <Stat label="Katıldığı Proje" value={user?.applications_count?.toString() || "1"} />
              <Stat label="Rozet Sayısı" value={user?.badges?.length?.toString() || "0"} />
            </div>
          </div>
          <button className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
            <Settings size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 mb-8 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Active Programs */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Aktif Programlarım</h3>
                  <div className="space-y-4">
                    {user?.applications?.filter((a: any) => a.status === 'accepted').map((app: any) => (
                      <ProgramRow 
                        key={app.id}
                        name={app.project?.name} 
                        progress={45} // Calculate progress based on activity logs later
                        status="Aktif Katılımcı" 
                      />
                    ))}
                    {(!user?.applications?.find((a: any) => a.status === 'accepted')) && (
                      <div className="text-center py-8 text-gray-300 text-xs font-medium italic border border-dashed border-gray-100 rounded-xl">Henüz onaylanmış bir programınız bulunmuyor.</div>
                    )}
                  </div>
                </div>

                <RewardChart badgesCount={user?.badges?.length || 0} />
              </div>

              <div className="space-y-6">
                {/* Digital CV */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Dijital CV</h4>
                      <p className="text-xs text-gray-400">KADEME Onaylı</p>
                    </div>
                  </div>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download size={13} /> İndir
                  </button>
                </div>

                {/* Announcements */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Duyurular</h4>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-orange-200 pl-3">
                      Yeni KPD seansları takvime eklendi.
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-3">
                      Pergel Fellowship başvuruları 1 Nisan'da sona eriyor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "badges" && <RewardChart badgesCount={user?.badges?.length || 0} />}
          {activeTab === "kpd" && <KPDReports />}
          {activeTab === "forum" && <Forum />}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                 <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-orange-100">
                    <Activity size={40} className="text-orange-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Konum Bazlı Yoklama</h2>
                 <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed mb-10 font-medium">
                    Yoklama verebilmek için faaliyet alanında olmanız ve kameranızla QR kodu okutmanız gerekmektedir.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-500">
                          <ShieldCheck size={20} />
                       </div>
                       <div className="text-left">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Konum Durumu</div>
                          <div className="text-xs font-bold text-gray-800">Faaliyet Alanındasınız</div>
                       </div>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-orange-500">
                          <Activity size={20} />
                       </div>
                       <div className="text-left">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Sıradaki Oturum</div>
                          <div className="text-xs font-bold text-gray-800">14:00 - Pergel Fellowship</div>
                       </div>
                    </div>
                 </div>

                 <Link 
                    href="/dashboard/katilimci/yoklama?activity=1"
                    className="flex px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-900/10 items-center justify-center gap-3 mx-auto hover:bg-black transition-all group uppercase tracking-widest text-xs w-full max-w-sm"
                 >
                    <LayoutGrid size={18} className="group-hover:scale-110 transition-transform" />
                    KAMERAYI AÇ VE QR OKUT
                 </Link>
              </div>

              {/* Attendance History */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8">Yoklama Geçmişi (Bu Dönem)</h3>
                  <div className="space-y-3">
                    {user?.attendances?.map((att: any) => (
                      <AttendanceRecord 
                        key={att.id}
                        activity={att.activity?.name} 
                        date={new Date(att.activity?.start_time).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} 
                        status={att.status === 'present' ? 'Katıldı' : 'Katılmadı'} 
                        credits={att.status === 'present' ? '+0' : `-${att.activity?.credit_loss_amount || 10}`} 
                        warning={att.status !== 'present'} 
                      />
                    ))}
                    {(!user?.attendances || user?.attendances?.length === 0) && (
                       <div className="py-12 text-center text-gray-400 text-xs font-medium italic border border-dashed border-gray-100 rounded-2xl">Henüz yoklama kaydınız bulunmuyor.</div>
                    )}
                  </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function ProgramRow({ name, progress, status }: { name: string; progress: number; status: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-800">{name}</span>
        <span className="text-xs text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-full">{status}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full bg-orange-500 rounded-full"
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-400">{progress}%</span>
      </div>
    </div>
  );
}

function AttendanceRecord({ activity, date, status, credits, warning }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all group">
       <div className="flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full ${warning ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'}`} />
          <div>
             <div className="text-sm font-bold text-gray-800">{activity}</div>
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</div>
          </div>
       </div>
       <div className="text-right">
          <div className={`text-xs font-bold uppercase tracking-widest ${warning ? 'text-red-500' : 'text-green-600'}`}>{status}</div>
          <div className="text-[10px] font-bold text-gray-400">{credits} Kredi</div>
       </div>
    </div>
  );
}

