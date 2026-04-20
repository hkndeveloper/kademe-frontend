"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Send, 
  User, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  Archive,
  Search,
  Filter,
  Loader2,
  ChevronRight
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminSupportInbox() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [thread, setThread] = useState<any[]>([]);
  const [replyBody, setReplyBody] = useState('');
  const [search, setSearch] = useState('');

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
      const conv = conversations.find(c => c.id === id);
      setSelectedConv(conv);
    } catch (err) {
      toast.error("İleti geçmişi alınamadı.");
    }
  };

  const handleReply = async () => {
    if (!replyBody) return;
    try {
      await api.post(`/support/${selectedConv.id}/reply`, { body: replyBody });
      setReplyBody('');
      fetchThread(selectedConv.id);
      toast.success("Cevap gönderildi.");
    } catch (err) {
      toast.error("Cevap iletilemedi.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Destek Merkezi</h1>
          <p className="text-slate-500 font-medium text-sm">Katılımcılardan gelen tüm soru ve talepleri buradan yönetin.</p>
        </div>
        <div className="relative w-full md:w-96">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
           <input 
            type="text" 
            placeholder="Konu veya kullanıcı ismi ara..." 
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-slate-900/10 shadow-sm"
           />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex overflow-hidden">
        {/* Inbox List */}
        <div className="w-1/3 border-r border-slate-50 flex flex-col pt-4">
           <div className="px-6 pb-4 border-b border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gelen Kutusu</span>
              <Filter size={14} className="text-slate-300 pointer-events-none" />
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                 <div className="p-10 text-center text-slate-200 animate-pulse italic font-bold">Yükleniyor...</div>
              ) : conversations.map(conv => (
                 <button 
                  key={conv.id}
                  onClick={() => fetchThread(conv.id)}
                  className={`w-full p-8 text-left border-b border-slate-50 transition-all hover:bg-slate-50 group ${selectedConv?.id === conv.id ? 'bg-slate-50' : ''}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{conv.sender?.name}</span>
                       <span className="text-[9px] font-bold text-slate-300">{new Date(conv.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className={`text-sm font-bold mb-1 line-clamp-1 ${selectedConv?.id === conv.id ? 'text-slate-950' : 'text-slate-700'}`}>{conv.subject}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{conv.body}</p>
                 </button>
              ))}
              {!loading && conversations.length === 0 && (
                 <div className="p-20 text-center text-slate-300 text-sm font-medium italic">Gelen kutusu boş.</div>
              )}
           </div>
        </div>

        {/* Conversation View */}
        <div className="flex-1 flex flex-col bg-slate-50/10 relative">
          <AnimatePresence mode="wait">
            {selectedConv ? (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
                 <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
                          {selectedConv.sender?.name.charAt(0)}
                       </div>
                       <div>
                          <h4 className="font-extrabold text-slate-900">{selectedConv.subject}</h4>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedConv.sender?.name}</span>
                             <span className="text-slate-300 px-1">·</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedConv.sender?.email}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-slate-900 transition-all shadow-sm">
                          <Archive size={20} />
                       </button>
                    </div>
                 </div>

                 <div className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar">
                    {thread.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender_id === authUser()?.id ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] ${msg.sender_id === authUser()?.id ? 'order-2' : ''}`}>
                            <div className={`p-8 rounded-[2.5rem] shadow-sm ${msg.sender_id === authUser()?.id ? 'bg-slate-950 text-white rounded-br-none' : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-none'}`}>
                               <p className="text-sm font-medium leading-relaxed">{msg.body}</p>
                               <div className={`text-[9px] mt-4 font-black uppercase tracking-widest ${msg.sender_id === authUser()?.id ? 'text-slate-500 text-right' : 'text-slate-300'}`}>
                                  {new Date(msg.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="p-8 border-t border-slate-50 flex gap-4">
                    <div className="flex-1 relative">
                       <textarea 
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        rows={1}
                        placeholder="Cevabınızı buraya yazın..."
                        className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900/10 resize-none overflow-hidden"
                       ></textarea>
                    </div>
                    <button 
                      onClick={handleReply}
                      className="px-10 h-14 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest"
                    >
                      <Send size={18} /> GÖNDER
                    </button>
                 </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                 <div className="w-24 h-24 bg-white rounded-[3rem] border border-slate-100 flex items-center justify-center mb-8 text-slate-200">
                    <Inbox size={48} />
                 </div>
                 <h3 className="text-xl font-black text-slate-950 mb-3">Mesaj Seçilmedi</h3>
                 <p className="text-slate-400 font-medium max-w-xs text-sm">Görüntülemek ve yanıtlamak için soldaki listeden bir konuşma seçin.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function authUser() {
  if (typeof window === 'undefined') return null;
  const id = parseInt(localStorage.getItem('user_id') || '0');
  return { id };
}
