'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn(
            "animate-pulse bg-white/5 rounded-2xl relative overflow-hidden",
            "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/[0.05] after:to-transparent",
            className
        )} />
    );
}

export default function LoadingExperience() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-12 w-96 rounded-2xl" />
            </div>

            {/* Metrics Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#1e293b]/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 h-[280px] space-y-6">
                        <div className="flex justify-between gap-4">
                            <div className="space-y-3 flex-1">
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-8 w-3/4" />
                            </div>
                            <Skeleton className="h-8 w-16 rounded-xl" />
                        </div>
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-20 w-full mt-auto" />
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="bg-[#1e293b]/20 border border-white/5 rounded-[2.5rem] p-10 h-[550px] space-y-8">
                        <div className="flex justify-between">
                            <div className="space-y-3">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <Skeleton className="h-[350px] w-full" />
                    </div>
                </div>
                <div className="bg-[#1e293b]/20 border border-white/5 rounded-[2.5rem] p-8 h-[550px] space-y-6">
                    <Skeleton className="h-6 w-40" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-2 w-2/3 opacity-50" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
