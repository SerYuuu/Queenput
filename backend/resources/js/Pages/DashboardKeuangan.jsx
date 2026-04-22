import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import '../../css/dashboard.css';

// Import Components
import StatCard from '@/Components/Dashboard/StatCard';
import BarChart from '@/Components/Dashboard/BarChart';
import CompareBox from '@/Components/Dashboard/CompareBox';
import GrowthBadge from '@/Components/Dashboard/GrowthBadge';
import { formatRp, formatDateID } from '@/Components/UI/Formatters';

export default function DashboardKeuangan({ auth, stats, weeklyGuests, monthlyData }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Keuangan" />
            <div className="dash">
                <div className="dash-header">
                    <div className="dash-title">Keuangan</div>
                    <div className="dash-sub">{formatDateID(new Date())}</div>
                </div>

                <div className="cards">
                    <StatCard label="Tamu Hari Ini" value={stats.todayGuests} sub="orang" icon="🏠" color="#1a73e8" bg="#e8f0fe" />
                    <StatCard label="Pemasukan Hari Ini" value={formatRp(stats.todayRevenue)} sub="Total masuk" icon="💵" color="#188038" bg="#e6f4ea" />
                    <StatCard label="Pengeluaran Hari Ini" value={formatRp(stats.todayExpense)} sub="Biaya operasional" icon="💸" color="#d93025" bg="#fce8e6" />
                    <StatCard label="Pendapatan Bulan Ini" value={formatRp(stats.revenueThisMonth)} sub={<GrowthBadge value={stats.revenueGrowth} />} icon="📈" color="#9334e6" bg="#f3e8fd" />
                </div>

                <div className="charts">
                    <ChartWrapper title="Tamu per Minggu" sub="4 minggu terakhir">
                        <BarChart data={weeklyGuests} valueKey="count" color="#1a73e8" />
                    </ChartWrapper>
                    <ChartWrapper title="Pendapatan per Minggu" sub="4 minggu terakhir (Rp)">
                        <BarChart data={weeklyGuests} valueKey="revenue" color="#188038" />
                    </ChartWrapper>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Perbandingan Performa</div>
                    <div className="chart-sub" style={{ marginBottom: 16 }}>Bulan Ini vs Bulan Lalu</div>
                    <div className="compare-row">
                        <CompareBox label="Total Tamu" val={stats.guestThisMonth} oldVal={stats.guestLastMonth} growth={stats.guestGrowth} bg="#e8f0fe" color="#1a73e8" />
                        <CompareBox label="Total Pendapatan" val={formatRp(stats.revenueThisMonth)} oldVal={formatRp(stats.revenueLastMonth)} growth={stats.revenueGrowth} bg="#e6f4ea" color="#188038" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper lokal untuk membungkus chart
const ChartWrapper = ({ title, sub, children }) => (
    <div className="chart-card">
        <div className="chart-title">{title}</div>
        <div className="chart-sub">{sub}</div>
        {children}
    </div>
);