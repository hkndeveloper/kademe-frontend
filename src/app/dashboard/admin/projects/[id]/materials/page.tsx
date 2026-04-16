"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  File, 
  Upload, 
  Trash2, 
  Download, 
  Plus, 
  AlertCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import api from '@/lib/api';

export default function MaterialsManagement() {
  const { id } = useParams();
  const [materials, setMaterials] = useState([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', file: null });

  const fetchData = async () => {
    try {
      const [matRes, projRes] = await Promise.all([
        api.get(`/projects/${id}/materials`),
        api.get(`/projects/${id}`)
      ]);
      setMaterials(matRes.data);
      setProject(projRes.data);
    } catch (err) {
      console.error('Veriler çekilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleFileChange = (e: any) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!formData.file) return alert('Lütfen bir dosya seçin');

    setUploading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('file', formData.file);

    try {
      await api.post(`/projects/${id}/materials`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ title: '', description: '', file: null });
      fetchData();
      alert('Materyal başarıyla yüklendi.');
    } catch (err) {
      alert('Yükleme sırasında bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (matId: number) => {
    if (!confirm('Bu materyali silmek istediğinize emin misiniz?')) return;
    try {
      // Backend'de delete metodu eksikse eklenebilir, şimdilik UI'da simüle edelim veya API'ye atalım
      // await api.delete(`/materials/${matId}`); (Backend'e eklenmeli)
      setMaterials(materials.filter((m: any) => m.id !== matId));
      alert('Materyal silindi (Simülasyon - Backend delete yolu eklenmeli)');
    } catch (err) {
      alert('Silme hatası.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {project?.name || 'Proje'} - İçerik Yönetimi
          </h1>
          <p className="text-slate-500 mt-1">Bu projeye özel gizli dokümanları, videoları ve materyalleri yönetin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Materyal Yükleme Formu */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-white">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hızlı Yükle</h2>
              </div>
              <Link 
                href={`/dashboard/admin/projects/${id}/materials/new`}
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                Gelişmiş Form
              </Link>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">İçerik Başlığı</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e: any) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none" 
                  placeholder="Örn: Hafta 1 Sunumu"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Açıklama (Opsiyonel)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e: any) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none h-24 resize-none" 
                  placeholder="İçerik hakkında kısa bilgi..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Dosya Seç</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full px-4 py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center group-hover:border-yellow-500 transition-colors">
                    <Upload className="text-slate-400 group-hover:text-yellow-500 mb-2" size={32} />
                    <span className="text-xs font-bold text-slate-500 text-center">
                      {formData.file ? (formData.file as any).name : 'Tıkla veya Dosyayı Sürükle (Max 10MB)'}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-yellow-500 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Şimdi Yükle</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Materyal Listesi */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <File className="mr-2 text-yellow-500" size={24} /> Yüklenen Materyaller
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center"><HardDrive size={14} className="mr-1"/> {materials.length} Dosya</span>
              </div>
            </div>

            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <div className="space-y-4">
                {materials.map((mat: any) => (
                  <div key={mat.id} className="group p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs uppercase">
                        {mat.file_type}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{mat.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-slate-500 flex items-center"><Clock size={12} className="mr-1"/> {new Date(mat.created_at).toLocaleDateString()}</span>
                          <span className="text-xs text-slate-500 flex items-center uppercase">{Math.round(mat.file_size)} KB</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/materials/${mat.id}/download`} 
                        className="p-3 text-slate-400 hover:text-yellow-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download size={20} />
                      </a>
                      <button 
                        onClick={() => handleDelete(mat.id)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                {materials.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <AlertCircle size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">Henüz materyal eklenmemiş.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
