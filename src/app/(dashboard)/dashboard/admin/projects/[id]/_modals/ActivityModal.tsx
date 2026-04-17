"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (e: React.FormEvent) => void;
    editingActivity: any;
    setEditingActivity: (activity: any) => void;
    isNewActivity: boolean;
}

export default function ActivityModal({ 
    isOpen, 
    onClose, 
    onSave, 
    editingActivity, 
    setEditingActivity, 
    isNewActivity 
}: ActivityModalProps) {
    if (!isOpen || !editingActivity) return null;

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
                    <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
                        {isNewActivity ? 'Yeni Faaliyet' : 'Faaliyet Ayarları'}
                    </h2>
                    <form onSubmit={onSave} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Faaliyet Adı</label>
                            <input 
                                type="text" 
                                value={editingActivity.name}
                                onChange={(e) => setEditingActivity({...editingActivity, name: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Başlangıç Zamanı</label>
                                <input 
                                    type="datetime-local"
                                    value={editingActivity.start_time ? (editingActivity.start_time.includes('T') ? editingActivity.start_time.slice(0, 16) : new Date(editingActivity.start_time).toISOString().slice(0, 16)) : ''}
                                    onChange={(e) => {
                                        const newStart = e.target.value;
                                        const newEnd = new Date(new Date(newStart).getTime() + 7200000).toISOString().slice(0, 16);
                                        setEditingActivity({...editingActivity, start_time: newStart, end_time: newEnd});
                                    }}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Bitiş Zamanı</label>
                                <input 
                                    type="datetime-local"
                                    value={editingActivity.end_time ? (editingActivity.end_time.includes('T') ? editingActivity.end_time.slice(0, 16) : new Date(editingActivity.end_time).toISOString().slice(0, 16)) : ''}
                                    onChange={(e) => setEditingActivity({...editingActivity, end_time: e.target.value})}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Faaliyet Türü</label>
                            <select 
                                value={editingActivity.type || 'event'}
                                onChange={(e) => setEditingActivity({...editingActivity, type: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10 appearance-none"
                            >
                                <option value="event">Etkinlik (Açık Katılım)</option>
                                <option value="training">Eğitim (Sertifikalı)</option>
                                <option value="program">Program (Müfredat Dahili)</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Lat (Enlem)</label>
                                <input 
                                    type="number" step="any"
                                    value={editingActivity.latitude}
                                    onChange={(e) => setEditingActivity({...editingActivity, latitude: parseFloat(e.target.value)})}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Long (Boylam)</label>
                                <input 
                                    type="number" step="any"
                                    value={editingActivity.longitude}
                                    onChange={(e) => setEditingActivity({...editingActivity, longitude: parseFloat(e.target.value)})}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Yarıçap (Metre)</label>
                                <input 
                                    type="number"
                                    value={editingActivity.radius}
                                    onChange={(e) => setEditingActivity({...editingActivity, radius: parseInt(e.target.value)})}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Kredi Kaybı</label>
                                <input 
                                    type="number"
                                    value={editingActivity.credit_loss_amount}
                                    onChange={(e) => setEditingActivity({...editingActivity, credit_loss_amount: parseInt(e.target.value)})}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-500 text-xs font-bold rounded-2xl">İPTAL</button>
                            <button type="submit" className="flex-1 py-4 bg-orange-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-orange-500/20">KAYDET</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
