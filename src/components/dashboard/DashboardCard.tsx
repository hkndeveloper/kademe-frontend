"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
    children?: React.ReactNode;
    className?: string;
    animate?: boolean;
}

export default function DashboardCard({ children, className = "", animate = true }: DashboardCardProps) {
    const Component = animate ? motion.div : 'div';
    const animationProps = animate ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    } : {};

    return (
        <Component 
            {...animationProps}
            className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden ${className}`}
        >
            {children}
        </Component>
    );
}
