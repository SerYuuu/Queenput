import React from 'react';

/**
 * Kartu statistik ringkas (baris atas dashboard).
 *
 * @param {string}      label  - Judul kartu
 * @param {string|node} value  - Nilai utama yang ditampilkan besar
 * @param {string|node} sub    - Teks / badge di bawah nilai
 * @param {string}      icon   - Emoji atau karakter ikon
 * @param {string}      color  - Warna teks `sub`
 * @param {string}      bg     - Background bulatan ikon
 */
export default function StatCard({ label, value, sub, icon, color, bg }) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flex: 1,
            minWidth: 0,
        }}>
            <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>{value}</div>
                <div style={{ fontSize: 11, color, marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
}