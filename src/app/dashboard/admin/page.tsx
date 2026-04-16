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

  useEffect(() => {
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
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Merhaba, Admin</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Sistem geneli ve operasyonel ozetler asagidadir.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Toplam Katilimci" value={stats.totalUsers.toString()} />
        <StatCard icon={Briefcase} label="Aktif Projeler" value={stats.activeProjects.toString()} />
        <StatCard icon={Calendar} label="Gelecek Faaliyetler" value={stats.upcomingActivities.toString()} />
        <StatCard icon={TrendingUp} label="Bekleyen Basvuru" value={stats.pendingApplications.toString()} highlight />
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Katilim ve Buyume Analitigi</h2>
          <button className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Detayli Rapor</button>
        </div>
        <DashboardCharts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Aktif Programlar</h2>
            <Link href="/dashboard/admin/projects" className="text-[10px] font-bold text-gray-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
              Tumunu Incele
            </Link>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-400 animate-pulse font-medium">Veriler yukleniyor...</div>
            ) : projects.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">Yonetilecek aktif proje bulunmuyor.</div>
            ) : (
              <div className="space-y-1">
                {projects.slice(0, 4).map((project) => {
                  const analytics = analyticsData?.occupancy_rates?.find((rate: any) => rate.project_name === project.name);
                  const occupancy = analytics ? analytics.occupancy_rate : 0;
                  
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/admin/projects/${project.id}`}
                      className="flex items-center justify-between p-5 rounded-2xl hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-white transition-all">
                          <ActivityIcon size={16} className="text-slate-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-gray-900">{project.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{project.project_code || "PRJ-X"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Kontenjan</div>
                          <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">Doluluk %{occupancy}</div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-sm">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              <Bell size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">Hizli Duyuru</h3>
            <p className="text-xs text-slate-300 mb-8 leading-relaxed font-medium">
              Tum aktif katilimcilara tek tikla onemli duyuru gonderin.
            </p>
            <button className="w-full py-3 bg-white text-slate-900 text-[11px] font-bold rounded-xl hover:bg-slate-100 transition-all uppercase tracking-widest">
              Yonetimi Baslat
            </button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Sistem Loglari</h3>
            <div className="space-y-6">
              <ActivityLine label="Yeni katilim basvurusu" time="15:30" />
              <ActivityLine label="Yoklama raporu cikti" time="12:00" />
              <ActivityLine label="KVKK unutulma talebi" time="Dun" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm hover:border-slate-300 transition-all group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${highlight ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>
        <Icon size={20} />
      </div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function ActivityLine({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
      <div>
        <p className="text-xs font-bold text-gray-800">{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}
