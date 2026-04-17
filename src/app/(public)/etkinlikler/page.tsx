"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, List, CalendarDays, ArrowRight } from "lucide-react";
import api from "@/lib/api";

type Activity = {
  id: number;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  room_name?: string;
  type: string;
  project_id: number;
  project?: { id: number; name: string };
};

const DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export default function EtkinliklerPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [calDate, setCalDate] = useState(new Date());

  useEffect(() => {
    api.get("/activities?all=1")
      .then(res => setActivities(res.data.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const upcoming = useMemo(() =>
    activities
      .filter(a => new Date(a.start_time) >= now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
    [activities]
  );

  const past = useMemo(() =>
    activities
      .filter(a => new Date(a.start_time) < now)
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()),
    [activities]
  );

  const displayed = tab === "upcoming" ? upcoming : past;

  // Calendar helpers
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
  const adjustedFirst = (firstDay === 0 ? 6 : firstDay - 1); // Mon=0
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const activitiesThisMonth = activities.filter(a => {
    const d = new Date(a.start_time);
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  });

  const getActivitiesForDay = (day: number) =>
    activitiesThisMonth.filter(a => new Date(a.start_time).getDate() === day);

  const typeColor = (type: string) => {
    switch (type) {
      case "training": return "bg-blue-100 text-blue-700";
      case "event": return "bg-green-100 text-green-700";
      default: return "bg-orange-100 text-orange-700";
    }
  };
  const typeLabel = (type: string) => {
    switch (type) {
      case "training": return "Eğitim";
      case "event": return "Etkinlik";
      default: return "Program";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Takvim</span>
          <h1 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">Tüm Etkinlikler</h1>
          <p className="text-gray-500 mt-2 font-medium">KADEME bünyesindeki tüm program, eğitim ve etkinliklerin takvimi.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${tab === "upcoming" ? "bg-gray-900 text-white shadow" : "text-gray-400 hover:text-gray-700"}`}
            >
              Yaklaşan ({upcoming.length})
            </button>
            <button
              onClick={() => setTab("past")}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${tab === "past" ? "bg-gray-900 text-white shadow" : "text-gray-400 hover:text-gray-700"}`}
            >
              Geçmiş ({past.length})
            </button>
          </div>

          {/* View toggle */}
          <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setView("list")}
              title="Liste Görünümü"
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700"}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView("calendar")}
              title="Takvim Görünümü"
              className={`p-2 rounded-lg transition-all ${view === "calendar" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700"}`}
            >
              <CalendarDays size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* === LIST VIEW === */}
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                ))
              ) : displayed.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
                  <CalendarDays size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">{tab === "upcoming" ? "Yaklaşan etkinlik bulunmuyor." : "Geçmiş etkinlik bulunmuyor."}</p>
                </div>
              ) : displayed.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-orange-100">
                      <span className="text-lg font-black text-orange-500 leading-none">
                        {new Date(activity.start_time).getDate()}
                      </span>
                      <span className="text-[9px] font-bold text-orange-400 uppercase">
                        {MONTHS_TR[new Date(activity.start_time).getMonth()]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900">{activity.name}</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${typeColor(activity.type)}`}>
                          {typeLabel(activity.type)}
                        </span>
                        {activity.project?.name && (
                          <span className="text-[9px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                            {activity.project.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(activity.start_time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                          {activity.end_time && ` – ${new Date(activity.end_time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`}
                        </span>
                        {activity.room_name && activity.room_name !== "Gizli Konum" && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {activity.room_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={`/projeler/${activity.project_id}`}>
                    <button className="text-[10px] font-bold text-slate-600 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                      PROJEYİ İNCELE <ArrowRight size={11} />
                    </button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* === CALENDAR VIEW === */}
          {view === "calendar" && (
            <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <button onClick={() => setCalDate(new Date(calYear, calMonth - 1, 1))} className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                    <ChevronLeft size={18} />
                  </button>
                  <h3 className="text-base font-bold text-gray-900">
                    {MONTHS_TR[calMonth]} {calYear}
                  </h3>
                  <button onClick={() => setCalDate(new Date(calYear, calMonth + 1, 1))} className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 border-b border-gray-100">
                  {DAYS_TR.map(d => (
                    <div key={d} className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7">
                  {[...Array(adjustedFirst)].map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-gray-50 bg-gray-50/50" />
                  ))}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const dayActivities = getActivitiesForDay(day);
                    const isToday = new Date().getDate() === day && new Date().getMonth() === calMonth && new Date().getFullYear() === calYear;
                    return (
                      <div key={day} className={`min-h-[80px] p-2 border-b border-r border-gray-100 ${isToday ? "bg-orange-50/50" : "hover:bg-gray-50/50"} transition-colors`}>
                        <span className={`text-xs font-bold ${isToday ? "w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center" : "text-gray-700"}`}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-1">
                          {dayActivities.map(a => (
                            <Link key={a.id} href={`/projeler/${a.project_id}`}>
                              <div className="text-[9px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded truncate hover:bg-orange-200 transition-colors cursor-pointer">
                                {a.name}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              {activitiesThisMonth.length > 0 && (
                <div className="mt-6 p-5 bg-white rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{MONTHS_TR[calMonth]} Etkinlikleri</h4>
                  <div className="space-y-3">
                    {activitiesThisMonth.map(a => (
                      <div key={a.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          <span className="text-sm font-medium text-gray-800">{a.name}</span>
                          {a.project?.name && (
                            <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold uppercase">{a.project.name}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(a.start_time).getDate()} {MONTHS_TR[new Date(a.start_time).getMonth()]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
