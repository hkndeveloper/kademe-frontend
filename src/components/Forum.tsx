"use client";

import React, { useState, useEffect } from "react";
import { Send, User } from "lucide-react";
import api from "@/lib/api";

export default function Forum() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const projectId = 1; // Demo amaçlı proje 1'in forumu kabul ediliyor

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/forum`);
      setMessages(res.data);
    } catch (err) {
      console.error("Forum mesajları yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post(`/projects/${projectId}/forum`, { message: newMessage });
      if (res.data.success) {
        setMessages([...messages, res.data.message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Mesajlar yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-gray-900">Pergel Fellowship - Forum</h3>
        <p className="text-xs text-gray-500">Sadece bu projenin katılımcıları görebilir.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-gray-400">İlk mesajı siz gönderin.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.user_id === Number(localStorage.getItem('user_id') || 0); // Varsayım
            return (
              <div key={i} className={`flex gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <User size={14} className="text-orange-500" />
                </div>
                <div>
                  <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "justify-end" : ""}`}>
                    <span className="text-xs font-semibold text-gray-700">{msg.user?.name || 'Kullanıcı'}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    isMe 
                      ? "bg-orange-500 text-white rounded-tr-none" 
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
