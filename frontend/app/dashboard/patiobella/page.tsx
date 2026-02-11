import DashboardLayout from '@/components/DashboardLayout';
import BranchDashboard from '@/components/BranchDashboard';

const patiobellaStats = {
    revenue: "$12,450",
    revenueTrend: 8.2,
    revenueData: [{ value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }],
    turnover: "2.4",
    turnoverTrend: 2.1,
    turnoverLabel: "Table Turns / Service",
    turnoverData: [{ value: 20 }, { value: 22 }, { value: 21 }, { value: 24 }, { value: 23 }, { value: 25 }, { value: 24 }],
    avgCheck: "$158.40",
    avgCheckTrend: 5.4,
    avgCheckData: [{ value: 120 }, { value: 140 }, { value: 135 }, { value: 150 }, { value: 145 }, { value: 160 }, { value: 158 }],
    deptData: [
        { name: 'Kitchen', performance: 92 },
        { name: 'Bar', performance: 88 },
        { name: 'Pastry', performance: 85 },
        { name: 'Cellar', performance: 95 },
    ],
    inventoryData: [
        { name: 'Wines', value: 45000 },
        { name: 'Liquor', value: 28000 },
        { name: 'Steaks', value: 15000 },
        { name: 'Seafood', value: 12000 },
    ]
};

export default function PatiobellaPage() {
    return (
        <DashboardLayout>
            <BranchDashboard
                branchName="Patiobella"
                type="Fine Dining"
                stats={patiobellaStats}
            />
        </DashboardLayout>
    );
}
