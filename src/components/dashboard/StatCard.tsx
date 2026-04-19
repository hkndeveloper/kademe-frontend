"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    subValue?: string;
    variant?: 'white' | 'dark' | 'orange';
    className?: string;
}

export default function StatCard({ 
    icon: Icon, 
    label, 
    value, 
    subValue, 
    variant = 'white',
    className = "" 
}: StatCardProps) {
    
    const variants = {
        white: "bg-white border-slate-200/60 text-slate-900 shadow-sm",
        dark: "bg-slate-900 border-transparent text-white shadow-xl",
        orange: "bg-orange-500 border-transparent text-white shadow-lg shadow-orange-500/10"
    };

    const iconBg = {
        white: "bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500",
        dark: "bg-white/10 text-white/80",
        orange: "bg-white/20 text-white"
    };

    const labelColor = {
        white: "text-slate-400",
        dark: "text-slate-500",
        orange: "text-orange-100"
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl border group transition-all relative overflow-hidden ${variants[variant]} ${className}`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-colors ${iconBg[variant]}`}>
                <Icon size={20} />
            </div>
            
            <div className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 ${labelColor[variant]}`}>
                {label}
            </div>
            
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">{value}</span>
                {subValue && (
                    <span className={`text-[10px] font-semibold uppercase ${labelColor[variant]}`}>
                        {subValue}
                    </span>
                )}
            </div>

            {/* Decorative background element for dark/colored cards */}
            {variant !== 'white' && (
                <Icon size={100} className="absolute -bottom-4 -right-4 opacity-5 rotate-12" />
            )}
        </motion.div>
    );
}
