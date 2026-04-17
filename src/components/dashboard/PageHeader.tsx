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
        <div className="mb-12">
            {backLink && (
                <Link 
                    href={backLink} 
                    className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-orange-500 mb-8 transition-colors uppercase tracking-widest"
                >
                    <ArrowLeft size={16} className="mr-2" /> {backText}
                </Link>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="flex items-center gap-6">
                    {icon && (
                        <div className="w-20 h-20 bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-center shadow-sm">
                            {React.cloneElement(icon as any, { size: 32, className: "text-orange-500" })}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
                            {badge}
                        </div>
                        {description && (
                            <p className="text-gray-400 font-medium text-sm max-w-xl line-clamp-2 italic">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className="flex gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
