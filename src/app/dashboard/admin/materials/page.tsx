"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, Upload, Trash2, Search, User, Download, Plus, 
  X, AlertCircle, CheckCircle2, Loader2, BookOpen
} from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";

export default function AdminMaterials() {
  const [reports, setReports] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Upload Form State
  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    notes: "",
    file: null as File | null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, participantsRes] = await Promise.all([
        api.get("/admin/kpd-reports"),
        api.get("/participants") // Tüm kullanıcıları seçebilmek için
      ]);
      setReports(reportsRes.data);
      setParticipants(participantsRes.data.data || []);
    } catch (err) {
      console.error("Veriler alınamadı:", err);
      toast.error("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_id || !formData.file || !formData.title) return;

    setUploadLoading(true);
    const data = new FormData();
    data.append("user_id", formData.user_id);
    data.append("title", formData.title);
    data.append("notes", formData.notes);
    data.append("file", formData.file);

    try {
      await api.post("/admin/kpd-reports", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowUpload(false);
      setFormData({ user_id: "", title: "", notes: "", file: null });
      fetchData();
      toast.success("KPD Raporu başarıyla yüklendi.");
    } catch (err) {
      console.error("Yükleme hatası:", err);
      toast.error("Rapor yüklenirken bir hata oluştu.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu raporu silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/kpd-reports/${id}`);
      setReports(reports.filter(r => r.id !== id));
      toast.success("Rapor başarıyla silindi.");
    } catch (err) {
      console.error("Silme hatası:", err);
      toast.error("Silme işlemi sırasında bir hata oluştu.");
    }
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">KPD & Materyal Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Öğrencilere özel psikolojik değerlendirme raporlarını ve eğitim materyallerini buradan yönetebilirsiniz.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          <Plus size={18} />
          YENİ RAPOR YÜKLE
        </button>
      </div>

      {/* Stats/Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Toplam Rapor</div>
            <div className="text-xl font-bold text-gray-900">{reports.length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <User size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Raporlanan Öğrenci</div>
            <div className="text-xl font-bold text-gray-900">{new Set(reports.map(r => r.user_id)).size}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Eğitim Materyali</div>
            <div className="text-xl font-bold text-gray-900">0</div>
          </div>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rapor başlığı veya öğrenci adı ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rapor & Başlık</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Öğrenci</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tarih</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400 animate-pulse font-medium">
                    Raporlar yükleniyor...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400 font-medium">
                    Rapor bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{report.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">KPD RAPORU</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700">{report.user?.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{report.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {new Date(report.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => window.open(`${api.defaults.baseURL}/admin/kpd-reports/${report.id}/download`, '_blank')}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all active:scale-90"
                          title="İndir"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpload(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Rapor Yükle</h2>
                  <p className="text-xs text-gray-400 mt-1 font-medium">Yeni bir psikolojik değerlendirme raporu oluşturun.</p>
                </div>
                <button 
                  onClick={() => setShowUpload(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Öğrenci Seçin</label>
                  <select
                    required
                    value={formData.user_id}
                    onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 font-medium"
                  >
                    <option value="">Öğrenci Seçin...</option>
                    {participants.map(p => (
                      <option key={p.id} value={p.user_id}>{p.full_name || p.user?.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rapor Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 2024 Mart Değerlendirme Raporu"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Dosya (PDF, Word)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-2xl bg-gray-50 hover:bg-gray-100/50 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-300" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-bold text-orange-500 hover:text-orange-600">
                          <span>Dosya Seç</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            required
                            onChange={(e) => setFormData({...formData, file: e.target.files ? e.target.files[0] : null})}
                          />
                        </label>
                        <p className="pl-1">veya sürükle bırak</p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {formData.file ? formData.file.name : "PDF, DOC (Maks. 5MB)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Notlar (Opsiyonel)</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 font-medium"
                    placeholder="Rapor hakkında kısa bir not..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    VAZGEÇ
                  </button>
                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="flex-1 py-3 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploadLoading ? <Loader2 className="animate-spin" size={18} /> : "YÜKLEMEYİ TAMAMLA"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
