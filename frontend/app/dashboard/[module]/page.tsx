'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProcurementModule from '@/components/ProcurementModule';
import InventoryModule from '@/components/InventoryModule';
import FinanceModule from '@/components/FinanceModule';

export default function ModulePage({ params }: { params: { module: string } }) {
    const module = params.module;

    let content;
    switch (module) {
        case 'procurement':
            content = <ProcurementModule />;
            break;
        case 'inventory':
            content = <InventoryModule />;
            break;
        case 'finance':
            content = <FinanceModule />;
            break;
        default:
            content = (
                <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">Module Not Found</h1>
                    <p className="text-white/40 text-sm">The requested module "{module}" does not exist.</p>
                </div>
            );
    }

    return (
        <DashboardLayout>
            {content}
        </DashboardLayout>
    );
}
