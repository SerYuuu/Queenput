/**
 * Badge persentase pertumbuhan.
 * Menampilkan ▲ hijau (naik), ▼ merah (turun), atau — (tidak ada data / null).
 *
 * @param {number|null} value  - Nilai growth dalam persen. null = tidak ada data bulan lalu.
 */
export default function GrowthBadge({ value }) {
    if (value === null || value === undefined) {
        return (
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
                — Tidak ada data
            </span>
        );
    }

    const isUp   = value > 0;
    const isDown = value < 0;

    const color  = isUp ? '#188038' : isDown ? '#d93025' : '#64748b';
    const bgColor = isUp ? '#e6f4ea' : isDown ? '#fce8e6' : '#f1f5f9';
    const icon   = isUp ? '▲' : isDown ? '▼' : '▶';

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 11,
            fontWeight: 600,
            color,
            background: bgColor,
            borderRadius: 6,
            padding: '2px 6px',
        }}>
            <span>{icon}</span>
            <span>{value === 0 ? '0%' : `${Math.abs(value)}%`}</span>
        </span>
    );
}