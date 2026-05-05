import React from 'react';
import GrowthBadge from './GrowthBadge';

/**
 * Kartu perbandingan bulan ini vs bulan lalu.
 *
 * @param {string}      label   - Judul kartu (mis. "Pendapatan")
 * @param {string}      val     - Nilai bulan ini (sudah diformat, mis. "23jt")
 * @param {string}      oldVal  - Nilai bulan lalu (sudah diformat, mis. "18jt")
 * @param {number|null} growth  - Persentase pertumbuhan. null = tidak ada data bulan lalu.
 */
export default function CompareCard({ label, val, oldVal, growth }) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 14,
            padding: '14px 16px',
        }}>
            <div style={{
                fontSize: 11,
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 6,
            }}>
                {label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                {val}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#aaa' }}>vs {oldVal} lalu</span>
                <GrowthBadge value={growth} />
            </div>
        </div>
    );
}