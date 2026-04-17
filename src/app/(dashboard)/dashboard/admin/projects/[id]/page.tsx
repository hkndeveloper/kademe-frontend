"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar, 
  FileBox, 
  Settings, 
  Activity,
  UserCheck,
  Briefcase,
  MapPin,
  ChevronRight,
  Clock,
  Trash2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { toast } from "sonner";

export default function ProjectDashboard() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'flow' | 'waitlist'>('flow');
  
  // Activity Edit Modal State
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isNewActivity, setIsNewActivity] = useState(false);
  
  const [showAttendees, setShowAttendees] = useState(false);
  const [detailedActivity, setDetailedActivity] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data);
    } catch (err) {
      console.error('Veri çekilemedi');
      toast.error("Proje verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNewActivity) {
        await api.post('/activities', editingActivity);
        toast.success("Yeni faaliyet eklendi.");
      } else {
        await api.put(`/activities/${editingActivity.id}`, editingActivity);
        toast.success("Faaliyet güncellendi.");
      }
      setIsModalOpen(false);
      setIsNewActivity(false);
      fetchData();
    } catch (err) {
      toast.error('İşlem başarısız oldu.');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, project);
      setIsProjectModalOpen(false);
      toast.success("Proje bilgileri güncellendi.");
      fetchData();
    } catch (err) {
      toast.error('Proje güncellenemedi.');
    }
  };

  const handleDeleteActivity = async (actId: number) => {
    if(!confirm("Bu faaliyeti silmek istediğinize emin misiniz?")) return;
    try {
        await api.delete(`/activities/${actId}`);
        toast.success("Faaliyet silindi.");
        fetchData();
    } catch (err) {
        toast.error("Silme işlemi başarısız.");
    }
  };

  const moveWaitlist = async (currentIndex: number, direction: 'up' | 'down') => {
    const apps = [...(project.applications || [])];
    const waitlisted = apps.filter((a: any) => a.status === 'waitlisted');
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= waitlisted.length) return;

    // Hedef ve mevcut index'in (tüm uygulamalar içindeki asıl id'leri üzerinden) yerlerini değiştir.
    const currentApp = waitlisted[currentIndex];
    const targetApp = waitlisted[targetIndex];

    waitlisted[currentIndex] = targetApp;
    waitlisted[targetIndex] = currentApp;

    // Backend'e sadece waitlisted ID'lerinin yeni düz sıralamasını atıyoruz
    const newOrderedIds = waitlisted.map(a => a.id);
    
    try {
        await api.put(`/applications/${id}/waitlist-order`, { ordered_ids: newOrderedIds });
        toast.success("Sıralama güncellendi");
        fetchData();
    } catch (err) {
        toast.error("Sıralama güncellenemedi.");
    }
  };

  const openAttendeeList = async (activity: any) => {
    try {
      const res = await api.get(`/activities/${activity.id}`);
      setDetailedActivity(res.data);
      setShowAttendees(true);
    } catch {
      toast.error("Katılımcı listesi yüklenemedi.");
    }
  };

  if (loading) return <div className="p-12 text-center animate-pulse text-gray-400 font-medium italic">Veriler yükleniyor...</div>;
  if (!project) return <div className="p-12 text-center font-bold text-red-500 uppercase tracking-widest">PROJE BULUNAMADI</div>;

  const waitlistedApps = project.applications?.filter((a: any) => a.status === 'waitlisted') || [];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Link href="/dashboard/admin/projects" className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-orange-500 mb-8 transition-colors uppercase tracking-widest">
        <ArrowLeft size={16} className="mr-2" /> Projelere Dön
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-center shadow-sm">
               <Briefcase size={32} className="text-orange-500" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">{project.name}</h1>
                  <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${project.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {project.is_active ? 'AKTİF' : 'PASİF'}
                  </span>
               </div>
               <p className="text-gray-400 font-medium text-sm max-w-xl line-clamp-2">{project.description}</p>
            </div>
         </div>
         <div className="flex bg-white border border-gray-100 p-1 rounded-2xl shadow-sm">
            <button 
              onClick={() => setActiveTab('flow')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === 'flow' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              PROGRAM AKIŞI
            </button>
            <button 
              onClick={() => setActiveTab('waitlist')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === 'waitlist' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              YEDEK LİSTESİ
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sol Kolon: Taba Göre İçerik */}
        <div className="lg:col-span-2 space-y-8">
            {activeTab === 'flow' ? (
              <>
                <div className="flex justify-between items-center px-2">
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Faaliyet Planı</h3>
                   <div className="flex gap-3">
                      <Link href={`/dashboard/admin/projects/${id}/materials`}>
                         <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 text-[11px] font-bold rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
                            <FileBox size={14} />
                            MATERYALLER
                         </button>
                      </Link>
                      <button 
                        onClick={() => {
                          setIsNewActivity(true);
                          setEditingActivity({ 
                            name: '', 
                            latitude: 39.9334, 
                            longitude: 32.8597, 
                            radius: 100, 
                            credit_loss_amount: 10, 
                            project_id: id, 
                            type: 'event',
                            start_time: new Date().toISOString().slice(0, 16),
                            end_time: new Date(Date.now() + 7200000).toISOString().slice(0, 16) 
                          });
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-[11px] font-bold rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-sm"
                      >
                         <Plus size={14} />
                         YENİ FAALİYET
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   {project.activities?.length === 0 ? (
                      <div className="py-20 text-center bg-white rounded-[2.5rem] border border-gray-100 text-gray-300 text-sm font-medium italic">Bu proje için henüz bir faaliyet planlanmadı.</div>
                   ) : (
                      project.activities?.map((activity: any) => (
                         <motion.div 
                           whileHover={{ y: -4 }}
                           key={activity.id} 
                           className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group transition-all"
                         >
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                  <Calendar size={20} />
                               </div>
                               <div>
                                  <h4 className="text-sm font-bold text-gray-900 mb-1">{activity.name}</h4>
                                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                     <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(activity.start_time).toLocaleString('tr-TR')}</span>
                                     <span className="flex items-center gap-1.5"><MapPin size={12} /> {activity.radius}m Yarıçap</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link 
                                    href={`/dashboard/admin/activities/${activity.id}/qr`}
                                    className="p-3 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm"
                                    title="Yoklama Al (QR)"
                                >
                                    <Activity size={18} />
                                </Link>
                                <button
                                    onClick={() => openAttendeeList(activity)}
                                    title="Katılanlar Listesi"
                                    className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                                >
                                    <Users size={18} />
                                </button>
                                <button 
                                    onClick={() => { setEditingActivity(activity); setIsNewActivity(false); setIsModalOpen(true); }}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
                                >
                                    <Settings size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteActivity(activity.id)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                         </motion.div>
                      ))
                   )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Sıralı Yedek Listesi</h3>
                    <div className="text-[10px] font-bold text-white bg-orange-500 px-3 py-1 rounded-lg uppercase tracking-widest">
                        {waitlistedApps.length} ADAY BEKLİYOR
                    </div>
                 </div>
                 <div className="space-y-3">
                    {waitlistedApps.map((app: any, idx: number) => (
                        <div key={app.id} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 hover:bg-white transition-all group">
                           <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100 group-hover:border-orange-200">
                              {idx + 1}
                           </div>
                           <div className="flex-1">
                              <div className="text-sm font-bold text-gray-900">{app.user?.name}</div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{app.user?.participant_profile?.university || 'Üniversite Belirtilmedi'}</div>
                           </div>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => moveWaitlist(idx, 'up')} disabled={idx === 0} className="p-2 text-gray-300 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:hover:text-gray-300"><MoveUp size={16}/></button>
                              <button onClick={() => moveWaitlist(idx, 'down')} disabled={idx === waitlistedApps.length - 1} className="p-2 text-gray-300 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:hover:text-gray-300"><MoveDown size={16}/></button>
                           </div>
                        </div>
                    ))}
                    {waitlistedApps.length === 0 && (
                       <div className="py-20 text-center text-gray-300 text-sm font-medium italic">Şu an beklemede olan aday bulunmuyor.</div>
                    )}
                 </div>
              </div>
            )}
         </div>

        {/* Sağ Kolon: İstatistik & Araçlar */}
        <div className="space-y-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <h3 className="text-sm font-bold mb-6 text-gray-400 uppercase tracking-widest relative z-10">Kayıtlı Katılımcı</h3>
               <div className="text-6xl font-black mb-2 relative z-10">{project.stats?.participants_count || 0}</div>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest relative z-10">{project.stats?.top_info}</p>
               <Users size={140} className="absolute -bottom-8 -right-8 text-white/5" />
            </div>

           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-8">YÖNETİM ARAÇLARI</h3>
              <div className="space-y-3">
                 <button 
                   onClick={async () => {
                     if(confirm('Kayıtlı tüm katılımcılar için toplu yoklama alınacak. Emin misiniz?')) {
                       try {
                         await api.post(`/projects/${id}/bulk-attendance`);
                         toast.success('Toplu yoklama başarıyla alındı.');
                         fetchData();
                       } catch (err) {
                         toast.error('Hata oluştu.');
                       }
                     }
                   }}
                   className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-600 font-bold text-xs rounded-2xl hover:bg-orange-500 hover:text-white transition-all hover:shadow-lg hover:shadow-orange-500/20 group"
                 >
                    <UserCheck size={18} className="text-gray-400 group-hover:text-white" />
                    <span>Toplu Yoklama Al</span>
                 </button>
                 <button 
                   onClick={() => setIsProjectModalOpen(true)}
                   className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-600 font-bold text-xs rounded-2xl hover:bg-gray-900 hover:text-white transition-all group"
                 >
                    <Settings size={18} className="text-gray-400 group-hover:text-white" />
                    <span>Proje Detaylarını Düzenle</span>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Activity Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">{isNewActivity ? 'Yeni Faaliyet' : 'Faaliyet Ayarları'}</h2>
              <form onSubmit={handleSaveActivity} className="space-y-6">
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Faaliyet Adı</label>
                   <input 
                     type="text" 
                     value={editingActivity.name}
                     onChange={(e) => setEditingActivity({...editingActivity, name: e.target.value})}
                     className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                   />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Başlangıç Zamanı</label>
                    <input 
                      type="datetime-local"
                      value={editingActivity.start_time ? (editingActivity.start_time.includes('T') ? editingActivity.start_time.slice(0, 16) : new Date(editingActivity.start_time).toISOString().slice(0, 16)) : ''}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        const newEnd = new Date(new Date(newStart).getTime() + 7200000).toISOString().slice(0, 16);
                        setEditingActivity({...editingActivity, start_time: newStart, end_time: newEnd});
                      }}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Bitiş Zamanı</label>
                    <input 
                      type="datetime-local"
                      value={editingActivity.end_time ? (editingActivity.end_time.includes('T') ? editingActivity.end_time.slice(0, 16) : new Date(editingActivity.end_time).toISOString().slice(0, 16)) : ''}
                      onChange={(e) => setEditingActivity({...editingActivity, end_time: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Faaliyet Türü</label>
                   <select 
                     value={editingActivity.type || 'event'}
                     onChange={(e) => setEditingActivity({...editingActivity, type: e.target.value})}
                     className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 appearance-none"
                   >
                     <option value="event">Etkinlik (Açık Katılım)</option>
                     <option value="training">Eğitim (Sertifikalı)</option>
                     <option value="program">Program (Müfredat Dahili)</option>
                   </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Lat (Enlem)</label>
                    <input 
                      type="number" step="any"
                      value={editingActivity.latitude}
                      onChange={(e) => setEditingActivity({...editingActivity, latitude: parseFloat(e.target.value)})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Long (Boylam)</label>
                    <input 
                      type="number" step="any"
                      value={editingActivity.longitude}
                      onChange={(e) => setEditingActivity({...editingActivity, longitude: parseFloat(e.target.value)})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Yarıçap (Metre)</label>
                    <input 
                      type="number"
                      value={editingActivity.radius}
                      onChange={(e) => setEditingActivity({...editingActivity, radius: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Kredi Kaybı</label>
                    <input 
                      type="number"
                      value={editingActivity.credit_loss_amount}
                      onChange={(e) => setEditingActivity({...editingActivity, credit_loss_amount: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 text-xs font-bold rounded-2xl">İPTAL</button>
                   <button type="submit" className="flex-1 py-4 bg-orange-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-orange-500/20">KAYDET</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Edit Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Proje Bilgilerini Düzenle</h2>
              <form onSubmit={handleUpdateProject} className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={project.is_active} onChange={(e) => setProject({...project, is_active: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        <span className="ml-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proje Aktif</span>
                    </label>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Proje Adı</label>
                   <input 
                     type="text" 
                     value={project.name}
                     onChange={(e) => setProject({...project, name: e.target.value})}
                     className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Açıklama</label>
                   <textarea 
                     rows={4}
                     value={project.description || ''}
                     onChange={(e) => setProject({...project, description: e.target.value})}
                     className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 resize-none"
                   />
                </div>
                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 text-xs font-bold rounded-2xl">İPTAL</button>
                   <button type="submit" className="flex-1 py-4 bg-orange-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-orange-500/20">GÜNCELLE</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendee List Modal */}
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
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Katılımcı Listesi
              </h2>
              <p className="text-sm text-gray-500 mb-6">{detailedActivity.name}</p>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {detailedActivity.attendances?.length === 0 ? (
                  <p className="text-center py-8 text-gray-400 italic">Henüz yoklama kaydı bulunmuyor.</p>
                ) : (
                  detailedActivity.attendances?.map((att: any) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                           <User size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {att.user?.name || "İsimsiz"}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
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
                className="w-full mt-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all uppercase text-[11px] tracking-widest shadow-lg"
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
