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
        white: "bg-white border-gray-100 text-gray-900 shadow-sm",
        dark: "bg-gray-900 border-transparent text-white shadow-2xl",
        orange: "bg-orange-500 border-transparent text-white shadow-lg shadow-orange-500/20"
    };

    const iconBg = {
        white: "bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500",
        dark: "bg-white/10 text-white/80",
        orange: "bg-white/20 text-white"
    };

    const labelColor = {
        white: "text-gray-400",
        dark: "text-gray-500",
        orange: "text-orange-100"
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`p-8 rounded-[2.5rem] border group transition-all relative overflow-hidden ${variants[variant]} ${className}`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${iconBg[variant]}`}>
                <Icon size={24} />
            </div>
            
            <div className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 ${labelColor[variant]}`}>
                {label}
            </div>
            
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight">{value}</span>
                {subValue && (
                    <span className={`text-[10px] font-bold uppercase ${labelColor[variant]}`}>
                        {subValue}
                    </span>
                )}
            </div>

            {/* Decorative background element for dark/colored cards */}
            {variant !== 'white' && (
                <Icon size={120} className="absolute -bottom-6 -right-6 opacity-5 rotate-12" />
            )}
        </motion.div>
    );
}
