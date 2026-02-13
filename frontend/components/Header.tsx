'use client';

import React from 'react';
import Image from 'next/image';
import { useGlobal } from '@/context/GlobalContext';
import {
    Bell,
    Download,
    User,
    Calendar,
    Search
} from 'lucide-react';

export default function Header() {
    const { handleGlobalSearch } = useGlobal();

    return (
        <header className="h-24 bg-[#020617]/40 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30 transition-all duration-500">
            {/* Ambient Header Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#d97706]/30 to-transparent" />

            <div className="flex items-center gap-8 relative z-10">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-[#d97706] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(217,119,6,0.3)] ring-1 ring-white/10 group-hover:scale-105 transition-all duration-500">
                        <Image src="/ceo-logo.jpeg" alt="Hugamara" width={28} height={28} className="rounded-lg" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif font-black text-white leading-none tracking-tight uppercase italic">
                            CEO PORTAL
                        </h1>
                        <p className="hidden md:block text-[9px] text-[#d97706] uppercase font-black tracking-[0.5em] mt-2 opacity-60">Strategic Intelligence Hub</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8 relative z-10">
                {/* Search / Command Bar (Functional) */}
                <div className="hidden xl:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 w-80 group focus-within:border-[#d97706]/40 transition-all">
                    <Search className="text-white/20 group-focus-within:text-[#d97706] transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Global Strategic Search..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleGlobalSearch(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                        className="bg-transparent border-none text-xs text-white placeholder:text-white/20 focus:outline-none w-full font-medium"
                    />
                    <kbd className="text-[10px] text-white/10 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 group-hover:text-white/40 transition-colors">ENTER</kbd>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all group">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2 state-pulse w-2 h-2 bg-[#d97706] rounded-full shadow-[0_0_8px_#d97706]" />
                    </button>
                    <button title="Export Report" className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        <Download className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-10 w-px bg-white/10 mx-2 hidden sm:block" />

                {/* User Profile */}
                <div className="flex items-center gap-4 pl-3 bg-white/5 rounded-2xl p-1.5 pr-4 border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center border border-white/10 shadow-lg shrink-0">
                        <User className="text-white w-5 h-5" />
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">CEO Command</p>
                        <p className="text-[8px] text-white/20 font-mono tracking-tighter truncate max-w-[80px]">hugamara_os</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
