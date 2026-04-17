"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Zap, Star, Calendar, CheckCircle2, ChevronRight, Globe } from "lucide-react";
import api from "@/lib/api";

export default function Home() {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [stats, setStats] = React.useState({
    alumni_count: 0,
    active_projects: 0,
    total_activities: 0,
    satisfaction_rate: 100
  });

  React.useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("kademe_token"));
    
    Promise.all([
      api.get("/projects"),
      api.get("/activities"),
      api.get("/public-stats").catch(() => ({ data: { alumni_count: 500, active_projects: 4, total_activities: 12, satisfaction_rate: 94 } }))
    ]).then(([projRes, actRes, statsRes]) => {
      setProjects(projRes.data.slice(0, 4));
      // Sadece gelecek tarihli etkinlikleri al, tarihe göre sırala, max 5
      const now = new Date();
      const upcoming = actRes.data
        .filter((a: any) => new Date(a.start_time) >= now)
        .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 5);
      setActivities(upcoming);
      if(statsRes?.data) setStats(statsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const getIcon = (name: string) => {
    if (name.includes("Diplomasi")) return Globe;
    if (name.includes("Euro")) return Zap;
    if (name.includes("KPD")) return Star;
    return Users;
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
              KADEME Yönetim Sistemi 2024
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Gençlerin potansiyelini<br />
              <span className="text-slate-900">dijital platformda</span> açıyoruz.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
              KADEME bünyesindeki tüm projeleri tek bir platform üzerinden yönetin. 
              Başvuru, yoklama, kredi ve katılımcı süreçlerini dijital olarak takip edin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/projeler">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm uppercase tracking-widest text-[11px]">
                  Faaliyetleri İncele
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/hakkimizda">
                <button className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors uppercase tracking-widest text-[11px]">
                  Hakkımızda
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: stats.alumni_count.toString() + "+", label: "Mezun Katılımcı" },
              { value: stats.active_projects.toString(), label: "Aktif Program" },
              { value: stats.total_activities.toString(), label: "Toplam Etkinlik" },
              { value: "%" + stats.satisfaction_rate.toString(), label: "Memnuniyet Oranı" },
            ].map((statItem) => (
              <div key={statItem.label} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{statItem.value}</div>
                <div className="text-sm text-gray-500">{statItem.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Projelerimiz</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">Aktif Faaliyet Alanları</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, idx) => {
              const Icon = getIcon(project.name);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/projeler/${project.id}`}>
                    <div className="group p-6 bg-white border border-gray-100 rounded-2xl hover:border-slate-200 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <Icon size={20} className="text-slate-500 group-hover:text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{project.is_active ? "Aktif" : "Pasif"}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 font-medium line-clamp-2">{project.description}</p>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 group-hover:gap-2 transition-all uppercase tracking-widest">
                        İncele <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Takvim</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">Yaklaşan Etkinlikler</h2>
            </div>
            <Link href="/etkinlikler" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-widest">
              Tümünü gör →
            </Link>
          </div>
          <div className="space-y-4">
            {activities.map((event, i) => (
              <div key={event.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-slate-200 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-slate-50 transition-colors">
                    <Calendar size={20} className="text-gray-400 group-hover:text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-3">
                      {event.name}
                      {event.project?.name && (
                        <span className="text-[9px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          {event.project.name}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                      {new Date(event.start_time).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })} · {event.room_name || 'Ana Kampüs'}
                    </p>
                  </div>
                </div>
                <Link href={`/projeler/${event.project_id}`}>
                  <button className="text-[10px] font-bold text-slate-600 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-widest">
                    PROJEYİ İNCELE
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
