"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Users, 
  History, 
  Search,
  CheckCircle2,
  AlertCircle,
  Bell
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminAnnouncements() {
  const [activeTab, setActiveTab] = useState('new'); // new or history
  const [type, setType] = useState('email');
  const [participants, setParticipants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchParticipants();
    fetchLogs();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await api.get('/participants');
      setParticipants(res.data.data || []);
    } catch (err) {
      console.error('Katılımcılar çekilemedi', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/announcements/logs');
      setLogs(res.data.data || []);
    } catch (err) {
      console.error('Loglar çekilemedi', err);
    }
  };

  const handleSend = async () => {
    if (selectedUsers.length === 0) return alert('Lütfen en az bir alıcı seçin.');
    if (!content) return alert('Lütfen mesaj içeriğini yazın.');

    setLoading(true);
    try {
      await api.post('/admin/announcements/bulk-send', {
        type,
        user_ids: selectedUsers,
        subject,
        content
      });
      alert('Duyuru başarıyla gönderildi!');
      setContent('');
      setSubject('');
      setSelectedUsers([]);
      fetchLogs();
    } catch (err) {
      alert('Gönderim sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
           <div className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-2">İletişim Paneli</div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Duyuru Yönetimi</h1>
           <p className="text-gray-400 font-medium mt-1 text-sm">Katılımcılara Email veya SMS ile anlık bildirim gönderin.</p>
        </div>
        <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === 'new' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400'}`}
          >
            YENİ DUYURU
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400'}`}
          >
            GEÇMİŞ LOGLAR
          </button>
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Alanı */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
               {/* Tip Seçimi */}
              <div className="flex gap-4 mb-10">
                <button 
                  onClick={() => setType('email')}
                  className={`flex-1 p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'email' ? 'border-orange-500 bg-orange-50/10 text-orange-600' : 'border-gray-50 bg-gray-50 text-gray-300'}`}
                >
                  <Mail size={32} />
                  <span className="font-bold text-[10px] uppercase tracking-[0.2em]">E-POSTA</span>
                </button>
                <button 
                  onClick={() => setType('sms')}
                  className={`flex-1 p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'sms' ? 'border-orange-500 bg-orange-50/10 text-orange-600' : 'border-gray-50 bg-gray-50 text-gray-300'}`}
                >
                  <MessageSquare size={32} />
                  <span className="font-bold text-[10px] uppercase tracking-[0.2em]">SMS MESAJ</span>
                </button>
              </div>

              <div className="space-y-6">
                {type === 'email' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bülten Konusu</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Konu başlığı..." 
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                )}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mesaj İçeriği</label>
                   <textarea 
                      rows={8}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Buraya yazın..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                   />
                </div>
                <button 
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-gray-900/10 disabled:opacity-50 uppercase text-[11px] tracking-[0.2em]"
                 >
                  {loading ? (
                    <span className="animate-pulse">GÖNDERİLİYOR...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>DUYURUYU ŞİMDİ YAYINLA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Alıcı Listesi */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm max-h-[700px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ALICI LİSTESİ</h3>
                <span className="text-[9px] font-black bg-orange-500 text-white px-2.5 py-1 rounded-lg">
                  {selectedUsers.length} SEÇİLİ
                </span>
              </div>
              
              <div className="relative mb-6">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                 <input 
                    type="text" 
                    placeholder="Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                 />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                {participants.filter((p: any) => 
                  p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  p.university?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((p: any) => (
                  <div 
                    key={p.id} 
                    onClick={() => toggleUser(p.user_id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${selectedUsers.includes(p.user_id) ? 'bg-orange-50/50 border-orange-100' : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${selectedUsers.includes(p.user_id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {p.user?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-gray-900 truncate">{p.user?.name}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase truncate">{p.university}</div>
                    </div>
                    {selectedUsers.includes(p.user_id) && <CheckCircle2 size={16} className="text-orange-500" />}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setSelectedUsers(participants.map((p: any) => p.user_id))}
                className="mt-6 text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:underline"
              >
                TÜMÜNÜ SEÇ
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <th className="px-8 py-6">ALICI BİLGİSİ</th>
                      <th className="px-8 py-6 text-center">İLETİŞİM TİPİ</th>
                      <th className="px-8 py-6">GÖNDERİM TARİHİ</th>
                      <th className="px-8 py-6">DURUM</th>
                      <th className="px-8 py-6">SAĞLAYICI</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <div className="text-xs font-bold text-gray-900">{log.user?.name || log.recipient}</div>
                            <div className="text-[10px] text-gray-400 font-medium">{log.recipient}</div>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-lg ${log.type === 'sms' ? 'bg-orange-50 text-orange-500' : 'bg-orange-500 text-white'}`}>
                              {log.type}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-[10px] text-gray-400 font-bold">
                            {new Date(log.created_at).toLocaleString('tr-TR')}
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                               <CheckCircle2 size={14} className="mr-1.5" /> BAŞARILI
                            </div>
                         </td>
                         <td className="px-8 py-6 text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                            {log.provider}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
}
