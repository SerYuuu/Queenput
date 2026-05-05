import { useMemo } from 'react';

const GUEST_SEARCH_KEYS   = ['nomor_kamar', 'nama_tamu', 'tanggal_checkin', 'tanggal_checkout', 'total_bayar', 'alamat', 'nik', 'keterangan', 'shift_admin', 'tanggal_input', 'prepaid', 'pah', 'platform'];
const EXPENSE_SEARCH_KEYS = ['nama_barang', 'harga', 'keterangan', 'shift_admin', 'tanggal_input'];

function matchesQuery(row, query, tab) {
    if (!query) return true;
    const q    = query.toLowerCase();
    const keys = tab === 'expense' ? EXPENSE_SEARCH_KEYS : GUEST_SEARCH_KEYS;
    return keys.some(key => String(row[key] ?? '').toLowerCase().includes(q));
}

export function useDisplayedRows(guests, appGuests, expenses, tab, newRows, activeShiftInfo, query = '') {
    return useMemo(() => {
        const dbData = tab === 'reguler' ? guests
                     : tab === 'ota'     ? appGuests
                     :                    expenses;

        const activeRows = newRows.map(nr => ({
            ...nr,
            shift_admin:   activeShiftInfo ? `${activeShiftInfo.session}-${activeShiftInfo.name}` : '',
            tanggal_input: activeShiftInfo?.date ?? '',
            status: 'checkin',
        }));

        // Kelompokkan dbData per shift key, pertahankan urutan asli
        const groupMap = new Map();
        dbData.forEach(g => {
            const key = `${g.tanggal_input}-${g.shift_admin}`;
            if (!groupMap.has(key)) groupMap.set(key, []);
            groupMap.get(key).push(g);
        });

        // Susun ulang: group non-aktif dulu, group aktif + newRows paling bawah
        let activeGroupRows = [];
        const orderedGroups = [];

        groupMap.forEach((rows, key) => {
            const isActive = activeShiftInfo
                && key === `${activeShiftInfo.date}-${activeShiftInfo.session}-${activeShiftInfo.name}`;

            if (isActive) {
                activeGroupRows = rows;
            } else {
                orderedGroups.push({ key, rows });
            }
        });

        if (activeShiftInfo) {
            const activeKeyFull = `${activeShiftInfo.date}-${activeShiftInfo.session}-${activeShiftInfo.name}`;
            orderedGroups.push({ key: activeKeyFull, rows: [...activeGroupRows, ...activeRows] });
        }

        // Bangun final array dengan separator, terapkan filter query per group
        const final = [];

        orderedGroups.forEach(({ rows }) => {
            // Filter baris sesuai query — unsaved rows (newRows) tidak difilter agar tetap muncul
            const filtered = rows.filter(g => g._id || matchesQuery(g, query, tab));
            if (filtered.length === 0) return;

            let shiftTotal = 0;
            let displayIdx = 0;

            filtered.forEach(g => {
                displayIdx++;
                final.push({ ...g, _rowIndex: displayIdx });

                const val = tab === 'expense' ? g.harga
                          : tab === 'reguler' ? g.total_bayar
                          : (Number(g.prepaid ?? 0) + Number(g.pah ?? 0));

                shiftTotal += Number(val ?? 0);
            });

            // Separator di bawah setiap group
            const last = filtered[filtered.length - 1];
            final.push({
                isSeparator: true,
                name:        last.shift_admin   ?? '',
                total:       shiftTotal,
                date:        last.tanggal_input ?? '',
            });
        });

        return final;
    }, [guests, appGuests, expenses, tab, newRows, activeShiftInfo, query]);
}