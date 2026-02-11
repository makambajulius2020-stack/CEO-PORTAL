import DashboardLayout from '@/components/DashboardLayout';
import BranchDashboard from '@/components/BranchDashboard';

const eaterooStats = {
    revenue: "$8,920",
    revenueTrend: 14.5,
    revenueData: [{ value: 20 }, { value: 25 }, { value: 30 }, { value: 35 }, { value: 40 }, { value: 50 }, { value: 45 }],
    turnover: "8.2",
    turnoverTrend: 5.4,
    turnoverLabel: "Counter Turns / Hr",
    turnoverData: [{ value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 8.5 }, { value: 9 }, { value: 8.2 }],
    avgCheck: "$18.50",
    avgCheckTrend: 2.1,
    avgCheckData: [{ value: 15 }, { value: 16 }, { value: 17 }, { value: 18 }, { value: 19 }, { value: 18.5 }, { value: 18.2 }],
    deptData: [
        { name: 'Grill', performance: 95 },
        { name: 'Assembly', performance: 98 },
        { name: 'Beverage', performance: 88 },
        { name: 'Delivery', performance: 92 },
    ],
    inventoryData: [
        { name: 'Proteins', value: 5000 },
        { name: 'Breads', value: 1200 },
        { name: 'Beverages', value: 3000 },
        { name: 'Packaging', value: 2000 },
    ]
};

export default function EaterooPage() {
    return (
        <DashboardLayout>
            <BranchDashboard
                branchName="Eateroo"
                type="QSR"
                stats={eaterooStats}
            />
        </DashboardLayout>
    );
}
