import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

const BULAN = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
];

// ── Ikon SVG inline ────────────────────────────────────────────────────────
const IconBook = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
);
const IconMore = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
    </svg>
);
const IconEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const IconTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
);
const IconPlus = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);
const IconCalendar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);
const IconUser = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

// ── Dropdown menu ⋮ per baris ──────────────────────────────────────────────
function RowMenu({ file, onRename, onDelete, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    return (
        <div ref={ref} style={{
            position: 'absolute', right: 0, top: 36, background: '#fff',
            border: '1px solid #e2e8f0', borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200,
            minWidth: 170, padding: '6px 0', overflow: 'hidden'
        }}>
            <button
                onClick={() => { onRename(file); onClose(); }}
                style={menuItemStyle}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <span style={{ color: '#3b82f6', display: 'flex' }}><IconEdit /></span>
                Ganti Nama
            </button>
            <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
            <button
                onClick={() => { onDelete(file); onClose(); }}
                style={{ ...menuItemStyle, color: '#ef4444' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <span style={{ color: '#ef4444', display: 'flex' }}><IconTrash /></span>
                Hapus Buku
            </button>
        </div>
    );
}

const menuItemStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', textAlign: 'left',
    padding: '9px 14px', fontSize: 13.5, fontWeight: 500,
    border: 'none', background: 'transparent', cursor: 'pointer',
    color: '#374151', transition: 'background 0.15s',
};

// ── Modal generik ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100, backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.15s ease'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff', borderRadius: 16, padding: '28px 28px 24px',
                    width: 380, maxWidth: 'calc(100vw - 32px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    animation: 'slideUp 0.2s ease'
                }}
                onClick={e => e.stopPropagation()}
            >
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>{title}</h3>
                {children}
            </div>
        </div>
    );
}

