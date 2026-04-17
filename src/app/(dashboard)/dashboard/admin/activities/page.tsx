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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";
import { toast } from "sonner";

// UI Core
import PageHeader from "@/components/dashboard/PageHeader";
import DashboardCard from "@/components/dashboard/DashboardCard";

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
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState<ParticipantSearchResult[]>([]);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [showAttendees, setShowAttendees] = useState(false);
  const [detailedActivity, setDetailedActivity] = useState<Activity | null>(null);
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
    void fetchData(1);
  }, []);

  const fetchData = async (targetPage = 1) => {
    setLoading(true);
    try {
      const [actRes, projRes] = await Promise.all([
        api.get(`/activities?page=${targetPage}`),
        api.get("/projects"),
      ]);
      setActivities(actRes.data.data || []);
      setPagination(actRes.data);
      setPage(actRes.data.current_page || 1);
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
        toast.success("Faaliyet güncellendi.");
      } else {
        await api.post("/activities", formData);
        toast.success("Yeni faaliyet planlandı.");
      }
      setShowModal(false);
      resetForm();
      await fetchData(page);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast.error("Form verileri doğrulanamadı.");
        return;
      }
      toast.error("İşlem sırasında hata oluştu.");
    }
  };

  const handleRefreshQR = async (id: number) => {
    try {
      await api.post(`/activities/${id}/refresh-qr`);
      toast.success("QR kod yenilendi.");
      await fetchData(page);
    } catch {
      toast.error("QR kod yenilenemedi.");
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Bu faaliyeti silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/activities/${id}`);
      toast.success("Faaliyet silindi.");
      await fetchData(page);
    } catch {
      toast.error("Faaliyet silinemedi.");
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

  const openAttendeeList = async (activity: Activity) => {
    setSelectedActivity(activity);
    try {
      const res = await api.get(`/activities/${activity.id}`);
      setDetailedActivity(res.data);
      setShowAttendees(true);
    } catch {
      toast.error("Katilimci listesi yuklenemedi.");
    }
  };

  const searchUsers = async (query: string) => {
    setUserSearch(query);

    if (query.length < 3) {
      setFoundUsers([]);
      return;
    }

    try {
      const res = await api.get(`/participants?search=${encodeURIComponent(query)}`);
      setFoundUsers(res.data.data || res.data);
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
      toast.success("Yoklama kaydedildi.");
    } catch {
      toast.error("Kayit sirasinda hata olustu.");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="max-w-6xl pb-20">
      <PageHeader 
        title="Faaliyet Planlaması"
        description="Oturumlar, eğitimler ve etkinlik takvimi yönetimi."
        icon={<Clock />}
        actions={
            <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="bg-gray-900 border border-transparent hover:bg-black text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-gray-900/10 flex items-center space-x-3 transition-all active:scale-95 uppercase text-[10px] tracking-widest"
            >
                <Plus size={18} />
                <span>Yeni Faaliyet Planla</span>
            </button>
        }
      />

      <div className="space-y-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <DashboardCard key={i} className="h-32 animate-pulse bg-gray-50/50" />
          ))
        ) : (
          <>
            {activities.map((activity) => (
                <motion.div
                layout
                key={activity.id}
                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500 transition-all flex flex-col md:flex-row items-center justify-between gap-8 group"
                >
                <div className="flex items-center space-x-6 flex-1">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 border border-gray-50 group-hover:bg-orange-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest mb-1">
                        {new Date(activity.start_time).toLocaleDateString("tr-TR", {
                        month: "short",
                        })}
                    </span>
                    <span className="text-2xl font-black">
                        {new Date(activity.start_time).getDate()}
                    </span>
                    </div>
                    <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="text-[9px] font-black bg-gray-900 text-white px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm">
                        {activity.project?.name || "GENEL"}
                        </span>
                        <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-lg uppercase tracking-widest">
                        {activity.type}
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                        {activity.name}
                    </h3>
                    <div className="flex items-center space-x-6 mt-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                        <span className="flex items-center">
                        <Clock size={14} className="mr-2 text-gray-300" />
                        {new Date(activity.start_time).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        </span>
                        <span className="flex items-center">
                        <MapPin size={14} className="mr-2 text-gray-300" />
                        {activity.room_name || "Salon Belirtilmedi"}
                        </span>
                    </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
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
                    className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                    >
                    <RefreshCw size={20} />
                    </button>
                    <button
                    onClick={() => openAttendeeList(activity)}
                    title="Katılanlar Listesi"
                    className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                    <Users size={20} />
                    </button>
                    <button
                    onClick={() => openManualAttendance(activity)}
                    title="Manuel Yoklama Al"
                    className="p-4 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                    >
                    <User size={20} />
                    </button>
                    <button
                    onClick={() => handleEdit(activity)}
                    className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                    >
                    <Edit2 size={20} />
                    </button>
                    <button
                    onClick={() => handleDelete(activity.id)}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                    <Trash2 size={20} />
                    </button>
                </div>
                </motion.div>
            ))}

            {activities.length === 0 && (
                <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-gray-100 border-dashed">
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Planlanmış faaliyet bulunmuyor.</p>
                </div>
            )}

            {/* Sayfalama Kontrolleri */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                        disabled={page === 1}
                        onClick={() => fetchData(page - 1)}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {[...Array(pagination.last_page)].map((_, i) => (
                            <button
                            key={i + 1}
                            onClick={() => fetchData(i + 1)}
                            className={`w-12 h-12 rounded-2xl text-xs font-black transition-all ${
                                page === i + 1 
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                                : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                            }`}
                            >
                            {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        disabled={page === pagination.last_page}
                        onClick={() => fetchData(page + 1)}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
          </>
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
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
                {editingId ? "Faaliyeti Düzenle" : "Yeni Faaliyet Oluştur"}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bağlı Proje</label>
                    <select
                        value={formData.project_id}
                        onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                        required
                    >
                    <option value="">Proje seçin</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                        {project.name}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Faaliyet Adı</label>
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                        placeholder="Örn: SQL Eğitim Oturumu 1"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Açıklama</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10 min-h-28"
                        placeholder="Faaliyet içeriği hakkında kısa bilgi..."
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tür</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                    >
                    <option value="event">Etkinlik</option>
                    <option value="training">Eğitim</option>
                    <option value="program">Program</option>
                    </select>
                </div>
                
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Salon / Oda</label>
                    <input
                        type="text"
                        value={formData.room_name}
                        onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                        placeholder="Örn: Konferans Salonu"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Başlangıç</label>
                    <input
                        type="datetime-local"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                        required
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Bitiş</label>
                    <input
                        type="datetime-local"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Lokalizasyon Radius (M)</label>
                    <input
                        type="number"
                        value={formData.radius}
                        onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                        placeholder="Radius"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Kredi Kaybı</label>
                    <input
                        type="number"
                        value={formData.credit_loss_amount}
                        onChange={(e) =>
                            setFormData({ ...formData, credit_loss_amount: e.target.value })
                        }
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                        placeholder="Katılmama kredi düşümü"
                    />
                </div>

                <div className="md:col-span-2 flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-gray-900 border border-transparent text-white font-black text-[11px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-gray-900/10"
                  >
                    KAYDET
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-400 font-bold text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-all underline"
                  >
                    VAZGEÇ
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManualModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl">
              <h2 className="text-xl font-black text-slate-900 mb-2">Manuel Yoklama</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">{selectedActivity?.name}</p>

              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => searchUsers(e.target.value)}
                    placeholder="Katılımcı ismi veya e-posta..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {foundUsers.map((participant) => (
                    <div
                      key={participant.user_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-200 transition-all"
                    >
                      <div>
                        <div className="font-black text-gray-900 text-xs">
                          {participant.user?.name || "İsimsiz"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                          {participant.user?.email}
                        </div>
                      </div>
                      <button
                        disabled={markingId === participant.user_id || participant.already_attended}
                        onClick={() => handleManualAttendance(participant.user_id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                          participant.already_attended
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-900 text-white hover:bg-orange-500"
                        }`}
                      >
                        {participant.already_attended ? "KATILDI" : "İŞARETLE"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowManualModal(false)}
                className="w-full mt-10 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all underline"
              >
                KAPAT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAttendees && detailedActivity && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAttendees(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl">
              <h2 className="text-xl font-black text-slate-900 mb-2">Katılımcı Listesi</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">{detailedActivity.name}</p>

              <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {(detailedActivity as any).attendances?.length === 0 ? (
                  <p className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest italic">Henüz yoklama kaydı bulunmuyor.</p>
                ) : (
                  (detailedActivity as any).attendances?.map((att: any) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                           <User size={20} />
                        </div>
                        <div>
                          <div className="font-black text-gray-900 text-xs">
                            {att.user?.name || "İsimsiz"}
                          </div>
                          <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                            {new Date(att.created_at).toLocaleTimeString("tr-TR")}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                        KATILDI
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setShowAttendees(false)}
                className="w-full mt-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all uppercase text-[10px] tracking-widest"
              >
                KAPAT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
