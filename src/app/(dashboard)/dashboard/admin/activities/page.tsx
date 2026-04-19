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
  User,
  ShieldAlert,
  Archive,
  RotateCcw,
  EyeOff,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";
import { toast } from "sonner";

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
  deleted_at?: string | null;
  is_pinned: boolean | number;
};

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showAttendees, setShowAttendees] = useState(false);
  const [detailedActivity, setDetailedActivity] = useState<Activity | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "event",
    room_name: "",
    start_time: "",
    end_time: "",
    radius: 50,
    latitude: "",
    longitude: "",
    credit_loss_amount: 10,
    project_id: "",
    is_pinned: false,
  });

  const [userSearch, setUserSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [markingId, setMarkingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [actRes, projRes] = await Promise.all([
        api.get("/activities?include_archived=1"),
        api.get("/projects"),
      ]);
      setActivities(actRes.data);
      setProjects(projRes.data);
    } catch {
      toast.error("Veriler yuklenirken hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setFormData({
      name: activity.name,
      description: activity.description || "",
      type: activity.type,
      room_name: activity.room_name || "",
      start_time: activity.start_time.split(".")[0],
      end_time: activity.end_time.split(".")[0],
      radius: activity.radius,
      latitude: activity.latitude?.toString() || "",
      longitude: activity.longitude?.toString() || "",
      credit_loss_amount: activity.credit_loss_amount || 10,
      project_id: activity.project_id?.toString() || "",
      is_pinned: !!activity.is_pinned,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/activities/${editingId}`, formData);
        toast.success("Faaliyet guncellendi.");
      } else {
        await api.post("/activities", formData);
        toast.success("Yeni faaliyet olusturuldu.");
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        type: "event",
        room_name: "",
        start_time: "",
        end_time: "",
        radius: 50,
        latitude: "",
        longitude: "",
        credit_loss_amount: 10,
        project_id: "",
        is_pinned: false,
      });
      fetchData();
    } catch {
      toast.error("Islem sirasinda bir hata olustu.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu faaliyeti arsivlemek istediginize emin misiniz?")) return;
    try {
      await api.delete(`/activities/${id}`);
      toast.success("Faaliyet arsivlendi.");
      fetchData();
    } catch {
      toast.error("Hata olustu.");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await api.post(`/activities/${id}/restore`);
      toast.success("Faaliyet geri yuklendi.");
      fetchData();
    } catch {
      toast.error("Geri yukleme sirasinda hata olustu.");
    }
  };

  const handleRefreshQR = async (id: number) => {
    try {
      await api.post(`/activities/${id}/refresh-qr`);
      toast.success("QR Kod basariyla yenilendi.");
      fetchData();
    } catch {
      toast.error("QR yenilenirken hata olustu.");
    }
  };

  const handleProcessAbsences = async (id: number) => {
    if (!confirm("Yoklamayi kapatip tum gelmeyenlere eksi kredi tanimlamak istediginize emin misiniz? Bu islem geri alinamaz.")) return;
    try {
      await api.post(`/activities/${id}/process-absences`);
      toast.success("Islem basariyla tamamlandi.");
    } catch {
      toast.error("Islem sirasinda hata olustu.");
    }
  };

  const openAttendeeList = async (activity: Activity) => {
    try {
      const res = await api.get(`/activities/${activity.id}/attendances`);
      setDetailedActivity({ ...activity, attendances: res.data } as any);
      setShowAttendees(true);
    } catch {
      toast.error("Liste yuklenemedi.");
    }
  };

  const openManualAttendance = (activity: Activity) => {
    setSelectedActivity(activity);
    setFoundUsers([]);
    setUserSearch("");
    setShowManualModal(true);
  };

  const searchUsers = async (query: string) => {
    setUserSearch(query);
    if (query.length < 3) {
      setFoundUsers([]);
      return;
    }
    try {
      const resp = await api.get(`/participants/search?q=${query}&activity_id=${selectedActivity?.id}`);
      setFoundUsers(resp.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualAttendance = async (userId: number) => {
    try {
      setMarkingId(userId);
      await api.post("/attendances/manual", {
        activity_id: selectedActivity?.id,
        user_id: userId,
      });
      toast.success("Yoklama kaydedildi.");
      setFoundUsers((current) =>
        current.map((user) =>
          user.user_id === userId ? { ...user, already_attended: true } : user,
        ),
      );
    } catch {
      toast.error("Kayit sirasinda hata olustu.");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Faaliyet Planlama
            </h1>
            <p className="text-slate-500 mt-2 font-medium italic">
              {showArchived ? 'Arşivlenmiş faaliyetleri görüntülüyorsunuz.' : 'Oturumlar, egitimler ve etkinlik takvimi yonetimi.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest ${showArchived ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
              {showArchived ? <><CheckCircle size={18} /> Aktif Olanlar</> : <><Archive size={18} /> Arşivi Göster</>}
            </button>
            
            {!showArchived && (
              <button
                onClick={() => {
                   setEditingId(null);
                   setFormData({
                    name: "",
                    description: "",
                    type: "event",
                    room_name: "",
                    start_time: "",
                    end_time: "",
                    radius: 50,
                    latitude: "",
                    longitude: "",
                    credit_loss_amount: 10,
                    project_id: "",
                    is_pinned: false,
                  });
                   setShowModal(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-yellow-500/20 flex items-center space-x-2 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span>Yeni Faaliyet Planla</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
            ))
          ) : (
            activities.filter((a: any) => showArchived ? a.deleted_at : !a.deleted_at).map((activity) => (
              <motion.div
                layout
                key={activity.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${showArchived ? 'border-dashed border-slate-200 grayscale opacity-60' : 'border-slate-100 hover:shadow-lg'}`}
              >
                <div className="flex items-center space-x-6 flex-1">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${showArchived ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}>
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {new Date(activity.start_time).toLocaleDateString("tr-TR", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-xl font-black">
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
                      {activity.is_pinned && (
                        <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                          ⭐ SABİTLENDİ
                        </span>
                      )}
                      {showArchived && (
                        <span className="text-[10px] font-black bg-slate-400 text-white px-2 py-0.5 rounded uppercase tracking-wider italic">
                          ARŞİV
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
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
                  {!showArchived && (
                    <>
                      <div className="flex flex-col items-end mr-4 hidden lg:block">
                        <div className="text-sm font-bold text-slate-900">
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
                        className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                      >
                        <RefreshCw size={20} />
                      </button>
                      <button
                        onClick={() => handleProcessAbsences(activity.id)}
                        title="Devamsizliklari Isle & Yoklamayi Kapat"
                        className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <ShieldAlert size={20} />
                      </button>
                      <button
                        onClick={() => openAttendeeList(activity)}
                        title="Katilanlar Listesi"
                        className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        <Users size={20} />
                      </button>
                      <button
                        onClick={() => openManualAttendance(activity)}
                        title="Manuel Yoklama Al"
                        className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        <Users size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(activity)}
                        className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={20} />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => showArchived ? handleRestore(activity.id) : handleDelete(activity.id)}
                    className={`p-4 rounded-2xl transition-all shadow-sm ${showArchived ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-slate-50 text-slate-600 hover:bg-red-500 hover:text-white'}`}
                    title={showArchived ? "Geri Yukle" : "Arsivle"}
                  >
                    {showArchived ? <RotateCcw size={20} /> : <Archive size={20} />}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
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
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold"
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
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold placeholder:text-slate-400"
                  placeholder="Faaliyet adi"
                  required
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-medium placeholder:text-slate-400 min-h-28"
                  placeholder="Aciklama"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold"
                >
                  <option value="event">Event</option>
                  <option value="training">Training</option>
                  <option value="program">Program</option>
                </select>
                <input
                  type="text"
                  value={formData.room_name}
                  onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold"
                  placeholder="Oda / Salon Adi (örn: Oda 1)"
                />
                <input
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold"
                  placeholder="Radius"
                />
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all"
                  required
                />
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all"
                  required
                />
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold"
                  placeholder="Latitude"
                />
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold"
                  placeholder="Longitude"
                />
                <input
                  type="number"
                  value={formData.credit_loss_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, credit_loss_amount: Number(e.target.value) })
                  }
                  className="md:col-span-2 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-all font-bold"
                  placeholder="Katilmama kredi dusumu"
                />

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100 md:col-span-2">
                   <div>
                      <span className="text-[11px] font-black text-orange-900 block uppercase tracking-widest">Anasayfaya Sabitle</span>
                      <span className="text-[9px] text-orange-700 font-medium italic leading-none">Bu faaliyet anasayfadaki ana sliderda gözüksün mü?</span>
                   </div>
                   <button 
                      type="button"
                      onClick={() => setFormData({...formData, is_pinned: !formData.is_pinned})}
                      className={`w-12 h-7 rounded-full transition-all relative ${formData.is_pinned ? 'bg-orange-500' : 'bg-slate-200'}`}
                   >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.is_pinned ? 'left-6' : 'left-1'}`} />
                   </button>
                </div>

                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-yellow-500 text-white font-black uppercase tracking-widest text-xs"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-widest text-[10px]"
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
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20 font-bold"
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
                            : "bg-slate-900 text-white hover:bg-yellow-500 shadow-md shadow-slate-900/10"
                        }`}
                      >
                        {participant.already_attended ? "KATILDI" : "ISARETLE"}
                      </button>
                    </div>
                  ))}
                  {userSearch.length >= 3 && foundUsers.length === 0 && (
                    <p className="text-center py-4 text-slate-500 text-sm italic">
                      Kullanici bulunamadi.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowManualModal(false)}
                className="w-full mt-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                Kapat
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAttendees && detailedActivity && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAttendees(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Katilimci Listesi
              </h2>
              <p className="text-sm text-slate-500 mb-6">{detailedActivity?.name}</p>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {(detailedActivity as any)?.attendances?.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 italic">Henuz yoklama kaydi bulunmuyor.</p>
                ) : (
                  (detailedActivity as any)?.attendances?.map((att: any) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                           <User size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {att.user?.name || "Isimsiz"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {new Date(att.created_at).toLocaleTimeString("tr-TR")}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded">
                        KATILDI
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setShowAttendees(false)}
                className="w-full mt-6 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase text-[11px] tracking-widest shadow-xl shadow-slate-900/20"
              >
                Kapat
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
