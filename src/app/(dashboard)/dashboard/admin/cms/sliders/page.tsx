"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Layers, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

export default function SliderManagementPage() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ title: '', subtitle: '', link_url: '', order_priority: 0, is_active: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchSliders = async () => {
    try {
      const res = await api.get('/admin/sliders');
      setSliders(res.data.data || res.data);
    } catch (err) {
      toast.error("Slider verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    if (selectedFile) data.append('image', selectedFile);
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('link_url', formData.link_url);
    data.append('order_priority', formData.order_priority.toString());
    data.append('is_active', formData.is_active ? '1' : '0');

    try {
      if (editingSlider) {
        data.append('_method', 'PUT');
        await api.post(`/admin/sliders/${editingSlider.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Slider güncellendi.");
      } else {
        if (!selectedFile) return toast.error("Lütfen bir görsel seçin.");
        await api.post('/admin/sliders', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Yeni slider eklendi.");
      }
      setShowModal(false);
      resetForm();
      fetchSliders();
    } catch (err) {
      toast.error("İşlem başarısız.");
    }
  };

  const resetForm = () => {
    setEditingSlider(null);
    setFormData({ title: '', subtitle: '', link_url: '', order_priority: 0, is_active: true });
    setSelectedFile(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu slider'ı silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/sliders/${id}`);
      toast.success("Slider silindi.");
      fetchSliders();
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-12">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                 <Layers size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Anasayfa Slider</h1>
           </div>
           <p className="text-slate-500 font-medium">Anasayfadaki ana alanı yöneten görsel ve duyuru panelleri.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-8 py-5 bg-slate-900 text-white rounded-[2rem] hover:bg-black transition-all shadow-xl font-black text-xs uppercase tracking-widest"
        >
          <Plus size={20} /> YENİ SLIDER EKLE
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
           <div className="py-20 text-center animate-pulse text-slate-300 font-bold italic">Yükleniyor...</div>
        ) : sliders.length > 0 ? sliders.map((slider) => (
          <motion.div 
            key={slider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all h-64 md:h-48 flex flex-col md:flex-row relative"
          >
             <div className="w-full md:w-80 h-full relative shrink-0 bg-slate-50">
               {slider.image_path && (
                  <Image src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${slider.image_path}`} alt={slider.title} fill className="object-cover" />
               )}
               <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">SIRA: {slider.order_priority}</div>
                  {!slider.is_active && <div className="px-4 py-1.5 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">PASİF</div>}
               </div>
             </div>
             <div className="flex-1 p-8 flex flex-col justify-center">
                <h3 className="text-xl font-black text-slate-950 mb-2 truncate">{slider.title}</h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-2 max-w-2xl">{slider.subtitle || 'Alt başlık belirtilmemiş'}</p>
                {slider.link_url && (
                   <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <ExternalLink size={12} /> {slider.link_url}
                   </div>
                )}
             </div>
             <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingSlider(slider); setFormData({ title: slider.title, subtitle: slider.subtitle, link_url: slider.link_url, order_priority: slider.order_priority, is_active: slider.is_active }); setShowModal(true); }}
                  className="w-12 h-12 bg-white text-slate-900 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-xl"
                >
                   <Edit2 size={20} />
                </button>
                <button onClick={() => handleDelete(slider.id)} className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-xl">
                   <Trash2 size={20} />
                </button>
             </div>
          </motion.div>
        )) : (
          <div className="p-32 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 text-slate-300 italic font-black uppercase tracking-widest text-sm">
             Henüz eklenmiş bir görsel bulunmuyor.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl flex flex-col md:flex-row gap-16"
            >
               <div className="w-full md:w-80 shrink-0">
                  <label className="relative w-full aspect-[4/5] bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden mb-6">
                    {selectedFile || editingSlider?.image_path ? (
                       <Image src={selectedFile ? URL.createObjectURL(selectedFile) : `${process.env.NEXT_PUBLIC_STORAGE_URL}/${editingSlider.image_path}`} alt="Slider Preview" fill className="object-cover" />
                    ) : (
                       <>
                          <ImageIcon size={48} className="text-slate-300 mb-4" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Görsel Seç</span>
                          <span className="text-[8px] text-slate-300 mt-2">1920x800 önerilir</span>
                       </>
                    )}
                    <input type="file" className="hidden" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} accept="image/*" />
                  </label>
                  <p className="text-[10px] text-center text-slate-300 font-bold uppercase tracking-widest px-4 italic leading-relaxed">Slider görseli arka plan olarak kullanılacaktır.</p>
               </div>

               <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                  <h2 className="text-3xl font-black text-slate-950 mb-8 uppercase tracking-tighter">
                     {editingSlider ? 'Slider Düzenle' : 'Yeni Kayıt'}
                  </h2>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Başlık</label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black outline-none focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-200" placeholder="Örn: 2026 Kış Başvuruları Başladı" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Alt Başlık / Slogan</label>
                    <textarea rows={3} value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="Kodu Tara, Yerini Ayırt..."></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Geri Dönüş Sayfa Linki</label>
                    <input type="url" value={formData.link_url} onChange={(e) => setFormData({...formData, link_url: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Vurgu Sırası</label>
                      <input type="number" value={formData.order_priority} onChange={(e) => setFormData({...formData, order_priority: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black outline-none focus:ring-2 focus:ring-slate-900/10" />
                    </div>
                    <div className="flex items-end pb-4">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="w-6 h-6 border-slate-200 accent-slate-900 rounded-lg group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-black text-slate-900 uppercase tracking-widest">AKTİF</span>
                       </label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-8">
                    <button type="submit" className="flex-1 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                       <Save size={18} /> {editingSlider ? 'GÜNCELLE' : 'SİSTEME EKLE'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
                       KAPAT
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
