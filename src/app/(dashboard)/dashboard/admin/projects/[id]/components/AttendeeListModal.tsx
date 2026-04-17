"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

interface AttendeeListModalProps {
    isOpen: boolean;
    onClose: () => void;
    detailedActivity: any;
}

export default function AttendeeListModal({ 
    isOpen, 
    onClose, 
    detailedActivity 
}: AttendeeListModalProps) {
    if (!isOpen || !detailedActivity) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 shadow-2xl"
                >
                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        Katılımcı Listesi
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">{detailedActivity.name}</p>

                    <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {detailedActivity.attendances?.length === 0 ? (
                            <p className="text-center py-8 text-gray-400 italic">Henüz yoklama kaydı bulunmuyor.</p>
                        ) : (
                            detailedActivity.attendances?.map((att: any) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">
                                                {att.user?.name || "İsimsiz"}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-mono">
                                                {new Date(att.created_at).toLocaleTimeString("tr-TR")}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded">
                                        KATILDI
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all uppercase text-[11px] tracking-widest shadow-lg"
                    >
                        Kapat
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
