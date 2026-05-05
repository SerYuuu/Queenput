import React from 'react';

/**
 * Wrapper kartu untuk semua grafik di dashboard.
 *
 * @param {string}      title    - Judul kartu
 * @param {string}      badge    - Label kecil di atas title (mis. "Grafik", "Tren")
 * @param {string}      sub      - Subjudul / deskripsi singkat
 * @param {ReactNode}   children - Konten di dalam kartu (biasanya chart)
 * @param {object}      style    - Override style tambahan
 */
export default function ChartCard({ title, badge, sub, children, style }) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 18,
            padding: '20px 20px 12px',
            ...style,
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 4,
            }}>
                <div>
                    {badge && (
                        <div style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: '#888',
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px',
                            marginBottom: 4,
                        }}>
                            {badge}
                        </div>
                    )}
                    {title && (
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>
                            {title}
                        </div>
                    )}
                </div>
            </div>
            {sub && (
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{sub}</div>
            )}
            {children}
        </div>
    );
}