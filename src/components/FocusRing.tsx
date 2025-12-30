import React from 'react';
import { motion } from 'framer-motion';

interface FocusRingProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    subLabel?: string;
    icon?: React.ReactNode;
}

export const FocusRing: React.FC<FocusRingProps> = ({
    progress,
    size = 280,
    strokeWidth = 24,
    color = '#6366f1', // Indigo-500
    label,
    subLabel,
    icon
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-slate-100 dark:text-slate-800"
                />

                {/* Progress Circle (Glow) */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {icon && <div className="mb-2 text-slate-400 dark:text-slate-500">{icon}</div>}
                {label && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        delay={0.5}
                        className="text-5xl font-bold text-slate-800 dark:text-white mb-1"
                    >
                        {label}
                    </motion.div>
                )}
                {subLabel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        delay={0.8}
                        className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                    >
                        {subLabel}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
