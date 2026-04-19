"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    description?: string;
    backLink?: string;
    backText?: string;
    actions?: React.ReactNode;
    icon?: React.ReactElement;
    badge?: React.ReactNode;
}

export default function PageHeader({ 
    title, 
    description, 
    backLink, 
    backText = "Geri Dön", 
    actions,
    icon,
    badge
}: PageHeaderProps) {
    return (
        <div className="mb-10">
            {backLink && (
                <Link 
                    href={backLink} 
                    className="inline-flex items-center text-[10px] font-bold text-slate-400 hover:text-orange-600 mb-6 transition-colors uppercase tracking-widest"
                >
                    <ArrowLeft size={14} className="mr-2" /> {backText}
                </Link>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    {icon && (
                        <div className="w-14 h-14 bg-white border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm">
                            {React.cloneElement(icon as any, { size: 24, className: "text-orange-500" })}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                            {badge}
                        </div>
                        {description && (
                            <p className="text-slate-500 font-medium text-xs max-w-xl line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className="flex gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
