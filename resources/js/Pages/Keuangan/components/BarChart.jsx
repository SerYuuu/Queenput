import React from 'react';

export default function BarChart({ data = [], valueKey, color = '#1a73e8', height = 110 }) {
    const values = data.map(d => Number(d[valueKey]) || 0);
    const max = Math.max(...values, 1);

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: height, paddingTop: 20 }}>
            {data.map((item, i) => {
                const val = Number(item[valueKey]) || 0;
                const pct = (val / max) * 100;
                return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: 4 }}>
                        <div style={{ fontSize: 9, textAlign: 'center', color: '#5f6368', fontWeight: 600 }}>
                            {val > 0 ? (val >= 1_000_000 ? (val/1_000_000).toFixed(1)+'jt' : val) : ''}
                        </div>
                        <div style={{
                            height: `${Math.max(pct, 5)}%`,
                            backgroundColor: color,
                            borderRadius: '3px 3px 0 0',
                            opacity: i === data.length - 1 ? 1 : 0.6
                        }} />
                        <div style={{ fontSize: 8, textAlign: 'center', color: '#9aa0a6', whiteSpace: 'nowrap' }}>
                            {item.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}