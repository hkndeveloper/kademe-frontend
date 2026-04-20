"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowLeft,
  Loader2,
  User,
  ShieldCheck
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function StudentSupportPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [thread, setThread] = useState<any[]>([]);
  const [replyBody, setReplyBody] = useState('');
  const [newTicket, setNewTicket] = useState({ subject: '', body: '' });

  const fetchConversations = async () => {
    try {
      const res = await api.get('/support');
      setConversations(res.data.data);
    } catch (err) {
      toast.error("Konuşmalar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchThread = async (id: number) => {
    try {
      const res = await api.get(`/support/${id}`);
      setThread(res.data);
      setSelectedConv(conversations.find(c => c.id === id));
    } catch (err) {
      toast.error("Mesajlar yüklenemedi.");
    }
  };

  const handleCreate = async () => {
    if (!newTicket.subject || !newTicket.body) return toast.error("Lütfen tüm alanları doldurun.");
    try {
      await api.post('/support', newTicket);
      toast.success("Destek talebiniz oluşturuldu.");
      setShowNewModal(false);
      setNewTicket({ subject: '', body: '' });
      fetchConversations();
    } catch (err) {
      toast.error("Talep oluşturulamadı.");
    }
  };

  const handleReply = async () => {
    if (!replyBody) return;
    try {
      await api.post(`/support/${selectedConv.id}/reply`, { body: replyBody });
      setReplyBody('');
      fetchThread(selectedConv.id);
    } catch (err) {
      toast.error("Mesaj gönderilemedi.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Destek Merkezi</h1>
          <p className="text-slate-500 font-medium text-sm">Sorularınız, talepleriniz ve geri bildirimleriniz için doğrudan bizimle iletişime geçin.</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/10 font-black text-xs uppercase tracking-widest"
        >
          <Plus size={20} />
          YENİ TALEP OLUŞTUR
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Conversations List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 px-4 mb-4">
             <MessageSquare size={16} className="text-slate-400" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geçmiş Konuşmalar</span>
          </div>
          {loading ? (
             <div className="p-10 text-center text-slate-300 italic font-bold animate-pulse">Yükleniyor...</div>
          ) : conversations.length > 0 ? conversations.map((conv) => (
            <button 
              key={conv.id}
              onClick={() => fetchThread(conv.id)}
              className={`w-full p-6 rounded-[2rem] border transition-all text-left group ${selectedConv?.id === conv.id ? 'bg-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-300'}`}
            >
               <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(conv.created_at).toLocaleDateString()}</span>
                  {conv.read_at && <CheckCircle2 size={12} className="text-emerald-500" />}
               </div>
               <h3 className={`font-bold text-slate-900 mb-1 line-clamp-1 ${selectedConv?.id === conv.id ? 'text-slate-950' : 'text-slate-700'}`}>{conv.subject}</h3>
               <p className="text-[11px] text-slate-400 line-clamp-2 font-medium">{conv.body}</p>
            </button>
          )) : (
            <div className="p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 italic text-slate-300 text-sm">
                Henüz bir destek talebi oluşturmadınız.
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 h-[600px] bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
          {selectedConv ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
               {/* Chat Header */}
               <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                        <MessageSquare size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">{selectedConv.subject}</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">İletişim Kanalı Aktif</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedConv(null)} className="p-2 text-slate-400 hover:text-slate-900">
                     <ArrowLeft size={20} />
                  </button>
               </div>

               {/* Messages Body */}
               <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar">
                  {thread.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender_id === authUser()?.id ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-sm ${msg.sender_id === authUser()?.id ? 'bg-slate-900 text-white rounded-br-none' : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-none'}`}>
                          <p className="text-sm font-medium leading-relaxed">{msg.body}</p>
                          <div className={`text-[9px] mt-3 font-bold uppercase tracking-widest ${msg.sender_id === authUser()?.id ? 'text-slate-500' : 'text-slate-400'}`}>
                             {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Reply Footer */}
               <div className="p-6 bg-white border-t border-slate-50 flex gap-4">
                  <input 
                    type="text" 
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                  <button 
                    onClick={handleReply}
                    className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-slate-900/20"
                  >
                    <Send size={20} />
                  </button>
               </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
               <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 text-slate-200">
                  <ShieldCheck size={48} />
               </div>
               <h3 className="text-xl font-black text-slate-950 mb-3 underline decoration-slate-200 underline-offset-8">Yardım mı Gerekli?</h3>
               <p className="text-slate-400 font-medium max-w-sm mb-10 text-sm">Soldaki listeden bir konuşma seçin veya sistem yöneticilerimize doğrudan mesaj göndermek için "Yeni Talep" butonuna tıklayın.</p>
               <div className="flex gap-4">
                  <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">7/24 Yanıt</div>
                  <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Hızlı Çözüm</div>
               </div>
            </div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer" />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden"
             >
                <h2 className="text-2xl font-black text-slate-950 mb-8 flex items-center gap-3">
                   <Plus className="text-orange-500" /> Yeni Destek Talebi
                </h2>
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Konu Başlığı</label>
                      <input 
                        type="text" 
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                        placeholder="Örn: Kredi puanı itirazı, Sertifika sorunu vb."
                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900/10"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Detaylı Açıklama</label>
                      <textarea 
                        rows={5}
                        value={newTicket.body}
                        onChange={(e) => setNewTicket({...newTicket, body: e.target.value})}
                        placeholder="Sorununuzu veya talebinizi detaylıca açıklayın..."
                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900/10"
                      ></textarea>
                   </div>
                   <button 
                    onClick={handleCreate}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                   >
                     <Send size={18} /> TALEBİ GÖNDER
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility to get current user from localStorage
function authUser() {
  if (typeof window === 'undefined') return null;
  const name = localStorage.getItem('user_name');
  const id = parseInt(localStorage.getItem('user_id') || '0');
  return { id, name };
}
