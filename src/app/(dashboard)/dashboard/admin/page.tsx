"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Activity as ActivityIcon,
  Bell,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import DashboardCharts from "@/components/DashboardCharts";

// UI Core Bileşenleri
import StatCard from "@/components/dashboard/StatCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";

type AdminStats = {
  totalUsers: number;
  activeProjects: number;
  upcomingActivities: number;
  avgAttendance: string;
  pendingApplications: number;
};

type ProjectSummary = {
  id: number;
  name: string;
  project_code?: string | null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeProjects: 0,
    upcomingActivities: 0,
    avgAttendance: "0%",
    pendingApplications: 0,
  });
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [roleLabel, setRoleLabel] = useState("Admin");

  useEffect(() => {
    const name = localStorage.getItem("user_name") || "Kullanıcı";
    const roles = JSON.parse(localStorage.getItem("user_roles") || "[]");
    setUserName(name);
    setRoleLabel(roles.includes("super-admin") ? "Üst Admin" : "Proje Koordinatörü");

    Promise.all([api.get("/projects"), api.get("/admin/stats"), api.get("/admin/visual-analytics")])
      .then(([projRes, statsRes, analyticsRes]) => {
        setProjects(projRes.data);
        setStats(statsRes.data);
        setAnalyticsData(analyticsRes.data);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl">
      <PageHeader 
        title={`Merhaba, ${userName}`}
        description={roleLabel === "Üst Admin" ? "Tüm sistem operasyonel özeti aşağıdadır." : "Sorumlu olduğunuz projelerin özeti aşağıdadır."}
        badge={<StatusBadge status={roleLabel} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Users} label="Toplam Katılımcı" value={stats.totalUsers} />
        <StatCard icon={Briefcase} label="Aktif Projeler" value={stats.activeProjects} />
        <StatCard icon={Calendar} label="Gelecek Faaliyetler" value={stats.upcomingActivities} />
        <StatCard 
          icon={TrendingUp} 
          label="Bekleyen Başvuru" 
          value={stats.pendingApplications} 
          variant="dark"
        />
      </div>

      <DashboardCard className="p-8 mb-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Katılım ve Büyüme Analitiği</h2>
          <button className="text-[10px] font-bold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">Detaylı Rapor</button>
        </div>
        <DashboardCharts />
      </DashboardCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <DashboardCard className="lg:col-span-2">
          <div className="flex items-center justify-between p-10 border-b border-gray-50">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              {roleLabel === "Üst Admin" ? "Aktif Programlar" : "Sorumlu Olduğunuz Programlar"}
            </h2>
            <Link href="/dashboard/admin/projects" className="text-[10px] font-bold text-gray-400 hover:text-orange-500 uppercase tracking-widest transition-colors">
              Tümünü İncele
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="py-20 text-center text-xs text-gray-400 animate-pulse font-medium italic">Veriler yükleniyor...</div>
            ) : projects.length === 0 ? (
              <div className="py-20 text-center text-xs text-gray-300 italic">Yönetilecek aktif proje bulunmuyor.</div>
            ) : (
              <div className="space-y-2">
                {projects.slice(0, 4).map((project) => {
                  const analytics = analyticsData?.occupancy_rates?.find((rate: any) => rate.project_name === project.name);
                  const occupancy = analytics ? analytics.occupancy_rate : 0;
                  
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/admin/projects/${project.id}`}
                      className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:border-transparent transition-all shadow-sm">
                          <ActivityIcon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-gray-900">{project.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{project.project_code || "KDM-2024"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Kontenjan</div>
                          <div className="text-xs font-black text-gray-900 uppercase">Doluluk %{occupancy}</div>
                        </div>
                        <ChevronRight size={18} className="text-gray-200 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </DashboardCard>

        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Bell size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-black mb-3">Hızlı Duyuru</h3>
            <p className="text-sm text-gray-400 mb-10 leading-relaxed font-medium">
              Tüm aktif katılımcılara tek tıkla önemli duyuru gönderin.
            </p>
            <Link href="/dashboard/admin/announcements">
              <button className="w-full py-4 bg-white text-gray-900 text-xs font-extrabold rounded-2xl hover:bg-orange-500 hover:text-white transition-all uppercase tracking-[0.2em] shadow-lg">
                Yönetimi Başlat
              </button>
            </Link>
            <Bell size={180} className="absolute -bottom-12 -right-12 text-white/5 rotate-12" />
          </div>

          <DashboardCard className="p-10">
            <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-10">Sistem Logları</h3>
            <div className="space-y-8">
              <ActivityLine label="Yeni katılım başvurusu" time="15:30" />
              <ActivityLine label="Yoklama raporu çıktı" time="12:00" />
              <ActivityLine label="KVKK unutulma talebi" time="Dün" />
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

function ActivityLine({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform shadow-sm shadow-orange-500/50" />
      <div>
        <p className="text-xs font-bold text-gray-800 group-hover:text-gray-900">{label}</p>
        <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tight">{time}</p>
      </div>
    </div>
  );
}
