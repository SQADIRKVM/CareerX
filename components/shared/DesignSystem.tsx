'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ProgressBarProps {
    progress: number; // 0-100
    showLabel?: boolean;
}

export function ProgressBar({ progress, showLabel = true }: ProgressBarProps) {
    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Progress
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
}

export function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
    return (
        <div className="mb-8 text-center">
            {icon && <div className="mb-4 flex justify-center">{icon}</div>}
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

interface CardProps {
    children: ReactNode;
    onClick?: () => void;
    hover?: boolean;
    className?: string;
}

export function Card({ children, onClick, hover = false, className = '' }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800
        ${hover ? 'cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
