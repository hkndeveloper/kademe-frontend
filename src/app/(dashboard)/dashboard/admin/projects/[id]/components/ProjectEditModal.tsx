"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (e: React.FormEvent) => void;
    project: any;
    setProject: (project: any) => void;
}

export default function ProjectEditModal({ 
    isOpen, 
    onClose, 
    onUpdate, 
    project, 
    setProject 
}: ProjectEditModalProps) {
    if (!isOpen || !project) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Proje Bilgilerini Düzenle</h2>
                    <form onSubmit={onUpdate} className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={project.is_active} 
                                    onChange={(e) => setProject({...project, is_active: e.target.checked})} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                <span className="ml-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proje Aktif</span>
                            </label>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Proje Adı</label>
                            <input 
                                type="text" 
                                value={project.name}
                                onChange={(e) => setProject({...project, name: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Açıklama</label>
                            <textarea 
                                rows={4}
                                value={project.description || ''}
                                onChange={(e) => setProject({...project, description: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 resize-none"
                            />
                        </div>
                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-500 text-xs font-bold rounded-2xl">İPTAL</button>
                            <button type="submit" className="flex-1 py-4 bg-orange-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-orange-500/20">GÜNCELLE</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
