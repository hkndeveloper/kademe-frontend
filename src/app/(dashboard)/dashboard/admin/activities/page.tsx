"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MapPin,
  RefreshCw,
  Trash2,
  Users,
  Clock,
  Search,
  Edit2,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";

type Project = {
  id: number;
  name: string;
};

type Activity = {
  id: number;
  name: string;
  description?: string | null;
  type: string;
  room_name?: string | null;
  start_time: string;
  end_time: string;
  radius: number;
  latitude?: number | null;
  longitude?: number | null;
  credit_loss_amount?: number | null;
  project_id?: number | null;
  qr_code_secret?: string | null;
  project?: {
    name?: string | null;
  } | null;
};

type ParticipantSearchResult = {
  user_id: number;
  already_attended?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState<ParticipantSearchResult[]>([]);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    project_id: "",
    name: "",
    description: "",
    type: "event",
    room_name: "",
    start_time: "",
    end_time: "",
    latitude: "39.9334",
    longitude: "32.8597",
    radius: "100",
    credit_loss_amount: "10",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [actRes, projRes] = await Promise.all([
        api.get("/activities"),
        api.get("/projects"),
      ]);
      setActivities(actRes.data);
      setProjects(projRes.data);
    } catch (error) {
      console.error("Veriler cekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      project_id: "",
      name: "",
      description: "",
      type: "event",
      room_name: "",
      start_time: "",
      end_time: "",
      latitude: "39.9334",
      longitude: "32.8597",
      radius: "100",
      credit_loss_amount: "10",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/activities/${editingId}`, formData);
      } else {
        await api.post("/activities", formData);
      }
      setShowModal(false);
      resetForm();
      await fetchData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        alert("Faaliyet kaydi dogrulanamadi. Alanlari kontrol edin.");
        console.error("422 validation:", error.response.data);
        return;
      }

      alert("Faaliyet olusturulurken bir hata olustu.");
    }
  };

  const handleRefreshQR = async (id: number) => {
    try {
      await api.post(`/activities/${id}/refresh-qr`);
      await fetchData();
    } catch {
      alert("QR kod yenilenemedi.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/activities/${id}`);
      await fetchData();
    } catch {
      alert("Faaliyet silinemedi.");
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setFormData({
      project_id: activity.project_id?.toString() || "",
      name: activity.name,
      description: activity.description || "",
      type: activity.type,
      room_name: activity.room_name || "",
      start_time: activity.start_time ? new Date(activity.start_time).toISOString().slice(0, 16) : "",
      end_time: activity.end_time ? new Date(activity.end_time).toISOString().slice(0, 16) : "",
      latitude: activity.latitude?.toString() || "39.9334",
      longitude: activity.longitude?.toString() || "32.8597",
      radius: activity.radius.toString(),
      credit_loss_amount: activity.credit_loss_amount?.toString() || "10",
    });
    setShowModal(true);
  };

  const openManualAttendance = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowManualModal(true);
    setFoundUsers([]);
    setUserSearch("");
  };

  const searchUsers = async (query: string) => {
    setUserSearch(query);

    if (query.length < 3) {
      setFoundUsers([]);
      return;
    }

    try {
      const res = await api.get(`/participants?search=${encodeURIComponent(query)}`);
      setFoundUsers(res.data.data || res.data); // Handle both paginated and non-paginated responses
    } catch {
      console.error("Kullanici arama hatasi");
    }
  };

  const handleManualAttendance = async (userId: number) => {
    if (!selectedActivity) return;

    setMarkingId(userId);
    try {
      await api.post("/attendances/manual", {
        activity_id: selectedActivity.id,
        user_id: userId,
        note: "Admin tarafindan manuel giris yapildi.",
      });
      setFoundUsers((current) =>
        current.map((user) =>
          user.user_id === userId ? { ...user, already_attended: true } : user,
        ),
      );
      alert("Yoklama kaydedildi.");
    } catch {
      alert("Kayit sirasinda hata olustu.");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Faaliyet Planlama
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Oturumlar, egitimler ve etkinlik takvimi yonetimi.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-yellow-500/20 flex items-center space-x-2 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Yeni Faaliyet Planla</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
          ))
        ) : (
          activities.map((activity) => (
            <motion.div
              layout
              key={activity.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center space-x-6 flex-1">
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex flex-col items-center justify-center text-yellow-600 border border-yellow-100">
                  <span className="text-xs font-black uppercase">
                    {new Date(activity.start_time).toLocaleDateString("tr-TR", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-lg font-black">
                    {new Date(activity.start_time).getDate()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                      {activity.project?.name || "GENEL"}
                    </span>
                    <span className="text-[10px] font-black bg-yellow-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                      {activity.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activity.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-400">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {new Date(activity.start_time).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {activity.room_name || "Salon Belirtilmedi"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="flex flex-col items-end mr-4 hidden lg:block">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    QR Aktif
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-tighter truncate w-24 text-right">
                    {activity.qr_code_secret}
                  </div>
                </div>
                <Link
                  href={`/dashboard/admin/activities/${activity.id}/qr`}
                  title="Dinamik QR Paneli"
                  className="p-4 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                >
                  <QrCode size={20} />
                </Link>
                <button
                  onClick={() => handleRefreshQR(activity.id)}
                  title="QR Kod Yenile"
                  className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  onClick={() => openManualAttendance(activity)}
                  className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <Users size={20} />
                </button>
                <button
                  onClick={() => handleEdit(activity)}
                  className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                {editingId ? "Faaliyeti Duzenle" : "Yeni Faaliyet Olustur"}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  required
                >
                  <option value="">Proje secin</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>

                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  placeholder="Faaliyet adi"
                  required
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 min-h-28"
                  placeholder="Aciklama"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                >
                  <option value="event">Event</option>
                  <option value="training">Training</option>
                  <option value="program">Program</option>
                </select>
                <input
                  type="text"
                  value={formData.room_name}
                  onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  placeholder="Oda / Salon Adi (örn: Oda 1)"
                />
                <input
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  placeholder="Radius"
                />
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  required
                />
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  required
                />
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  placeholder="Latitude"
                />
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  placeholder="Longitude"
                />
                <input
                  type="number"
                  value={formData.credit_loss_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, credit_loss_amount: e.target.value })
                  }
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                  placeholder="Katilmama kredi dusumu"
                />

                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-yellow-500 text-white font-bold"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold"
                  >
                    Vazgec
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManualModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                Manuel Yoklama: {selectedActivity?.name}
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => searchUsers(e.target.value)}
                    placeholder="Katilimci ismi veya e-posta..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {foundUsers.map((participant) => (
                    <div
                      key={participant.user_id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {participant.user?.name || "Isimsiz"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {participant.user?.email}
                        </div>
                      </div>
                      <button
                        disabled={markingId === participant.user_id || participant.already_attended}
                        onClick={() => handleManualAttendance(participant.user_id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          participant.already_attended
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-900 text-white hover:bg-yellow-500"
                        }`}
                      >
                        {participant.already_attended ? "KATILDI" : "ISARETLE"}
                      </button>
                    </div>
                  ))}
                  {userSearch.length >= 3 && foundUsers.length === 0 && (
                    <p className="text-center py-4 text-slate-500 text-sm">
                      Kullanici bulunamadi.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowManualModal(false)}
                className="w-full mt-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white font-bold rounded-2xl hover:bg-slate-200 transition-all underline"
              >
                Kapat
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
