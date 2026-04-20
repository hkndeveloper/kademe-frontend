"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
  project: any;
  setProject: (project: any) => void;
}

export default function ProjectEditModal({ isOpen, onClose, onUpdate, project, setProject }: ProjectEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-slate-900 mb-8">Proje Detaylarını Düzenle</h2>
        
        <form onSubmit={onUpdate} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Proje Adı</label>
            <input 
              value={project.name || ''} 
              onChange={e => setProject({...project, name: e.target.value})} 
              className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium" 
              placeholder="Örn: Kademe Programı 2024"
              required 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Proje Açıklaması</label>
            <textarea 
              value={project.description || ''} 
              onChange={e => setProject({...project, description: e.target.value})} 
              className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium min-h-[120px]" 
              placeholder="Proje hakkında detaylı bilgi..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kayıt Durumu</label>
              <select 
                value={project.is_active ? 'active' : 'passive'} 
                onChange={e => setProject({...project, is_active: e.target.value === 'active'})}
                className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10 cursor-pointer font-bold"
              >
                <option value="active">Aktif (Başvuru Alır)</option>
                <option value="passive">Pasif (Başvuruya Kapalı)</option>
              </select>
            </div>
            <div>
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Maksimum Kontenjan</label>
               <input 
                type="number"
                value={project.capacity || 0} 
                onChange={e => setProject({...project, capacity: parseInt(e.target.value)})}
                className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium" 
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="submit" 
              className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-[11px] tracking-widest shadow-xl shadow-gray-900/10"
            >
              DEĞİŞİKLİKLERİ KAYDET
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all uppercase text-[11px] tracking-widest underline"
            >
              İPTAL
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
