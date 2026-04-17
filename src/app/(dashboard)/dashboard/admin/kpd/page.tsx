"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Check, 
  X, 
  FilePlus, 
  Search,
  Filter,
  CheckCircle,
  FileText,
  DoorOpen,
  MapPin,
  Globe
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminKpdPage() {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, upload-report, reports

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'appointments') {
        const res = await api.get('/admin/kpd/appointments');
        setAppointments(res.data);
      } else if (activeTab === 'reports') {
        const res = await api.get('/admin/kpd-reports');
        setReports(res.data);
      } else if (activeTab === 'upload-report') {
        const res = await api.get('/participants');
        setParticipants(res.data);
      }
    } catch (err) {
      toast.error("Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/admin/kpd/appointments/${id}`, { status });
      toast.success("Durum güncellendi.");
      fetchData();
    } catch (err) {
      toast.error("Güncellenemedi.");
    }
  };

  const handleUploadReport = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/admin/kpd-reports', formData);
      toast.success("Rapor başarıyla yüklendi.");
      setActiveTab('reports');
    } catch (err) {
      toast.error("Rapor yüklenemedi.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">KPD Yönetim Paneli</h1>
          <p className="text-slate-500 font-medium font-bold uppercase tracking-widest text-[10px]">Kariyer Psikolojik Danışmanlık ve Raporlama</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <TabButton active={activeTab === 'appointments'} label="Randevular" icon={Calendar} onClick={() => setActiveTab('appointments')} />
          <TabButton active={activeTab === 'upload-report'} label="Rapor Yükle" icon={FilePlus} onClick={() => setActiveTab('upload-report')} />
          <TabButton active={activeTab === 'reports'} label="Tüm Raporlar" icon={FileText} onClick={() => setActiveTab('reports')} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'appointments' && (
            <div className="grid grid-cols-1 gap-4">
              {appointments.length > 0 ? appointments.map((app: any) => (
                <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${app.status === 'pending' ? 'bg-amber-50 text-amber-500' : app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{app.user?.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{app.topic || 'Konu belirtilmedi'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Zaman & Oda</span>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Clock size={14} /> {new Date(app.start_time).toLocaleDateString()} {new Date(app.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        <span className="mx-2 text-slate-200">|</span>
                        <DoorOpen size={14} /> Oda {app.room_id}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tür</span>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        {app.type === 'online' ? <><Globe size={14} className="text-blue-500" /> Online</> : <><MapPin size={14} className="text-orange-500" /> Ofis</>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(app.id, 'confirmed')} className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"><Check size={20} /></button>
                        <button onClick={() => handleUpdateStatus(app.id, 'cancelled')} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"><X size={20} /></button>
                      </>
                    )}
                    {app.status === 'confirmed' && (
                      <button onClick={() => handleUpdateStatus(app.id, 'completed')} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">TAMAMLA</button>
                    )}
                    {app.status === 'completed' && (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black rounded-xl">TAMAMLANDI</span>
                    )}
                    {app.status === 'cancelled' && (
                      <span className="px-4 py-2 bg-red-50 text-red-600 text-xs font-black rounded-xl">İPTAL</span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">Henüz randevu bulunmuyor.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload-report' && (
            <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl">
              <h2 className="text-xl font-black mb-8">Yeni Rapor Oluştur</h2>
              <form onSubmit={handleUploadReport} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Öğrenci Seçin</label>
                  <select name="user_id" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-slate-900/10">
                    <option value="">Öğrenci Seçiniz...</option>
                    {participants.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Rapor Başlığı</label>
                  <input name="title" required type="text" placeholder="Örn: Kariyer Yetkinlik Analizi Raporu" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-slate-900/10" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Rapor Dosyası (PDF)</label>
                  <input name="file" required type="file" accept=".pdf,.doc,.docx" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Notlar (Opsiyonel)</label>
                  <textarea name="notes" rows={3} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none" placeholder="Rapor hakkında ek notlar..."></textarea>
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all">RAPORU SİSTEME YÜKLE</button>
              </form>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report: any) => (
                <div key={report.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FileText size={80} />
                   </div>
                   <h4 className="font-bold text-slate-900 mb-2">{report.title}</h4>
                   <div className="flex items-center gap-2 mb-6">
                      <User size={12} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">{report.user?.name}</span>
                   </div>
                   <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(report.created_at).toLocaleDateString()}</span>
                      <button 
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/kpd-reports/${report.id}/download`, '_blank')}
                        className="text-xs font-black text-slate-900 hover:underline"
                      >
                        İNDİR
                      </button>
                   </div>
                </div>
              ))}
              {reports.length === 0 && (
                 <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem]">
                    <p className="text-slate-400 font-bold">Yüklenmiş rapor bulunmuyor.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, label, icon: Icon, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <Icon size={16} />
      <span className="uppercase tracking-widest">{label}</span>
    </button>
  );
}
