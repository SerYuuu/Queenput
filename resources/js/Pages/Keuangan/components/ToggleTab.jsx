import React from 'react';

/**
 * Toggle tab sederhana (mis. Mingguan / Bulanan).
 *
 * @param {{ label: string, value: string }[]} options - Pilihan tab
 * @param {string}   value    - Nilai tab yang aktif
 * @param {function} onChange - Callback saat tab berganti
 */
export default function ToggleTab({ options, value, onChange }) {
    return (
        <div style={{
            display: 'flex',
            background: '#f4f6f8',
            borderRadius: 8,
            padding: 3,
            gap: 2,
        }}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    style={{
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        background: value === opt.value ? '#fff' : 'transparent',
                        color: value === opt.value ? '#1a73e8' : '#888',
                        boxShadow: value === opt.value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s',
                    }}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}