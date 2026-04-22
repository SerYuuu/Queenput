import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';

const fRp = v => (!v && v !== 0) ? '—' : 'Rp ' + Number(v).toLocaleString('id-ID');

const GUEST_HEAD = [
    { key: 'nomor_kamar',      label: 'No. Kamar',   w: 90 },
    { key: 'nama_tamu',        label: 'Nama Tamu',   w: 180 },
    { key: 'tanggal_checkin',  label: 'Jam In',      w: 80 },
    { key: 'tanggal_checkout', label: 'Jam Out',     w: 80 },
];

const GUEST_TAIL = [
    { key: 'alamat',           label: 'Alamat',      w: 150 },
    { key: 'nik',              label: 'NIK',         w: 140 },
    { key: 'keterangan',       label: 'Keterangan',  w: 160 },
];

const EXPENSE_COLS = [
    { key: 'nama_barang',      label: 'Nama Barang', w: 250 },
    { key: 'harga',            label: 'Harga',       w: 150 },
    { key: 'keterangan',       label: 'Keterangan',  w: 300 },
];

export default function Index({ auth, guests = [], appGuests = [], expenses = [], selectedMonth, selectedYear }) {
    const [tab, setTab] = useState('reguler');
    const [newRows, setNewRows] = useState([]);
    const [editBuffer, setEditBuffer] = useState({});
    const [shiftActive, setShiftActive] = useState(false);
    const [shiftInp, setShiftInp] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        session: 'Pagi'
    });
    const [activeShiftInfo, setActiveShiftInfo] = useState(null);

    const displayedRows = useMemo(() => {
        let dbData = tab === 'reguler' ? guests : (tab === 'ota' ? appGuests : expenses);

        const activeRows = newRows.map(nr => ({
            ...nr,
            shift_admin: activeShiftInfo ? `${activeShiftInfo.session}-${activeShiftInfo.name}` : '',
            tanggal_input: activeShiftInfo ? activeShiftInfo.date : '',
            status: 'checkin'
        }));

        const allData = [...dbData, ...activeRows];
        const final = [];
        let lastKey = null;
        let shiftTotal = 0;

        allData.forEach((g, idx) => {
            const currentKey = `${g.tanggal_input}-${g.shift_admin}`;
            if (lastKey !== null && currentKey !== lastKey) {
                final.push({
                    isSeparator: true,
                    name: allData[idx - 1].shift_admin,
                    total: shiftTotal,
                    date: allData[idx - 1].tanggal_input
                });
                shiftTotal = 0;
            }
            final.push(g);
            
            // Hitung total berdasarkan tipe tab
            const val = tab === 'expense' 
                ? g.harga 
                : (tab === 'reguler' ? g.total_bayar : (Number(g.prepaid || 0) + Number(g.pah || 0)));
            
            shiftTotal += Number(val || 0);
            lastKey = currentKey;
        });

        if (allData.length > 0) {
            const lastRow = allData[allData.length - 1];
            final.push({ isSeparator: true, name: lastRow.shift_admin, total: shiftTotal, date: lastRow.tanggal_input });
        }
        return final;
    }, [guests, appGuests, expenses, tab, newRows, activeShiftInfo]);

    const getVal = (g, key) => {
        if (editBuffer[g.id] && editBuffer[g.id][key] !== undefined) return editBuffer[g.id][key];
        return g[key] || '';
    };

    const setEdit = (id, key, val) => {
        setEditBuffer(prev => ({
            ...prev,
            [id]: { ...(prev[id] || {}), [key]: val }
        }));
    };

    const flushEdit = (g) => {
        if (!editBuffer[g.id] || Object.keys(editBuffer[g.id]).length === 0) return;
        const isOta = tab === 'ota';
        const routeName = isOta ? 'app-guest.update' : 'guest.update';
        const params = isOta ? { appGuest: g.id } : { guest: g.id };

        router.patch(route(routeName, params), editBuffer[g.id], {
            preserveScroll: true,
            onSuccess: () => {
                setEditBuffer(prev => {
                    const next = { ...prev };
                    delete next[g.id];
                    return next;
                });
            }
        });
    };

    const saveRow = (row) => {
        if (!activeShiftInfo) return;

        const shiftData = {
            shift_admin:   `${activeShiftInfo.session}-${activeShiftInfo.name}`,
            tanggal_input: activeShiftInfo.date,
            month: selectedMonth,
            year:  selectedYear,
        };

        if (tab === 'expense') {
            router.post(route('pengeluaran.store'), {
                nama_barang: row.nama_barang || '',
                harga:       row.harga || 0,
                keterangan:  row.keterangan || '',
                ...shiftData,
            }, {
                onSuccess: () => setNewRows(p => p.filter(r => r._id !== row._id)),
                preserveScroll: true,
            });
        } else {
            const routeName = tab === 'reguler' ? 'guest.store' : 'app-guest.store';
            router.post(route(routeName), {
                ...row,
                ...shiftData,
            }, {
                onSuccess: () => setNewRows(p => p.filter(r => r._id !== row._id)),
                preserveScroll: true,
            });
        }
    };

    const toggleStatus = (g) => {
        if (tab === 'expense') return;
        const isOta = tab === 'ota';
        const ruteName = isOta ? 'app-guest.status' : 'guest.status';
        const params = isOta ? { appGuest: g.id } : { guest: g.id };
        const newStatus = g.status === 'checkout' ? 'checkin' : 'checkout';
        router.patch(route(ruteName, params), { status: newStatus }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Queenput - Admin" />

            <style>{`
                .pg { width: 100%; overflow-x: hidden; background: #f3f4f6; min-height: 100vh; }
                .tabs { display: flex; gap: 2px; background: #e5e7eb; padding: 5px 10px 0; }
                .tab-btn { padding: 12px 20px; border: none; cursor: pointer; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 11px; }
                .tab-active { background: white; color: #2563eb; }
                .tab-inactive { background: #d1d5db; color: #4b5563; }
                .shift-header { background: #111827; color: white; padding: 15px; display: flex; align-items: flex-end; gap: 10px; position: sticky; top: 0; z-index: 100; }
                .inp-group { display: flex; flex-direction: column; flex: 1; min-width: 120px; }
                .inp-s { background: #374151; border: 1px solid #4b5563; padding: 8px; border-radius: 6px; color: white; width: 100%; }
                .tbl-wrap { margin: 0 10px 10px; background: white; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; overflow: auto; max-height: 78vh; }
                .tbl { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; min-width: 1100px; }
                .th { background: #f9fafb; padding: 12px 8px; border-bottom: 2px solid #e5e7eb; text-align: left; position: sticky; top: 0; z-index: 50; }
                .td { border-bottom: 1px solid #f3f4f6; height: 48px; }
                .ci { width: 100%; height: 100%; border: none; padding: 0 8px; background: transparent; outline: none; }
                .ci:focus { background: #eff6ff; }
                .tr-sep { background: #000 !important; color: white; }
                .td-sep { padding: 10px; font-weight: bold; font-size: 11px; }
                .td-total { text-align: right; padding-right: 15px; color: #10b981; font-family: monospace; font-size: 15px; font-weight: bold; }
                .btn-plus { margin: 10px; padding: 15px; background: #111827; color: white; border-radius: 8px; border: none; width: calc(100% - 20px); font-weight: bold; cursor: pointer; }
            `}</style>

            <div className="pg">
                <div className="tabs">
                    <button className={`tab-btn ${tab === 'reguler' ? 'tab-active' : 'tab-inactive'}`} onClick={() => { setTab('reguler'); setNewRows([]); setEditBuffer({}); }}>REGULER</button>
                    <button className={`tab-btn ${tab === 'ota' ? 'tab-active' : 'tab-inactive'}`} onClick={() => { setTab('ota'); setNewRows([]); setEditBuffer({}); }}>OTA / APLIKASI</button>
                    <button className={`tab-btn ${tab === 'expense' ? 'tab-active' : 'tab-inactive'}`} onClick={() => { setTab('expense'); setNewRows([]); setEditBuffer({}); }}>PENGELUARAN</button>
                </div>

                <div className="shift-header">
                    {!shiftActive ? (
                        <>
                            <div className="inp-group">Admin <input className="inp-s" value={shiftInp.name} onChange={e => setShiftInp({ ...shiftInp, name: e.target.value })} /></div>
                            <div className="inp-group">Shift
                                <select className="inp-s" value={shiftInp.session} onChange={e => setShiftInp({ ...shiftInp, session: e.target.value })}>
                                    <option>Pagi</option><option>Siang</option><option>Malam</option>
                                </select>
                            </div>
                            <div className="inp-group">Tanggal <input className="inp-s" type="date" value={shiftInp.date} onChange={e => setShiftInp({ ...shiftInp, date: e.target.value })} /></div>
                            <button style={{ flex: '1', background: '#2563eb', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { if (shiftInp.name) { setActiveShiftInfo({ ...shiftInp }); setShiftActive(true); } }}>MULAI SHIFT</button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><strong>{activeShiftInfo.session} - {activeShiftInfo.name}</strong> <small>({activeShiftInfo.date})</small></div>
                            <button onClick={() => { setShiftActive(false); setActiveShiftInfo(null); setNewRows([]); }} style={{ background: '#dc2626', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>LOG OUT</button>
                        </div>
                    )}
                </div>

                <div className="tbl-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                {tab === 'expense' ? (
                                    <>
                                        <th className="th" style={{ textAlign: 'center', width: 50 }}>No</th>
                                        {EXPENSE_COLS.map(c => <th key={c.key} className="th" style={{ width: c.w }}>{c.label}</th>)}
                                        <th className="th" style={{ textAlign: 'center', width: 100 }}>Aksi</th>
                                    </>
                                ) : (
                                    <>
                                        {GUEST_HEAD.map(c => <th key={c.key} className="th" style={{ width: c.w }}>{c.label}</th>)}
                                        {tab === 'reguler' ? <th className="th" style={{ width: 130 }}>Harga</th> : <><th className="th" style={{ width: 100 }}>Prepaid</th><th className="th" style={{ width: 100 }}>PAH</th></>}
                                        {GUEST_TAIL.map(c => <th key={c.key} className="th" style={{ width: c.w }}>{c.label}</th>)}
                                        <th className="th" style={{ textAlign: 'center', width: 100 }}>Aksi</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRows.map((g, idx) => {
                                if (g.isSeparator) {
                                    const leftSpan = tab === 'expense' ? 2 : 4;
                                    const rightSpan = tab === 'expense' ? 2 : 5;
                                    return (
                                        <tr key={`sep-${idx}`} className="tr-sep">
                                            <td colSpan={leftSpan} className="td-sep">SHIFT: {g.date} | {g.name}</td>
                                            <td className="td-total">{fRp(g.total)}</td>
                                            <td colSpan={rightSpan}></td>
                                        </tr>
                                    );
                                }

                                const isSaved = !!g.id;
                                const isOut   = g.status === 'checkout';
                                const isDbCheckin = isSaved && !isOut;

                                if (tab === 'expense') {
                                    return (
                                        <tr key={g.id || g._id} style={{ background: isSaved ? '#fff' : '#fffbeb' }}>
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
                                                        style={{ background: (!g.nama_barang || !g.harga) ? '#9ca3af' : '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: (!g.nama_barang || !g.harga) ? 'not-allowed' : 'pointer' }}>
                                                        SIMPAN
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }

                                return (
                                    <tr key={g.id || g._id} style={{ background: isSaved ? (isOut ? '#fee2e2' : '#fff') : '#fffbeb' }}>
                                        {GUEST_HEAD.map(col => (
                                            <td key={col.key} className="td">
                                                <input className="ci"
                                                    style={{ color: isDbCheckin ? '#000' : (isOut ? '#dc2626' : '#000'), fontWeight: isSaved ? 'bold' : 'normal' }}
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
                                        {tab === 'reguler' ? (
                                            <td className="td">
                                                <input className="ci" type="number"
                                                    value={isDbCheckin ? getVal(g, 'total_bayar') : (g.total_bayar ? Number(g.total_bayar) : '')}
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
                                                    <input className="ci" type="number"
                                                        value={isDbCheckin ? getVal(g, 'prepaid') : (g.prepaid ? Number(g.prepaid) : '')}
                                                        disabled={isOut}
                                                        onChange={e => isDbCheckin
                                                            ? setEdit(g.id, 'prepaid', e.target.value)
                                                            : setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, prepaid: e.target.value } : r))
                                                        }
                                                        onBlur={() => isDbCheckin && flushEdit(g)}
                                                    />
                                                </td>
                                                <td className="td">
                                                    <input className="ci" type="number"
                                                        value={isDbCheckin ? getVal(g, 'pah') : (g.pah ? Number(g.pah) : '')}
                                                        disabled={isOut}
                                                        onChange={e => isDbCheckin
                                                            ? setEdit(g.id, 'pah', e.target.value)
                                                            : setNewRows(prev => prev.map(r => r._id === g._id ? { ...r, pah: e.target.value } : r))
                                                        }
                                                        onBlur={() => isDbCheckin && flushEdit(g)}
                                                    />
                                                </td>
                                            </>
                                        )}
                                        {GUEST_TAIL.map(col => (
                                            <td key={col.key} className="td">
                                                <input className="ci"
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
                                        <td className="td" style={{ textAlign: 'center' }}>
                                            {!isSaved ? (
                                                <button onClick={() => saveRow(g)} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>SIMPAN</button>
                                            ) : (
                                                <button onClick={() => toggleStatus(g)}
                                                    style={{ background: isOut ? '#ef4444' : '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', width: '85px', cursor: 'pointer' }}>
                                                    {isOut ? 'OUT ✓' : 'IN ✓'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {shiftActive && <button className="btn-plus" onClick={() => setNewRows([...newRows, { _id: Math.random().toString(36).slice(2) }])}>+ TAMBAH BARIS</button>}
            </div>
        </AuthenticatedLayout>
    );
}