export default function Dashboard({ auth, files: initialFiles, currentMonth, currentYear, flash }) {
    const [openMenu, setOpenMenu]     = useState(null);
    const [modal, setModal]           = useState(null); // 'create' | 'rename' | 'delete'
    const [targetFile, setTargetFile] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving]     = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);

    // State form "Tambah Sheet"
    const [newMonth,   setNewMonth]   = useState(currentMonth);
    const [newYear,    setNewYear]    = useState(currentYear);
    const [newName,    setNewName]    = useState('');
    const [newCatatan, setNewCatatan] = useState('');
    const [newStatus,  setNewStatus]  = useState('aktif');
    const [createError, setCreateError] = useState('');

    // State form "Ganti Nama" (rename → patch ke DB)
    const [renameVal,     setRenameVal]     = useState('');
    const [renameCatatan, setRenameCatatan] = useState('');
    const [renameStatus,  setRenameStatus]  = useState('aktif');

    const getDisplayName = (file) => file.name;

    // ── Tambah Sheet ─────────────────────────────────────────────────────────
    const handleCreate = () => {
        if (isSaving) return;
        setCreateError('');
        setIsSaving(true);
        router.post(route('dashboard.createFile'), {
            month:   newMonth,
            year:    newYear,
            name:    newName.trim() || undefined,
            catatan: newCatatan.trim() || undefined,
            status:  newStatus,
        }, {
            onSuccess: () => {
                setModal(null);
                setNewName('');
                setNewCatatan('');
                setNewStatus('aktif');
                setIsSaving(false);
            },
            onError: (errors) => {
                setCreateError(errors?.month || 'Gagal menyimpan buku.');
                setIsSaving(false);
            },
        });
    };

    // ── Rename (PATCH ke DB) ──────────────────────────────────────────────────
    const openRename = (file) => {
        setTargetFile(file);
        setRenameVal(file.name);
        setRenameCatatan(file.catatan ?? '');
        setRenameStatus(file.status ?? 'aktif');
        setModal('rename');
    };

    const handleRename = () => {
        if (!renameVal.trim() || !targetFile || isSaving) return;
        setIsSaving(true);
        router.patch(route('dashboard.updateFile', { pembukuan: targetFile.id }), {
            name:    renameVal.trim(),
            catatan: renameCatatan.trim() || null,
            status:  renameStatus,
        }, {
            onSuccess: () => {
                setModal(null);
                setTargetFile(null);
                setIsSaving(false);
            },
            onError: () => setIsSaving(false),
        });
    };

    // ── Hapus ────────────────────────────────────────────────────────────────
    const openDelete = (file) => {
        setTargetFile(file);
        setModal('delete');
    };

    const handleDelete = () => {
        if (!targetFile || isDeleting) return;
        setIsDeleting(true);
        router.delete(route('dashboard.deleteFile'), {
            data: { month: targetFile.month, year: targetFile.year },
            onSuccess: () => {
                setModal(null);
                setTargetFile(null);
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
        });
    };

    // Warna badge per bulan (dekoratif)
    const monthColors = [
        '#3b82f6','#8b5cf6','#ec4899','#f97316',
        '#10b981','#14b8a6','#f59e0b','#6366f1',
        '#ef4444','#06b6d4','#84cc16','#64748b'
    ];
    const getMonthColor = (month) => monthColors[(month - 1) % 12];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>
                    Buku Pembukuan
                </h2>
            }
        >
            <Head title="File Saya - Queenput" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                * { box-sizing: border-box; }

                body, .dashboard-root { font-family: 'Plus Jakarta Sans', sans-serif; }

                @keyframes fadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes rowIn {
                    from { opacity: 0; transform: translateX(-8px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                .db-page {
                    min-height: 100vh;
                    background: #f8fafc;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                /* ── Header ── */
                .db-hero {
                    background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%);
                    padding: 32px 0 48px;
                    position: relative;
                    overflow: hidden;
                }
                .db-hero::before {
                    content: '';
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 280px; height: 280px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 50%;
                }
                .db-hero::after {
                    content: '';
                    position: absolute;
                    bottom: -40px; left: 10%;
                    width: 160px; height: 160px;
                    background: rgba(255,255,255,0.04);
                    border-radius: 50%;
                }
                .db-container { max-width: 860px; margin: 0 auto; padding: 0 24px; }

                .db-hero-top {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 28px;
                }
                .db-hero-greeting {
                    font-size: 13px; color: rgba(255,255,255,0.65);
                    font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
                }
                .db-hero-title {
                    font-size: 26px; font-weight: 800; color: #fff;
                    margin-top: 4px; letter-spacing: -0.5px;
                }

                .db-create-btn {
                    display: flex; align-items: center; gap: 8px;
                    background: rgba(255,255,255,0.15);
                    border: 1.5px solid rgba(255,255,255,0.3);
                    color: #fff; border-radius: 12px;
                    padding: 10px 18px; font-size: 14px; font-weight: 600;
                    cursor: pointer; transition: all 0.2s;
                    backdrop-filter: blur(8px);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .db-create-btn:hover {
                    background: rgba(255,255,255,0.25);
                    border-color: rgba(255,255,255,0.5);
                    transform: translateY(-1px);
                }

                /* ── Stats strip ── */
                .db-stats {
                    display: flex; gap: 12px; position: relative; z-index: 1;
                }
                .db-stat {
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.18);
                    border-radius: 10px; padding: 12px 18px;
                    backdrop-filter: blur(8px);
                }
                .db-stat-val {
                    font-size: 22px; font-weight: 800; color: #fff; line-height: 1;
                }
                .db-stat-label {
                    font-size: 11.5px; color: rgba(255,255,255,0.6); margin-top: 3px;
                    font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em;
                }

                /* ── Content ── */
                .db-content {
                    margin-top: -20px;
                    position: relative; z-index: 10;
                }
                .db-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    overflow: hidden;
                }

                /* ── Table header ── */
                .db-table-head {
                    display: grid;
                    grid-template-columns: 44px 1fr 130px 120px 44px;
                    padding: 12px 20px;
                    font-size: 11.5px; font-weight: 700; color: #94a3b8;
                    letter-spacing: 0.06em; text-transform: uppercase;
                    border-bottom: 1px solid #f1f5f9;
                    background: #fafafa;
                }

                /* ── File row ── */
                .db-file-row {
                    display: grid;
                    grid-template-columns: 44px 1fr 130px 120px 44px;
                    align-items: center;
                    padding: 0 20px;
                    border-bottom: 1px solid #f8fafc;
                    transition: background 0.15s;
                    position: relative;
                    animation: rowIn 0.25s ease both;
                }
                .db-file-row:last-child { border-bottom: none; }
                .db-file-row:hover { background: #f8fafc; }
                .db-file-row-link {
                    display: contents;
                    text-decoration: none;
                    color: inherit;
                }

                /* ── File icon ── */
                .db-file-icon {
                    width: 34px; height: 34px;
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-size: 15px; flex-shrink: 0;
                }

                /* ── File name ── */
                .db-file-name {
                    font-size: 14px; font-weight: 600; color: #1e293b;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                    padding-right: 20px;
                }
                .db-file-meta {
                    font-size: 12px; color: #94a3b8; margin-top: 2px;
                    font-weight: 500;
                }
                .db-name-wrap {
                    padding: 13px 0;
                    overflow: hidden;
                }

                /* ── Badges ── */
                .db-badge-empty {
                    display: inline-flex; align-items: center;
                    font-size: 10.5px; font-weight: 600;
                    background: #fef3c7; color: #92400e;
                    padding: 2px 8px; border-radius: 20px; margin-left: 8px;
                    vertical-align: middle; border: 1px solid #fde68a;
                }
                .db-badge-period {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 12.5px; font-weight: 500; color: #64748b;
                }

                /* ── Owner cell ── */
                .db-owner {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12.5px; color: #64748b; font-weight: 500;
                }
                .db-avatar {
                    width: 22px; height: 22px; border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; font-weight: 700; color: #fff;
                }

                /* ── More button ── */
                .db-more-btn {
                    width: 32px; height: 32px; border-radius: 8px;
                    background: none; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #cbd5e1; transition: all 0.15s;
                }
                .db-more-btn:hover {
                    background: #f1f5f9; color: #64748b;
                }

                /* ── Empty state ── */
                .db-empty {
                    text-align: center; padding: 64px 24px;
                    color: #94a3b8;
                }
                .db-empty-icon {
                    font-size: 48px; margin-bottom: 16px; opacity: 0.4;
                }
                .db-empty-title {
                    font-size: 16px; font-weight: 700; color: #475569; margin-bottom: 8px;
                }
                .db-empty-sub {
                    font-size: 14px; color: #94a3b8;
                }

                /* ── Modal inputs ── */
                .db-label {
                    display: block; font-size: 12px; font-weight: 600;
                    color: #64748b; margin-bottom: 6px;
                    text-transform: uppercase; letter-spacing: 0.04em;
                }
                .db-input {
                    width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px;
                    padding: 10px 14px; font-size: 14px; margin-bottom: 14px;
                    outline: none; transition: border-color 0.15s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: #0f172a;
                }
                .db-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

                .db-modal-btns {
                    display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;
                }
                .db-btn {
                    border-radius: 10px; padding: 10px 20px;
                    font-size: 14px; font-weight: 600; cursor: pointer;
                    border: none; transition: all 0.15s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .db-btn-cancel {
                    background: #f1f5f9; color: #475569; border: 1.5px solid #e2e8f0;
                }
                .db-btn-cancel:hover { background: #e2e8f0; }
                .db-btn-primary {
                    background: #2563eb; color: #fff;
                }
                .db-btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
                .db-btn-primary:disabled { background: #bfdbfe; cursor: not-allowed; transform: none; }
                .db-btn-danger {
                    background: #ef4444; color: #fff;
                }
                .db-btn-danger:hover { background: #dc2626; transform: translateY(-1px); }
                .db-btn-danger:disabled { background: #fca5a5; cursor: not-allowed; transform: none; }

                .db-delete-warn {
                    background: #fef2f2; border: 1px solid #fecaca;
                    border-radius: 10px; padding: 14px 16px;
                    font-size: 13.5px; color: #7f1d1d; line-height: 1.65;
                    margin-bottom: 16px;
                }
                .db-delete-warn strong { color: #991b1b; }
            `}</style>

            <div className="db-page">
                {/* ── Hero ── */}
                <div className="db-hero">
                    <div className="db-container">
                        <div className="db-hero-top">
                            <div>
                                <div className="db-hero-greeting">Selamat datang, {auth.user.name}</div>
                                <div className="db-hero-title">Buku Pembukuan Tamu</div>
                            </div>
                            <button className="db-create-btn" onClick={() => setModal('create')}>
                                <IconPlus />
                                Buku Baru
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="db-stats">
                            <div className="db-stat">
                                <div className="db-stat-val">{initialFiles?.length ?? 0}</div>
                                <div className="db-stat-label">Total Buku</div>
                            </div>
                            <div className="db-stat">
                                <div className="db-stat-val">
                                    {initialFiles?.filter(f => !f.is_empty).length ?? 0}
                                </div>
                                <div className="db-stat-label">Ada Data</div>
                            </div>
                            <div className="db-stat">
                                <div className="db-stat-val">{currentYear}</div>
                                <div className="db-stat-label">Tahun Aktif</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── File List ── */}
                <div className="db-content">
                    <div className="db-container" style={{ paddingTop: 24, paddingBottom: 40 }}>
                        <div className="db-card">
                            {/* Table header */}
                            <div className="db-table-head">
                                <div></div>
                                <div>Nama Buku</div>
                                <div>Pemilik</div>
                                <div>Periode</div>
                                <div></div>
                            </div>

                            {initialFiles && initialFiles.length > 0 ? (
                                initialFiles.map((file, idx) => (
                                    <div
                                        key={file.id}
                                        className="db-file-row"
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                        onMouseEnter={() => setHoveredRow(file.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        {/* Link wraps ikon + nama + pemilik + periode */}
                                        <Link
                                            href={route('guest.index', { month: file.month, year: file.year })}
                                            style={{ display: 'contents', textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {/* Ikon */}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div
                                                    className="db-file-icon"
                                                    style={{ background: `linear-gradient(135deg, ${getMonthColor(file.month)}, ${getMonthColor(file.month)}aa)` }}
                                                >
                                                    <IconBook />
                                                </div>
                                            </div>

                                            {/* Nama */}
                                            <div className="db-name-wrap">
                                                <div className="db-file-name">
                                                    {getDisplayName(file)}
                                                    {file.is_empty && (
                                                        <span className="db-badge-empty">Kosong</span>
                                                    )}
                                                    {file.status === 'selesai' && (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center',
                                                            fontSize: 10.5, fontWeight: 600,
                                                            background: '#dcfce7', color: '#166534',
                                                            padding: '2px 8px', borderRadius: 20,
                                                            marginLeft: 8, border: '1px solid #bbf7d0',
                                                            verticalAlign: 'middle'
                                                        }}>✓ Selesai</span>
                                                    )}
                                                </div>
                                                <div className="db-file-meta">
                                                    Pembukuan · {BULAN[file.month - 1]} {file.year}
                                                    {file.catatan && (
                                                        <span style={{ color: '#cbd5e1' }}> · {file.catatan.slice(0, 40)}{file.catatan.length > 40 ? '…' : ''}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pemilik */}
                                            <div className="db-owner">
                                                <div className="db-avatar">
                                                    {auth.user.name?.charAt(0)?.toUpperCase() ?? 'S'}
                                                </div>
                                                <span>{file.owner}</span>
                                            </div>

                                            {/* Periode */}
                                            <div className="db-badge-period">
                                                <IconCalendar />
                                                {BULAN[file.month - 1]} {file.year}
                                            </div>
                                        </Link>

                                        {/* Menu ⋮ */}
                                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
                                            onClick={e => e.preventDefault()}>
                                            <button
                                                className="db-more-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenu(openMenu === file.id ? null : file.id);
                                                }}
                                                title="Opsi"
                                            >
                                                <IconMore />
                                            </button>
                                            {openMenu === file.id && (
                                                <RowMenu
                                                    file={file}
                                                    onRename={openRename}
                                                    onDelete={openDelete}
                                                    onClose={() => setOpenMenu(null)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="db-empty">
                                    <div className="db-empty-icon">📚</div>
                                    <div className="db-empty-title">Belum ada buku pembukuan</div>
                                    <div className="db-empty-sub">
                                        Klik <strong>Buku Baru</strong> di atas untuk membuat pembukuan pertama Anda.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal: Tambah Sheet ── */}
            {modal === 'create' && (
                <Modal title="📋 Tambah Sheet Baru" onClose={() => !isSaving && setModal(null)}>

                    {/* Baris Bulan + Tahun */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label className="db-label">Bulan</label>
                            <select
                                className="db-input"
                                value={newMonth}
                                onChange={e => setNewMonth(Number(e.target.value))}
                            >
                                {BULAN.map((b, i) => (
                                    <option key={i + 1} value={i + 1}>{b}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="db-label">Tahun</label>
                            <input
                                type="number"
                                className="db-input"
                                value={newYear}
                                min="2020" max="2099"
                                onChange={e => setNewYear(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <label className="db-label">Nama Buku <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none' }}>(opsional)</span></label>
                    <input
                        type="text"
                        className="db-input"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder={`Pembukuan_${BULAN[newMonth - 1]}_${newYear}`}
                        maxLength={100}
                        autoFocus
                    />

                    <label className="db-label">Status</label>
                    <select
                        className="db-input"
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                    >
                        <option value="aktif">Aktif</option>
                        <option value="selesai">Selesai</option>
                    </select>

                    <label className="db-label">Catatan <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none' }}>(opsional)</span></label>
                    <textarea
                        className="db-input"
                        value={newCatatan}
                        onChange={e => setNewCatatan(e.target.value)}
                        placeholder="Catatan untuk buku ini..."
                        maxLength={500}
                        rows={3}
                        style={{ resize: 'vertical', minHeight: 70 }}
                    />

                    {createError && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: 8, padding: '10px 14px',
                            fontSize: 13, color: '#dc2626', marginBottom: 12
                        }}>
                            ⚠️ {createError}
                        </div>
                    )}

                    <div className="db-modal-btns">
                        <button className="db-btn db-btn-cancel" onClick={() => setModal(null)} disabled={isSaving}>
                            Batal
                        </button>
                        <button className="db-btn db-btn-primary" onClick={handleCreate} disabled={isSaving}>
                            {isSaving ? 'Menyimpan...' : '＋ Tambah Sheet'}
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Modal: Ganti Nama ── */}
            {modal === 'rename' && targetFile && (
                <Modal title="✏️ Edit Buku" onClose={() => !isSaving && setModal(null)}>
                    <label className="db-label">Nama Buku</label>
                    <input
                        type="text"
                        className="db-input"
                        value={renameVal}
                        onChange={e => setRenameVal(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && renameVal.trim() && handleRename()}
                        autoFocus
                        maxLength={100}
                        placeholder="Nama buku..."
                    />

                    <label className="db-label">Status</label>
                    <select
                        className="db-input"
                        value={renameStatus}
                        onChange={e => setRenameStatus(e.target.value)}
                    >
                        <option value="aktif">Aktif</option>
                        <option value="selesai">Selesai</option>
                    </select>

                    <label className="db-label">Catatan <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none' }}>(opsional)</span></label>
                    <textarea
                        className="db-input"
                        value={renameCatatan}
                        onChange={e => setRenameCatatan(e.target.value)}
                        placeholder="Catatan untuk buku ini..."
                        maxLength={500}
                        rows={3}
                        style={{ resize: 'vertical', minHeight: 70 }}
                    />

                    <div className="db-modal-btns">
                        <button className="db-btn db-btn-cancel" onClick={() => setModal(null)} disabled={isSaving}>Batal</button>
                        <button
                            className="db-btn db-btn-primary"
                            onClick={handleRename}
                            disabled={!renameVal.trim() || isSaving}
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Modal: Konfirmasi Hapus ── */}
            {modal === 'delete' && targetFile && (
                <Modal title="🗑️ Hapus Buku" onClose={() => !isDeleting && setModal(null)}>
                    <div className="db-delete-warn">
                        Anda akan menghapus buku <strong>{getDisplayName(targetFile)}</strong>.<br />
                        Semua data tamu reguler, OTA, dan pengeluaran bulan{' '}
                        <strong>{BULAN[targetFile.month - 1]} {targetFile.year}</strong> akan{' '}
                        <strong>terhapus permanen</strong> dan tidak bisa dikembalikan.
                    </div>
                    <div className="db-modal-btns">
                        <button
                            className="db-btn db-btn-cancel"
                            onClick={() => setModal(null)}
                            disabled={isDeleting}
                        >
                            Batal
                        </button>
                        <button
                            className="db-btn db-btn-danger"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}