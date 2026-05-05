const STYLES = `
    /* ── Reset & root ───────────────────────────────────────────── */
    * { box-sizing: border-box; }

    /*
     * Layout utama: flex column mengisi tinggi viewport penuh.
     * Dengan ini setiap child punya height terdefinisi dan
     * .tbl-wrap bisa pakai flex:1 untuk mengisi sisa ruang —
     * tidak perlu lagi calc() yang rawan meleset.
     */
    .pg {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 64px); /* kurangi tinggi navbar AuthenticatedLayout */
        overflow: hidden;
        background: #f1f5f9;
        font-family: 'Segoe UI', system-ui, sans-serif;
    }

    /* ── Tabs ───────────────────────────────────────────────────── */
    .tabs {
        display: flex;
        gap: 2px;
        background: #e2e8f0;
        padding: 6px 12px 0;
        flex-shrink: 0; /* tidak menyusut */
    }
    .tab-btn {
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        border-radius: 8px 8px 0 0;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.5px;
        transition: background 0.15s, color 0.15s;
    }
    .tab-active   { background: white; color: #2563eb; box-shadow: 0 -2px 0 #2563eb inset; }
    .tab-inactive { background: #cbd5e1; color: #64748b; }
    .tab-inactive:hover { background: #e2e8f0; }

    /* ── Shift header ───────────────────────────────────────────── */
    .shift-header {
        background: #0f172a;
        color: white;
        padding: 12px 16px;
        display: flex;
        align-items: flex-end;
        gap: 10px;
        flex-shrink: 0; /* tidak menyusut */
        border-bottom: 2px solid #1e293b;
    }
    .inp-group { display: flex; flex-direction: column; flex: 1; min-width: 120px; gap: 4px; font-size: 11px; font-weight: 600; color: #94a3b8; letter-spacing: 0.5px; }
    .inp-s     { background: #1e293b; border: 1px solid #334155; padding: 8px 10px; border-radius: 6px; color: white; width: 100%; font-size: 13px; }
    .inp-s:focus { outline: none; border-color: #3b82f6; }

    /* ── Tabel wrapper — mengisi sisa ruang ─────────────────────── */
    .tbl-wrap {
        flex: 1;           /* ambil semua sisa tinggi setelah tabs + shift-header */
        overflow-x: auto;
        overflow-y: auto;
        background: white;
        margin: 0 12px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    /* ── Tabel ──────────────────────────────────────────────────── */
    .tbl {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 13px;
        min-width: 1100px;
    }

    /* thead sticky relatif terhadap .tbl-wrap — selalu kelihatan */
    .th {
        background: #f8fafc;
        padding: 11px 10px;
        border-bottom: 2px solid #e2e8f0;
        text-align: left;
        position: sticky;
        top: 0;
        z-index: 50;
        font-size: 11px;
        font-weight: 700;
        color: #475569;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        white-space: nowrap;
    }

    .td { border-bottom: 1px solid #f1f5f9; height: 48px; }

    /* Row hover */
    tbody tr:hover td { background: #f8fafc; }

    .ci       { width: 100%; height: 100%; border: none; padding: 0 10px; background: transparent; outline: none; font-size: 13px; color: #1e293b; }
    .ci:focus { background: #eff6ff; border-radius: 4px; }

    /* ── Separator row (shift divider) ─────────────────────────── */
    .tr-sep   { background: #1e293b !important; }
    .tr-sep:hover td { background: #1e293b !important; }
    .td-sep   { padding: 10px 12px; font-weight: 700; font-size: 11px; color: #94a3b8; letter-spacing: 0.5px; }
    .td-total { text-align: right; padding-right: 16px; color: #34d399; font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; }

    /* ── Delete button (muncul saat row di-hover) ───────────────── */
    .td-aksi {
        text-align: center;
        white-space: nowrap;
        padding: 0 8px;
    }
    .aksi-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        height: 100%;
    }
    .btn-delete {
        opacity: 0;
        pointer-events: none;
        background: #fc1313;
        border: none;
        cursor: pointer;
        color: #fee2e2;
        text-weight: bold;
        font-size: 16px;
        padding: 5px 6px;
        border-radius: 6px;
        line-height: 1;
        transition: opacity .15s, color .15s, background .15s;
        flex-shrink: 0;
    }
    tr:hover .btn-delete   { opacity: 1; pointer-events: auto; }
    .btn-delete:hover      { color: #ed1414; background: #fee2e2; }

    /* ── Floating add button ────────────────────────────────────── */
    .btn-add-floating {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 1100;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 24px;
        background: #1e293b;
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        letter-spacing: 0.5px;
    }
    .btn-add-floating:hover  { background: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(37,99,235,0.4); }
    .btn-add-floating:active { transform: translateY(0); }

    /* Container Utama Pencarian & Aksi */
.search-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    background: #f8fafc; /* Background sangat tipis agar beda dengan tabel */
    padding: 12px;
    border-radius: 12px;
}

/* Search Bar Wrapper */
    .search-bar {
        display: flex;
        align-items: center;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0 12px;
        height: 42px; /* Tinggi yang konsisten */
        flex: 1; /* Biar memanjang memenuhi ruang */
        max-width: 600px;
        transition: all 0.2s ease;
    }

    .search-bar:focus-within {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
        font-size: 16px;
        margin-right: 10px;
        filter: grayscale(1); /* Membuat emoji kaca pembesar lebih elegan */
    }

    .search-inp {
        border: none;
        outline: none;
        width: 100%;
        font-size: 14px;
        color: #334155;
    }

    /* Hasil & Clear Button */
    .search-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        border-left: 1px solid #e2e8f0;
        padding-left: 10px;
    }

    .search-count {
        font-size: 12px;
        color: #64748b;
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 4px;
        white-space: nowrap;
    }

    .search-clear {
        background: #f1f5f9;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        transition: all 0.2s;
    }

    .search-clear:hover {
        background: #fee2e2;
        color: #ef4444;
    }

    /* Bagian Tombol Laporan */
    .action-right {
        display: flex;
        align-items: center;
        gap: 12px;
    }
`;

export default STYLES;