import { formatRupiah } from '../utils/formatRupiah';

// File: SeparatorRow.jsx
export default function SeparatorRow({ row, tab }) {
    // Jika tab 'expense', leftSpan tetap, jika bukan 'expense', 
    // sesuaikan agar proporsional dengan kolom yang Anda miliki sekarang.
    const leftSpan  = tab === 'expense' ? 2 : 5; // Coba ubah ke 5 jika sebelumnya 4
    
    // Sesuaikan rightSpan agar total kolom sesuai dengan jumlah kolom di tabel Anda.
    // Jika sebelumnya 5, coba naikkan menjadi 6.
    const rightSpan = tab === 'expense' ? 2 : 6; 

    return (
        <tr className="tr-sep">
            <td colSpan={leftSpan} className="td-sep">
                SHIFT: {row.date} | {row.name}
            </td>
            <td className="td-total">{formatRupiah(row.total)}</td>
            <td colSpan={rightSpan}></td>
        </tr>
    );
}