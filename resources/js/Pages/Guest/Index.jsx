import AuthenticatedLayout        from '@/Layouts/AuthenticatedLayout';
import { Head, router }           from '@inertiajs/react';
import { useState, useCallback }  from 'react';

import DownloadLaporan from "@/Components/DownloadLaporan";
import STYLES                from '../../Constants/styles';
import { TABS }              from '../../Constants/options';
import { useShift }          from './hooks/UseShift';
import { useEditBuffer }     from './hooks/UseEditBuffer';
import { useDisplayedRows }  from './hooks/UseDisplayedRows';
import ShiftBar              from './components/ShiftBar';
import GuestTable            from './components/GuestTable';

const RELOAD_PROPS = {
    reguler: ['guests'],
    ota:     ['appGuests'],
    expense: ['expenses'],
};

function SearchBar({ query, onChange, resultCount }) {
    return (
        <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
                className="search-inp"
                type="text"
                placeholder="Cari nama tamu, nomor kamar, atau keterangan..."
                value={query}
                onChange={e => onChange(e.target.value)}
                autoComplete="off"
            />
            
            {query && (
                <div className="search-meta">
                    <span className="search-count">{resultCount} hasil</span>
                    <button className="search-clear" onClick={() => onChange('')} title="Hapus">
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}



export default function Index({ auth, guests = [], appGuests = [], expenses = [], selectedMonth, selectedYear }) {
    const [tab,     setTab]     = useState('reguler');
    const [newRows, setNewRows] = useState([]);
    const [query,   setQuery]   = useState('');

    const { shiftActive, activeShiftInfo, shiftInp, handleInputChange, startShift, endShift } = useShift(auth?.user);
    const { getVal, setEdit, clearEdit, getBuffer } = useEditBuffer();

    const displayedRows = useDisplayedRows(guests, appGuests, expenses, tab, newRows, activeShiftInfo, query);
    const resultCount   = displayedRows.filter(r => !r.isSeparator).length;

    const switchTab = (key) => { setTab(key); setNewRows([]); setQuery(''); };

    const addNewRow    = () => setNewRows(prev => [...prev, { _id: Math.random().toString(36).slice(2) }]);
    const updateNewRow = (rowId, key, value) => setNewRows(prev => prev.map(r => r._id === rowId ? { ...r, [key]: value } : r));
    const removeNewRow = (rowId) => setNewRows(prev => prev.filter(r => r._id !== rowId));

    const reloadCurrentTab = useCallback(() =>
        router.reload({ only: RELOAD_PROPS[tab] ?? [], preserveScroll: true }), [tab]);

    const buildShiftMeta = () => ({
        shift_admin:   `${activeShiftInfo.session}-${activeShiftInfo.name}`,
        tanggal_input: activeShiftInfo.date,
        month:         selectedMonth,
        year:          selectedYear,
    });

    const routeFor = (currentTab, action) => {
        const map = {
            reguler: { update: 'guest.update',     store: 'guest.store',     status: 'guest.status'     },
            ota:     { update: 'app-guest.update',  store: 'app-guest.store',  status: 'app-guest.status' },
        };
        return map[currentTab]?.[action] ?? null;
    };

    const routeParams = (currentTab, g) =>
        currentTab === 'ota' ? { appGuest: g.id } : { guest: g.id };

    const handleBlur = (g) => {
        const buffer = getBuffer(g.id);
        if (!buffer || Object.keys(buffer).length === 0) return;
        router.patch(
            route(routeFor(tab, 'update'), routeParams(tab, g)),
            { ...buffer, ...buildShiftMeta() },
            { preserveScroll: true, onSuccess: () => { clearEdit(g.id); reloadCurrentTab(); } }
        );
    };

    const saveRow = (id) => {
        
        // 1. Pastikan info shift tersedia sebelum simpan
        if (!activeShiftInfo) {
            alert("Shift harus aktif untuk menyimpan data!");
            return;
        }

        // 2. Cari baris di state newRows
        const row = newRows.find(item => item._id === id);
        if (!row) return;
        console.log("SHIFT:", activeShiftInfo);
        const shiftMeta = buildShiftMeta();

        // 3. Penanganan khusus tab Pengeluaran (Expense)
        if (tab === 'expense') {
            router.post(route('pengeluaran.store'), {
                user_id: auth.user.id,
                nama_barang: row.nama_barang || '',
                harga: row.harga || 0,
                keterangan: row.keterangan || '',
                ...shiftMeta
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setNewRows(prev => prev.filter(item => item._id !== id));
                    reloadCurrentTab();
                }
            });
            return; 
            // Keluar dari fungsi setelah memproses pengeluaran
        }

        // 4. Penanganan untuk Guest Reguler dan OTA
        const isOTA = tab === 'ota';
        const routeName = isOTA ? 'app-guest.store' : 'guest.store';

        const finalData = {
            user_id: auth.user.id,
            nomor_kamar: row.nomor_kamar ?? '',
            nama_tamu: row.nama_tamu ?? '',
            tanggal_checkin: row.tanggal_checkin ?? shiftMeta.tanggal_input,
            tanggal_checkout: row.tanggal_checkout ?? '',
            alamat: row.alamat ?? '',
            nik: row.nik ?? '',
            keterangan: row.keterangan ?? '',
            // Data Khusus Reguler
            total_bayar: row.total_bayar ?? 0,
            // Data Khusus OTA
            prepaid: row.prepaid ?? 0,
            pah: row.pah ?? 0,
            platform: row.platform ?? 'Other',
            ...shiftMeta
        };

        router.post(route(routeName), finalData, {
            preserveScroll: true,
            onSuccess: () => {
                setNewRows(prev => prev.filter(item => item._id !== id));
                reloadCurrentTab();
            },
            onError: (errors) => {
                console.error("Gagal simpan:", errors);
                alert("Cek kembali inputan: " + Object.values(errors).join(", "));
            }
        });
    };
    

    const deleteRow = (g) => {
        if (!window.confirm(`Hapus data "${g.nama_tamu || g.nama_barang || 'ini'}"?`)) return;

        const routeMap = {
            reguler: { name: 'guest.destroy',       params: { guest: g.id }      },
            ota:     { name: 'app-guest.destroy',    params: { appGuest: g.id }   },
            expense: { name: 'pengeluaran.destroy',  params: { pengeluaran: g.id } },
        };
        const { name, params } = routeMap[tab];

        router.delete(route(name, params), {
            preserveScroll: true,
            onSuccess: reloadCurrentTab,
        });
    };

    const toggleStatus = (g) => {
        if (tab === 'expense') return;
        const newStatus = g.status === 'checkout' ? 'checkin' : 'checkout';
        router.patch(
            route(routeFor(tab, 'status'), routeParams(tab, g)),
            { status: newStatus, ...buildShiftMeta() },
            { preserveScroll: true, onSuccess: reloadCurrentTab }
        );
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Queenput - Admin" />
            <style>{STYLES}</style>

            <div className="pg">
                <div className="tabs">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            className={`tab-btn ${tab === t.key ? 'tab-active' : 'tab-inactive'}`}
                            onClick={() => switchTab(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>


                <ShiftBar
                    shiftActive={shiftActive}
                    shiftInp={shiftInp}
                    activeShiftInfo={activeShiftInfo}
                    onInputChange={handleInputChange}
                    onStart={startShift}
                    onEndShift={() => endShift()} // Ini akan menghapus localStorage saat tugas selesai
                />

                <div className="flex items-center justify-between mb-2">
                    <SearchBar query={query} onChange={setQuery} resultCount={resultCount} />
                    <DownloadLaporan mode="bulan" month={selectedMonth} year={selectedYear} />
                </div>
                <GuestTable
                    tab={tab}
                    displayedRows={displayedRows}
                    getVal={getVal}
                    onEdit={setEdit}
                    onNewRowChange={updateNewRow}
                    onBlur={handleBlur}
                    onSave={saveRow}
                    onToggleStatus={toggleStatus}
                    onDelete={deleteRow}
                    query={query}
                />
            </div>

            {shiftActive && (
                <button className="btn-add-floating" onClick={addNewRow}>
                    ＋ TAMBAH BARIS
                </button>
            )}
        </AuthenticatedLayout>
    );
}