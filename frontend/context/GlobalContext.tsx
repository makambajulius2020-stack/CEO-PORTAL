'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type Branch = 'all' | 'patiobella' | 'eateroo';

interface GlobalContextType {
    activeBranch: Branch;
    setActiveBranch: (branch: Branch) => void;
    handleGlobalSearch: (query: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
    const [activeBranch, setActiveBranch] = useState<Branch>('all');
    const router = useRouter();

    const handleGlobalSearch = (query: string) => {
        const q = query.toLowerCase().trim();

        if (!q) return;

        // Simple routing / filtering logic based on query
        if (q.includes('inventory')) {
            if (q.includes('patiobella')) setActiveBranch('patiobella');
            else if (q.includes('eateroo')) setActiveBranch('eateroo');
            router.push('/dashboard/inventory');
        } else if (q.includes('procurement') || q.includes('lpo') || q.includes('requisition')) {
            if (q.includes('patiobella')) setActiveBranch('patiobella');
            else if (q.includes('eateroo')) setActiveBranch('eateroo');
            router.push('/dashboard/procurement');
        } else if (q.includes('finance') || q.includes('aging') || q.includes('payment') || q.includes('cash')) {
            if (q.includes('patiobella')) setActiveBranch('patiobella');
            else if (q.includes('eateroo')) setActiveBranch('eateroo');
            router.push('/dashboard/finance');
        } else if (q.includes('ai') || q.includes('consultant')) {
            router.push('/dashboard/ai-hub');
        } else if (q.includes('ingestion') || q.includes('upload') || q.includes('excel')) {
            router.push('/dashboard/data-ingestion');
        } else if (q.includes('patiobella')) {
            setActiveBranch('patiobella');
            router.push('/dashboard');
        } else if (q.includes('eateroo')) {
            setActiveBranch('eateroo');
            router.push('/dashboard');
        } else if (q.includes('group') || q.includes('consolidated')) {
            setActiveBranch('all');
            router.push('/dashboard');
        }
    };

    return (
        <GlobalContext.Provider value={{ activeBranch, setActiveBranch, handleGlobalSearch }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
