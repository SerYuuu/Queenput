import React from 'react';

/**
 * Tooltip kustom untuk semua chart Recharts.
 *
 * @param {boolean}  active    - Injected oleh Recharts
 * @param {array}    payload   - Injected oleh Recharts
 * @param {string}   label     - Label titik data aktif
 * @param {function} formatVal - Opsional: fungsi format nilai (mis. toJt)
 */
export default function CustomTooltip({ active, payload, label, formatVal }) {
    if (!active || !payload?.length) return null;

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: 10,
            padding: '8px 12px',
            fontSize: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: '#555' }}>{label}</div>
            {payload.map((p) => (
                <div key={p.dataKey} style={{ color: p.color, display: 'flex', gap: 6 }}>
                    <span>{p.name}:</span>
                    <span>{formatVal ? formatVal(p.value) : p.value}</span>
                </div>
            ))}
        </div>
    );
}