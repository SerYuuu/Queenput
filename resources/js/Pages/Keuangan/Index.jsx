import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    LineChart, Line, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart,
} from 'recharts';
import { formatRp, formatDateID } from '@/Components/UI/Formatters';

// ── Komponen ─────────────────────────────────────────────────────────────────
import StatCard      from '../Keuangan/components/StatCard';
import GrowthBadge   from '../Keuangan/components/GrowthBadge';
import CompareCard   from '../Keuangan/components/CompareCard';
import ChartCard     from '../Keuangan/components/ChartCard';
import ToggleTab     from '../Keuangan/components/ToggleTab';
import CustomTooltip from '../Keuangan/components/CustomToolTip';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** 23_000_000 → "23jt" */
const toJt = (val) => {
    if (!val && val !== 0) return '0';
    const jt = val / 1_000_000;
    return jt % 1 === 0 ? `${jt}jt` : `${jt.toFixed(1)}jt`;
};

/** 265_000 → "265rb" | ≥ 1jt → toJt */
const toRb = (val) => {
    if (!val && val !== 0) return '0';
    if (Math.abs(val) >= 1_000_000) return toJt(val);
    const rb = val / 1_000;
    return rb % 1 === 0 ? `${rb}rb` : `${rb.toFixed(1)}rb`;
};

// ── Page ──────────────────────────────────────────────────────────────────────

/**
 * Props dari DashboardKeuanganController:
 *
 * stats: {
 *   todayGuests, todayRevenue, todayExpense,
 *   guestThisMonth, guestLastMonth, guestGrowth,
 *   revenueThisMonth, revenueLastMonth, revenueGrowth,
 *   expenseThisMonth, expenseLastMonth, expenseGrowth,
 *   profitThisMonth, profitLastMonth, profitGrowth,
 * }
 * weeklyGuests : [{ label, count, revenue }]
 * monthlyData  : [{ label, count, revenue }]
 */
export default function DashboardKeuangan({ auth, stats, weeklyGuests, monthlyData }) {
    const [chartMode, setChartMode] = useState('weekly');

    const activeChartData = chartMode === 'weekly' ? weeklyGuests : monthlyData;

    const yAxisRevFmt   = (v) => toJt(v);
    const yAxisGuestFmt = (v) => v;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Keuangan" />

            <div style={{ padding: '24px 28px', maxWidth: 1200, margin: '0 auto' }}>

                {/* ── Header ──────────────────────────────────────────────── */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, color: '#aaa', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Ringkasan hari ini
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>Statistik harian</div>
                    <div style={{ fontSize: 13, color: '#bbb', marginTop: 2 }}>{formatDateID(new Date())}</div>
                </div>

                {/* ── Stat Cards (baris atas) ──────────────────────────────── */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                    <StatCard
                        label="Tamu hari ini"
                        value={stats.todayGuests}
                        sub="orang"
                        icon="🏠"
                        color="#1a73e8"
                        bg="#e8f0fe"
                    />
                    <StatCard
                        label="Pemasukan hari ini"
                        value={formatRp(stats.todayRevenue)}
                        sub="Total masuk"
                        icon="💵"
                        color="#188038"
                        bg="#e6f4ea"
                    />
                    <StatCard
                        label="Pengeluaran hari ini"
                        value={formatRp(stats.todayExpense)}
                        sub="Operasional"
                        icon="💸"
                        color="#d93025"
                        bg="#fce8e6"
                    />
                    <StatCard
                        label="Revenue bulan ini"
                        value={formatRp(stats.revenueThisMonth)}
                        sub={<GrowthBadge value={stats.revenueGrowth} />}
                        icon="📈"
                        color="#9334e6"
                        bg="#f3e8fd"
                    />
                </div>

                {/* ── Grid 2 Kolom: Grafik + Tren ─────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                    {/* Kiri: Grafik Tamu & Pendapatan (Composed: Bar + Line) */}
                    <ChartCard
                        badge="Grafik"
                        title="Tamu & pendapatan"
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ marginBottom: 12 }}>
                            <ToggleTab
                                options={[
                                    { label: 'Mingguan', value: 'weekly' },
                                    { label: 'Bulanan',  value: 'monthly' },
                                ]}
                                value={chartMode}
                                onChange={setChartMode}
                            />
                        </div>

                        <ResponsiveContainer width="100%" height={220}>
                            <ComposedChart data={activeChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 10, fill: '#aaa' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    yAxisId="guest"
                                    orientation="left"
                                    tick={{ fontSize: 10, fill: '#aaa' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={yAxisGuestFmt}
                                />
                                <YAxis
                                    yAxisId="rev"
                                    orientation="right"
                                    tick={{ fontSize: 10, fill: '#aaa' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={yAxisRevFmt}
                                />
                                <Tooltip content={
                                    <CustomTooltip formatVal={(v, name) =>
                                        name === 'Pendapatan (jt)' ? toJt(v) : v
                                    } />
                                } />
                                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                                <Bar
                                    yAxisId="guest"
                                    dataKey="count"
                                    name="Tamu"
                                    fill="#93c5fd"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={28}
                                />
                                <Line
                                    yAxisId="rev"
                                    dataKey="revenue"
                                    name="Pendapatan (jt)"
                                    stroke="#1a73e8"
                                    dot={{ r: 3 }}
                                    strokeWidth={2}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Kanan: Tren Pendapatan & Tamu (dual Line) */}
                    <ChartCard badge="Tren" title="Pendapatan & tamu">
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 10, fill: '#aaa' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                                <Line dataKey="revenue" name="Pendapatan" stroke="#1a73e8" dot={{ r: 3 }} strokeWidth={2} />
                                <Line dataKey="count"   name="Tamu"       stroke="#93c5fd" dot={{ r: 3 }} strokeWidth={2} strokeDasharray="4 2" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* ── Perbandingan + Tren Bulanan ──────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                    {/* Kiri: Grid 2×2 perbandingan bulan ini vs bulan lalu */}
                    <ChartCard badge="Perbandingan" title="Bulan ini vs bulan lalu">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                            <CompareCard
                                label="Total Tamu"
                                val={stats.guestThisMonth}
                                oldVal={stats.guestLastMonth}
                                growth={stats.guestGrowth}
                            />
                            <CompareCard
                                label="Pendapatan"
                                val={toJt(stats.revenueThisMonth)}
                                oldVal={toJt(stats.revenueLastMonth)}
                                growth={stats.revenueGrowth}
                            />
                            <CompareCard
                                label="Pengeluaran"
                                val={toJt(stats.expenseThisMonth)}
                                oldVal={toJt(stats.expenseLastMonth)}
                                growth={stats.expenseGrowth}
                            />
                            <CompareCard
                                label="Laba Bersih"
                                val={toJt(stats.profitThisMonth)}
                                oldVal={toJt(stats.profitLastMonth)}
                                growth={stats.profitGrowth}
                            />
                        </div>
                    </ChartCard>

                    {/* Kanan: Tren Pendapatan Bulanan */}
                    <ChartCard badge="Tren Pendapatan Bulanan" title="">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 10, fill: '#aaa' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#aaa' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={yAxisRevFmt}
                                />
                                <Tooltip content={<CustomTooltip formatVal={toJt} />} />
                                <Line
                                    dataKey="revenue"
                                    name="Pendapatan"
                                    stroke="#1a73e8"
                                    dot={{ r: 3, fill: '#1a73e8' }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}