"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  HelpCircle, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  GripVertical,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function FaqManagementPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', order_priority: 0, is_active: true });

  const fetchFaqs = async () => {
    try {
      const res = await api.get('/admin/faqs');
      setFaqs(res.data.data || res.data);
    } catch (err) {
      toast.error("SSS verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.put(`/admin/faqs/${editingFaq.id}`, formData);
        toast.success("Soru güncellendi.");
      } else {
        await api.post('/admin/faqs', formData);
        toast.success("Yeni soru eklendi.");
      }
      setShowModal(false);
      setEditingFaq(null);
      setFormData({ question: '', answer: '', order_priority: 0, is_active: true });
      fetchFaqs();
    } catch (err) {
      toast.error("İşlem başarısız.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      toast.success("Soru silindi.");
      fetchFaqs();
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const openEdit = (faq: any) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer, order_priority: faq.order_priority, is_active: faq.is_active });
    setShowModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">SSS Yönetimi</h1>
          <p className="text-slate-500 font-medium">Sıkça sorulan soruları buradan ekleyebilir ve sıralayabilirsiniz.</p>
        </div>
        <button 
          onClick={() => { setEditingFaq(null); setFormData({ question: '', answer: '', order_priority: 0, is_active: true }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl font-bold text-sm"
        >
          <Plus size={20} /> YENİ SORU EKLE
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-slate-300 font-bold italic">Yükleniyor...</div>
        ) : faqs.length > 0 ? faqs.map((faq) => (
          <motion.div 
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all"
          >
             <div className="text-slate-200 group-hover:text-slate-400 transition-colors">
                <GripVertical size={24} />
             </div>
             <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle size={20} />
             </div>
             <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 mb-1 truncate">{faq.question}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{faq.answer}</p>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEdit(faq)}
                  className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(faq.id)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
             </div>
          </motion.div>
        )) : (
          <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-300 italic font-medium">
             Henüz eklenmiş bir soru bulunmuyor.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl overflow-hidden"
            >
               <h2 className="text-2xl font-black text-slate-950 mb-10 flex items-center gap-3">
                  {editingFaq ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
               </h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Soru Metni</label>
                    <input 
                      type="text" 
                      required
                      value={formData.question}
                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Cevap Metni</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.answer}
                      onChange={(e) => setFormData({...formData, answer: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900/10"
                    ></textarea>
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
                       <Save size={18} /> {editingFaq ? 'GÜNCELLE' : 'KAYDET'}
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
