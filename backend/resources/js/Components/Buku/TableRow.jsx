import React from 'react';

const fRp = v => (!v && v !== 0) ? '—' : 'Rp ' + Number(v).toLocaleString('id-ID');

export default function TableRow({ 
    g, idx, tab, isSaved, isOut, isDbCheckin, 
    GUEST_HEAD, GUEST_TAIL, EXPENSE_COLS,
    getVal, setEdit, flushEdit, setNewRows, saveRow, toggleStatus 
}) {
    // Render khusus untuk baris Separator (Shift)
    if (g.isSeparator) {
        const leftSpan = tab === 'expense' ? 2 : 4;
        const rightSpan = tab === 'expense' ? 2 : 5;
        return (
            <tr className="tr-sep">
                <td colSpan={leftSpan} className="td-sep">SHIFT: {g.date} | {g.name}</td>
                <td className="td-total">{fRp(g.total)}</td>
                <td colSpan={rightSpan}></td>
            </tr>
        );
    }

    // Render untuk Tab Pengeluaran
    if (tab === 'expense') {
        return (
            <tr style={{ background: isSaved ? '#fff' : '#fffbeb' }}>
                <td className="td" style={{ textAlign: 'center' }}>{isSaved ? idx + 1 : '*'}</td>
                {EXPENSE_COLS.map(col => (
                    <td key={col.key} className="td">
                        <input className="ci" 
                            value={col.key === 'harga' ? (g[col.key] ? Number(g[col.key]) : '') : (g[col.key] || '')} 
                            disabled={isSaved}
                            type={col.key === 'harga' ? 'number' : 'text'}
                            onChange={e => setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, [col.key]: e.target.value } : r))}
                        />
                    </td>
                ))}
                <td className="td" style={{ textAlign: 'center' }}>
                    {!isSaved && (
                        <button onClick={() => saveRow(g)} disabled={!g.nama_barang || !g.harga}
                            style={{ background: (!g.nama_barang || !g.harga) ? '#9ca3af' : '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                            SIMPAN
                        </button>
                    )}
                </td>
            </tr>
        );
    }

    // Render untuk Tab Reguler & OTA
    return (
        <tr style={{ background: isSaved ? (isOut ? '#fee2e2' : '#fff') : '#fffbeb' }}>
            {GUEST_HEAD.map(col => (
                <td key={col.key} className="td">
                    <input className="ci"
                        style={{ color: isOut ? '#dc2626' : '#000', fontWeight: isSaved ? 'bold' : 'normal' }}
                        value={isDbCheckin ? getVal(g, col.key) : (g[col.key] || '')}
                        disabled={isOut}
                        onChange={e => isDbCheckin
                            ? setEdit(g.id, col.key, e.target.value)
                            : setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, [col.key]: e.target.value } : r))
                        }
                        onBlur={() => isDbCheckin && flushEdit(g)}
                    />
                </td>
            ))}
            {/* Logika kolom harga/bayar */}
            {tab === 'reguler' ? (
                <td className="td">
                    <input className="ci" type="number"
                        value={isDbCheckin ? getVal(g, 'total_bayar') : (g.total_bayar || '')}
                        disabled={isOut}
                        onChange={e => isDbCheckin 
                            ? setEdit(g.id, 'total_bayar', e.target.value)
                            : setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, total_bayar: e.target.value } : r))
                        }
                        onBlur={() => isDbCheckin && flushEdit(g)}
                    />
                </td>
            ) : (
                <>
                    <td className="td">
                        <input className="ci" type="number" value={isDbCheckin ? getVal(g, 'prepaid') : (g.prepaid || '')} disabled={isOut}
                            onChange={e => isDbCheckin ? setEdit(g.id, 'prepaid', e.target.value) : setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, prepaid: e.target.value } : r))}
                            onBlur={() => isDbCheckin && flushEdit(g)} />
                    </td>
                    <td className="td">
                        <input className="ci" type="number" value={isDbCheckin ? getVal(g, 'pah') : (g.pah || '')} disabled={isOut}
                            onChange={e => isDbCheckin ? setEdit(g.id, 'pah', e.target.value) : setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, pah: e.target.value } : r))}
                            onBlur={() => isDbCheckin && flushEdit(g)} />
                    </td>
                </>
            )}
            {GUEST_TAIL.map(col => (
                <td key={col.key} className="td">
                    <input className="ci" value={isDbCheckin ? getVal(g, col.key) : (g[col.key] || '')} disabled={isOut}
                        onChange={e => isDbCheckin ? setEdit(g.id, col.key, e.target.value) : setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, [col.key]: e.target.value } : r))}
                        onBlur={() => isDbCheckin && flushEdit(g)} />
                </td>
            ))}
            <td className="td" style={{ textAlign: 'center' }}>
                {!isSaved ? (
                    <button onClick={() => saveRow(g)} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>SIMPAN</button>
                ) : (
                    <button onClick={() => toggleStatus(g)} style={{ background: isOut ? '#ef4444' : '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', width: '85px' }}>
                        {isOut ? 'OUT ✓' : 'IN ✓'}
                    </button>
                )}
            </td>
        </tr>
    );
}