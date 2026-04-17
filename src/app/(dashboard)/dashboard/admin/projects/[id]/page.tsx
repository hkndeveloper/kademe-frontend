"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Users, 
  Calendar, 
  FileBox, 
  Settings, 
  Activity,
  Briefcase,
  MapPin,
  Clock,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { toast } from "sonner";

// Merkezi Bileşenler
import ActivityModal from './components/ActivityModal';
import ProjectEditModal from './components/ProjectEditModal';
import AttendeeListModal from './components/AttendeeListModal';
import WaitlistSection from './components/WaitlistSection';

// UI Core Bileşenleri
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardCard from '@/components/dashboard/DashboardCard';

export default function ProjectDashboard() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'flow' | 'waitlist'>('flow');
  
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

    const currentApp = waitlisted[currentIndex];
    const targetApp = waitlisted[targetIndex];
    waitlisted[currentIndex] = targetApp;
    waitlisted[targetIndex] = currentApp;

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
      <PageHeader
        title={project.name}
        description={project.description}
        backLink="/dashboard/admin/projects"
        backText="Projelere Dön"
        icon={<Briefcase />}
        badge={<StatusBadge status={project.is_active ? 'active' : 'passive'} />}
        actions={
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
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            {activeTab === 'flow' ? (
              <>
                <div className="flex justify-between items-center px-2">
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Faaliyet Planı</h3>
                   <div className="flex gap-3">
                      <Link href={`/dashboard/admin/projects/${id}/materials`}>
                         <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 text-[11px] font-bold rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
                            <FileBox size={14} /> MATERYALLER
                         </button>
                      </Link>
                      <button 
                        onClick={() => {
                          setIsNewActivity(true);
                          setEditingActivity({ 
                            name: '', latitude: 39.9334, longitude: 32.8597, radius: 100, credit_loss_amount: 10, project_id: id, type: 'event',
                            start_time: new Date().toISOString().slice(0, 16),
                            end_time: new Date(Date.now() + 7200000).toISOString().slice(0, 16) 
                          });
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-[11px] font-bold rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-sm"
                      >
                         <Plus size={14} /> YENİ FAALİYET
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   {project.activities?.length === 0 ? (
                      <DashboardCard className="py-20 text-center text-gray-300 text-sm font-medium italic">
                        Bu proje için henüz bir faaliyet planlanmadı.
                      </DashboardCard>
                   ) : (
                      project.activities?.map((activity: any) => (
                         <motion.div whileHover={{ y: -4 }} key={activity.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group transition-all">
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
                                <Link href={`/dashboard/admin/activities/${activity.id}/qr`} className="p-3 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm" title="Yoklama Al (QR)">
                                    <Activity size={18} />
                                </Link>
                                <button onClick={() => openAttendeeList(activity)} title="Katılanlar Listesi" className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm">
                                    <Users size={18} />
                                </button>
                                <button onClick={() => { setEditingActivity(activity); setIsNewActivity(false); setIsModalOpen(true); }} className="p-3 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all">
                                    <Settings size={18} />
                                </button>
                                <button onClick={() => handleDeleteActivity(activity.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                         </motion.div>
                      ))
                   )}
                </div>
              </>
            ) : (
              <WaitlistSection waitlistedApps={waitlistedApps} onMoveWaitlist={moveWaitlist} />
            )}
         </div>

        <div className="space-y-6">
            <StatCard 
              variant="dark"
              icon={Users}
              label="Kayıtlı Katılımcı"
              value={project.stats?.participants_count || 0}
              subValue={project.stats?.top_info}
            />

           <DashboardCard className="p-10">
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
                    <Settings size={18} className="text-gray-400 group-hover:text-white" />
                    <span>Toplu Yoklama Al</span>
                 </button>
                 <button onClick={() => setIsProjectModalOpen(true)} className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-600 font-bold text-xs rounded-2xl hover:bg-gray-900 hover:text-white transition-all group">
                    <Settings size={18} className="text-gray-400 group-hover:text-white" />
                    <span>Proje Detaylarını Düzenle</span>
                 </button>
              </div>
           </DashboardCard>
        </div>
      </div>

      {/* Modallar */}
      <ActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveActivity} 
        editingActivity={editingActivity} 
        setEditingActivity={setEditingActivity} 
        isNewActivity={isNewActivity} 
      />

      <ProjectEditModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onUpdate={handleUpdateProject} 
        project={project} 
        setProject={setProject} 
      />

      <AttendeeListModal 
        isOpen={showAttendees} 
        onClose={() => setShowAttendees(false)} 
        detailedActivity={detailedActivity} 
      />
    </div>
  );
}
