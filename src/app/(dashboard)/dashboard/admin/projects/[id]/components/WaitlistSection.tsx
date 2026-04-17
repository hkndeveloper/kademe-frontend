"use client";

import React from 'react';
import { MoveUp, MoveDown } from 'lucide-react';

interface WaitlistSectionProps {
    waitlistedApps: any[];
    onMoveWaitlist: (index: number, direction: 'up' | 'down') => void;
}

export default function WaitlistSection({ 
    waitlistedApps, 
    onMoveWaitlist 
}: WaitlistSectionProps) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Sıralı Yedek Listesi</h3>
                <div className="text-[10px] font-bold text-white bg-orange-500 px-3 py-1 rounded-lg uppercase tracking-widest">
                    {waitlistedApps.length} ADAY BEKLİYOR
                </div>
            </div>
            <div className="space-y-3">
                {waitlistedApps.map((app: any, idx: number) => (
                    <div key={app.id} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 hover:bg-white transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100 group-hover:border-orange-200">
                            {idx + 1}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-gray-900">{app.user?.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                {app.user?.participant_profile?.university || 'Üniversite Belirtilmedi'}
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => onMoveWaitlist(idx, 'up')} 
                                disabled={idx === 0} 
                                className="p-2 text-gray-300 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:hover:text-gray-300"
                            >
                                <MoveUp size={16}/>
                            </button>
                            <button 
                                onClick={() => onMoveWaitlist(idx, 'down')} 
                                disabled={idx === waitlistedApps.length - 1} 
                                className="p-2 text-gray-300 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:hover:text-gray-300"
                            >
                                <MoveDown size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
                {waitlistedApps.length === 0 && (
                    <div className="py-20 text-center text-gray-300 text-sm font-medium italic">
                        Şu an beklemede olan aday bulunmuyor.
                    </div>
                )}
            </div>
        </div>
    );
}
