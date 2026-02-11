'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TimeNavigator from '@/components/TimeNavigator';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles, LayoutDashboard } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { GlobalProvider } from '@/context/GlobalContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthorized(true);
            const timer = setTimeout(() => setAppLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [router]);

    if (!isAuthorized) return null;

    return (
        <GlobalProvider>
            <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-[#d97706]/30">
                {/* Minimalist Loading */}
                {appLoading && (
                    <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-2 border-[#d97706]/20 border-t-[#d97706] rounded-full animate-spin mb-4" />
                            <span className="text-[10px] text-[#d97706] uppercase tracking-[0.4em] font-black animate-pulse">Initializing Portal</span>
                        </div>
                    </div>
                )}

                {/* Desktop Sidebar (Fixed) */}
                <div className="hidden lg:block">
                    <Sidebar isOpen={true} onClose={() => { }} />
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <div className="relative w-64 h-full animate-in slide-in-from-left duration-300">
                            <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="lg:ml-64 transition-all duration-300 min-h-screen flex flex-col">
                    <Header />

                    <main className="flex-1 p-4 md:p-8 lg:p-10 relative">
                        <div className="max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <TimeNavigator />
                            {children}
                        </div>
                    </main>

                    {/* Footer Status Bar */}
                    <footer className="h-10 border-t border-white/10 px-8 flex items-center justify-between text-[9px] uppercase tracking-widest text-white/50">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                Neural Bridge Online
                            </span>
                            <span className="opacity-50">|</span>
                            <span>v5.0.0 Executive</span>
                        </div>
                        <div>&copy; 2026 Hugamara Group Command</div>
                    </footer>
                </div>

                {/* Mobile Navigation Trigger */}
                <div className="lg:hidden fixed bottom-8 right-8 z-50">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-5 bg-[#d97706] rounded-[2rem] shadow-[0_20px_50px_rgba(217,119,6,0.3)] text-white active:scale-95 transition-all ring-4 ring-[#d97706]/20"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </GlobalProvider>
    );
}
