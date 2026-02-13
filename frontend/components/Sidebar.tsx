'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2,
    ShoppingCart,
    Package,
    WalletCards,
    Settings,
    LogOut,
    LayoutDashboard,
    Sparkles,
    Database
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Executive Summary', icon: LayoutDashboard, href: '/dashboard' },
];

const intelligenceItems = [
    { name: 'Hugamara AI', icon: Sparkles, href: '/dashboard/ai-hub' },
    { name: 'Data Ingestion', icon: Database, href: '/dashboard/ingestion' },
];

const moduleItems = [
    { name: 'Procurement', icon: ShoppingCart, href: '/dashboard/procurement' },
    { name: 'Inventory', icon: Package, href: '/dashboard/inventory' },
    { name: 'Finance', icon: WalletCards, href: '/dashboard/finance' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const NavLink = ({ item }: { item: any }) => (
        <Link
            href={item.href}
            onClick={() => onClose()}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
                pathname === item.href
                    ? "bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20 shadow-[0_0_20px_rgba(217,119,6,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            )}
        >
            <item.icon className={cn(
                "w-5 h-5 transition-colors",
                pathname === item.href ? "text-[#d97706]" : "text-white/30 group-hover:text-white"
            )} />
            <span className="text-sm font-semibold tracking-wide">{item.name}</span>
            {pathname === item.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d97706] shadow-[0_0_10px_rgba(217,119,6,1)]" />
            )}
        </Link>
    );

    return (
        <aside className={cn(
            "w-64 h-screen bg-[#020617]/80 backdrop-blur-3xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-500 lg:translate-x-0 overflow-hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Sidebar Ambient Glow */}
            <div className="absolute -left-32 top-1/4 w-64 h-64 bg-[#d97706]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="p-6 relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10 group cursor-pointer">
                    <div className="w-10 h-10 bg-[#d97706] rounded-xl flex items-center justify-center shadow-lg shadow-[#d97706]/20 ring-1 ring-white/10 group-hover:rotate-6 transition-all duration-500">
                        <Image src="/ceo-logo.jpeg" alt="Hugamara" width={22} height={22} className="rounded-md" />
                    </div>
                    <div>
                        <h1 className="text-lg font-serif font-black text-white leading-none tracking-tight uppercase italic">Hugamara</h1>
                        <p className="text-[9px] text-[#d97706] uppercase tracking-[0.3em] font-black mt-1.5 opacity-60">Group Portal</p>
                    </div>
                </div>

                <nav className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
                    <div>
                        <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] mb-4 px-3">Navigation</p>
                        <div className="space-y-1">
                            {navItems.map((item) => <NavLink key={item.href} item={item} />)}
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] text-[#d97706] uppercase font-black tracking-[0.3em] mb-4 px-3 opacity-60">Strategic Intelligence</p>
                        <div className="space-y-1">
                            {intelligenceItems.map((item) => <NavLink key={item.href} item={item} />)}
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] mb-4 px-3">Business Modules</p>
                        <div className="space-y-1">
                            {moduleItems.map((item) => <NavLink key={item.href} item={item} />)}
                        </div>
                    </div>
                </nav>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
                    <Link
                        href="/dashboard/settings"
                        onClick={() => onClose()}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <Settings className="w-5 h-5 text-white/20 group-hover:text-white" />
                        <span className="text-sm font-semibold">Settings</span>
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-sm font-semibold">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
