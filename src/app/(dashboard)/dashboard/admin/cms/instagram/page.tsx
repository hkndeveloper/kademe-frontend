"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Camera, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

export default function InstagramManagementPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ post_url: '', caption: '', order_priority: 0, is_active: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/admin/instagram-posts');
      setPosts(res.data.data || res.data);
    } catch (err) {
      toast.error("Gönderiler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    if (selectedFile) data.append('image', selectedFile);
    data.append('post_url', formData.post_url);
    data.append('caption', formData.caption);
    data.append('order_priority', formData.order_priority.toString());
    data.append('is_active', formData.is_active ? '1' : '0');

    try {
      if (editingPost) {
        // Laravel PUT with multipart/form-data trick
        data.append('_method', 'PUT');
        await api.post(`/admin/instagram-posts/${editingPost.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Gönderi güncellendi.");
      } else {
        if (!selectedFile) return toast.error("Lütfen bir görsel seçin.");
        await api.post('/admin/instagram-posts', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Yeni gönderi eklendi.");
      }
      setShowModal(false);
      resetForm();
      fetchPosts();
    } catch (err) {
      toast.error("İşlem başarısız.");
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({ post_url: '', caption: '', order_priority: 0, is_active: true });
    setSelectedFile(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/instagram-posts/${id}`);
      toast.success("Gönderi silindi.");
      fetchPosts();
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    setFormData({ post_url: post.post_url, caption: post.caption, order_priority: post.order_priority, is_active: post.is_active });
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Instagram Post Yönetimi</h1>
          <p className="text-slate-500 font-medium">Anasayfada sergilenecek Instagram gönderilerini manuel olarak yönetin.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl font-bold text-sm"
        >
          <Plus size={20} /> YENİ GÖNDERİ EKLE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           <div className="col-span-full py-20 text-center animate-pulse text-slate-300 font-bold italic">Yükleniyor...</div>
        ) : posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all"
          >
             <div className="aspect-square relative flex bg-slate-50">
               {post.image_path && (
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.image_path}`} 
                    alt={post.caption || 'Instagram'} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(post)} className="p-4 bg-white text-slate-900 rounded-2xl hover:bg-slate-100 transition-all font-bold">
                     <Edit2 size={20} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold">
                     <Trash2 size={20} />
                  </button>
               </div>
               {!post.is_active && (
                  <div className="absolute top-4 left-4 px-4 py-1 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-red-500 rounded-full">Pasif</div>
               )}
             </div>
             <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                   <Camera size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Sıra: {post.order_priority}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{post.caption || 'Açıklama yok'}</h3>
                {post.post_url && (
                   <a href={post.post_url} target="_blank" className="mt-3 inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
                      GÖNDERİYE GİT <ExternalLink size={12} />
                   </a>
                )}
             </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl overflow-hidden"
            >
               <h2 className="text-2xl font-black text-slate-950 mb-10 flex items-center gap-3 underline decoration-slate-100 underline-offset-8">
                  {editingPost ? 'Gönderiyi Düzenle' : 'Yeni Gönderi Ekle'}
               </h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center mb-8">
                     <label className="relative w-40 h-40 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden">
                        {selectedFile || editingPost?.image_path ? (
                           <div className="relative w-full h-full p-2">
                             <Image 
                               src={selectedFile ? URL.createObjectURL(selectedFile) : `${process.env.NEXT_PUBLIC_STORAGE_URL}/${editingPost.image_path}`}
                               alt="Preview" 
                               fill 
                               className="object-cover rounded-[2rem]"
                             />
                           </div>
                        ) : (
                           <>
                              <ImageIcon size={32} className="text-slate-300 mb-2" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Görsel Seç</span>
                           </>
                        )}
                        <input type="file" className="hidden" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} accept="image/*" />
                     </label>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Gönderi Linki (URL)</label>
                    <input 
                      type="url" 
                      placeholder="https://instagram.com/p/..."
                      value={formData.post_url}
                      onChange={(e) => setFormData({...formData, post_url: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Kısa Açıklama</label>
                    <input 
                      type="text" 
                      value={formData.caption}
                      onChange={(e) => setFormData({...formData, caption: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Sıralama Önceliği</label>
                      <input 
                        type="number" 
                        value={formData.order_priority}
                        onChange={(e) => setFormData({...formData, order_priority: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900/10"
                      />
                    </div>
                    <div className="flex items-end pb-4">
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.is_active}
                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                            className="w-5 h-5 accent-slate-900"
                          />
                          <span className="text-sm font-bold text-slate-700">Aktif</span>
                       </label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                       <Save size={18} /> {editingPost ? 'GÜNCELLE' : 'EKLE'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                       İPTAL
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
