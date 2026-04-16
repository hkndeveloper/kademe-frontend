"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Clock,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";

type Activity = {
  id: number;
  name: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  latitude?: number | null;
  longitude?: number | null;
  type: string;
  project?: { name?: string | null } | null;
};

type CalendarStatus = {
  connected: boolean;
  last_synced_at?: string | null;
  calendar_id?: string;
};

function CalendarContent() {
  const searchParams = useSearchParams();
  const [syncing, setSyncing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState<CalendarStatus>({
    connected: false,
    last_synced_at: null,
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    void fetchCalendarData();
  }, []);

  const googleCalendarMessage = searchParams.get("google_calendar");

  const fetchCalendarData = async () => {
    try {
      const [activityRes, statusRes] = await Promise.all([
        api.get("/activities"),
        api.get("/calendar/google/status"),
      ]);

      setActivities(activityRes.data);
      setStatus(statusRes.data);
    } catch (error) {
      console.error("Takvim verileri alinamadi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSync = async () => {
    setSyncing(true);

    try {
      await api.post("/calendar/google/sync-all");
      await fetchCalendarData();
      alert("Google Takvim senkronizasyonu tamamlandi.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const authRes = await api.get("/calendar/google/auth-url");
        window.location.href = authRes.data.auth_url;
        return;
      }

      alert("Google Takvim senkronizasyonu sirasinda bir hata olustu.");
    } finally {
      setSyncing(false);
    }
  };

  const handleGooglePull = async () => {
    setPulling(true);

    try {
      const res = await api.post("/calendar/google/sync-from-google");
      await fetchCalendarData();
      alert(`Google'dan guncelleme tamamlandi. ${res.data.updated_count} faaliyet guncellendi.`);
    } catch (error) {
      alert("Google'dan veri cekilirken bir hata olustu.");
    } finally {
      setPulling(false);
    }
  };

  const monthActivities = useMemo(() => {
    return activities
      .filter((activity) => {
        const activityDate = new Date(activity.start_time);
        return (
          activityDate.getFullYear() === currentMonth.getFullYear() &&
          activityDate.getMonth() === currentMonth.getMonth()
        );
      })
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );
  }, [activities, currentMonth]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu faaliyeti silmek istediginize emin misiniz?")) return;
    try {
      await api.delete(`/activities/${id}`);
      await fetchCalendarData();
    } catch {
      alert("Silme islemi basarisiz.");
    }
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = (currentMonth.getDay() + 6) % 7;
  const dayCells = Array.from({ length: firstWeekday + daysInMonth }, (_, i) =>
    i < firstWeekday ? null : i - firstWeekday + 1,
  );

  const eventsByDate = monthActivities.reduce<Record<string, Activity[]>>(
    (acc, activity) => {
      const day = new Date(activity.start_time).getDate().toString();
      acc[day] = [...(acc[day] || []), activity];
      return acc;
    },
    {},
  );

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <div className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-2">
            Program Akisi
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Faaliyet Takvimi
          </h1>
          <p className="text-gray-400 font-medium mt-1 text-sm">
            Tum projelerin zaman cizelgesi ve Google Takvim senkronizasyonu.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGoogleSync}
            disabled={syncing || pulling || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 text-[11px] font-bold rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            <span>{syncing ? "SYNCING..." : "PUSH TO GOOGLE"}</span>
          </button>
          <button
            onClick={handleGooglePull}
            disabled={syncing || pulling || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-orange-600 text-[11px] font-bold rounded-xl hover:bg-orange-50 transition-all uppercase tracking-widest shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={pulling ? "animate-spin" : ""} />
            <span>{pulling ? "PULLING..." : "PULL FROM GOOGLE"}</span>
          </button>
          <Link
            href="/dashboard/admin/activities/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[11px] font-bold rounded-xl hover:bg-black transition-all uppercase tracking-widest shadow-sm"
          >
            <Plus size={14} />
            <span>ETKINLIK EKLE</span>
          </Link>
        </div>
      </div>

      {(googleCalendarMessage || status.connected) && (
        <div className="mb-8 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm text-gray-700">
          <div className="font-semibold text-gray-900">
            {googleCalendarMessage === "success"
              ? "Google Takvim baglantisi tamamlandi."
              : status.connected
                ? "Google Takvim baglantisi aktif."
                : "Google Takvim baglanti durumu guncellenemedi."}
          </div>
          {status.last_synced_at && (
            <div className="mt-1 text-gray-500">
              Son senkronizasyon:{" "}
              {new Date(status.last_synced_at).toLocaleString("tr-TR")}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              {currentMonth.toLocaleDateString("tr-TR", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                className="p-2.5 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                className="p-2.5 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4 text-center">
            {["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"].map((day) => (
              <div
                key={day}
                className="text-[10px] font-bold text-gray-300 uppercase tracking-widest py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {dayCells.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayEvents = eventsByDate[String(day)] || [];
              const today = new Date();
              const isToday =
                day === today.getDate() &&
                currentMonth.getMonth() === today.getMonth() &&
                currentMonth.getFullYear() === today.getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-2xl p-2.5 flex flex-col items-center justify-start border transition-all ${
                    isToday
                      ? "bg-orange-50 border-orange-200 shadow-lg shadow-orange-500/5"
                      : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold mb-1.5 ${
                      isToday ? "text-orange-600" : "text-gray-400"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="flex flex-wrap justify-center gap-1 w-full">
                    {dayEvents.slice(0, 4).map((event) => (
                      <div
                        key={event.id}
                        className="w-1.5 h-1.5 rounded-full bg-orange-500"
                        title={event.name}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="px-1 flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Bu Aydaki Program
            </h3>
            <CalendarIcon size={16} className="text-gray-200" />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-sm text-gray-400">
                Takvim yukleniyor...
              </div>
            ) : monthActivities.length === 0 ? (
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-sm text-gray-400">
                Bu ay icin planli faaliyet bulunmuyor.
              </div>
            ) : (
              monthActivities.map((event) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  key={event.id}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-5 group"
                >
                  <div className="w-1.5 h-10 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <div className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mb-1">
                      {event.project?.name || event.type}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight mb-2 group-hover:text-orange-500 transition-colors">
                      {event.name}
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-300" />
                        {new Date(event.start_time).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-300" />
                        {event.latitude && event.longitude
                          ? `${event.latitude}, ${event.longitude}`
                          : "Konum girilmedi"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/dashboard/admin/activities`}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-lg transition-all"
                    >
                      <Edit2 size={14} />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event.id);
                      }}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <button
            onClick={handleGoogleSync}
            className="w-full p-8 bg-gray-900 rounded-[2.5rem] text-white overflow-hidden relative group cursor-pointer shadow-xl shadow-gray-900/10 transition-all hover:-translate-y-1 text-left"
          >
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">Disari Aktar</h4>
              <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">
                Tum faaliyetleri Google Takviminize baglayin ve tek tikla senkronize edin.
              </p>
              <div className="text-orange-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                TAKIP ET <ExternalLink size={12} />
              </div>
            </div>
            <CalendarIcon
              size={140}
              className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-500"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCalendar() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-gray-400 italic">
        Takvim yukleniyor...
      </div>
    }>
      <CalendarContent />
    </Suspense>
  );
}
