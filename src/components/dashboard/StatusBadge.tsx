"use client";

import React from 'react';

type StatusType = 'active' | 'passive' | 'accepted' | 'waitlisted' | 'blacklisted' | 'alumni' | 'failed' | 'attended' | 'event' | 'training' | 'program';

interface StatusBadgeProps {
    status: StatusType | string;
    className?: string;
}

const statusMap: Record<string, { label: string, classes: string }> = {
    active: { label: 'AKTİF', classes: 'bg-emerald-100 text-emerald-600' },
    passive: { label: 'PASİF', classes: 'bg-gray-100 text-gray-400' },
    accepted: { label: 'KABUL EDİLDİ', classes: 'bg-blue-100 text-blue-600' },
    waitlisted: { label: 'YEDEK', classes: 'bg-amber-100 text-amber-600' },
    blacklisted: { label: 'KARA LİSTE', classes: 'bg-red-100 text-red-600' },
    alumni: { label: 'MEZUN', classes: 'bg-purple-100 text-purple-600' },
    failed: { label: 'ELENDİ', classes: 'bg-red-100 text-red-600' },
    attended: { label: 'KATILDI', classes: 'bg-emerald-100 text-emerald-600' },
    // Faaliyet Türleri
    event: { label: 'ETKİNLİK', classes: 'bg-indigo-100 text-indigo-600' },
    training: { label: 'EĞİTİM', classes: 'bg-cyan-100 text-cyan-600' },
    program: { label: 'PROGRAM', classes: 'bg-rose-100 text-rose-600' },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
    const config = statusMap[status.toLowerCase()] || { label: status.toUpperCase(), classes: 'bg-slate-100 text-slate-500' };

    return (
        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider inline-flex items-center justify-center ${config.classes} ${className}`}>
            {config.label}
        </span>
    );
}
