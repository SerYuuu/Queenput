import { SHIFT_SESSIONS } from '../../../Constants/options';
import { usePage } from '@inertiajs/react';

// 1. KOMPONEN UTAMA (Harus Default Export)
export default function ShiftBar({ 
    shiftActive, 
    shiftInp, 
    activeShiftInfo, 
    onInputChange, 
    onStart, 
    onLogout, 
    onEndShift 
}) {
    // Hooks harus dipanggil di sini, di dalam fungsi komponen
    const { auth } = usePage().props;
    const user = auth.user;

    // Logika untuk membedakan Admin (pemilik shift) dan Owner (pantauan)
    const canControl = activeShiftInfo?.userId === user.id;
    const isOwner = user.role === 'owner';

    return (
        <div className="shift-header">
            {!shiftActive ? (
                // Hanya tampilkan form jika bukan owner
                !isOwner && <ShiftForm shiftInp={shiftInp} onInputChange={onInputChange} onStart={onStart} />
            ) : (
                <ShiftInfo 
                    activeShiftInfo={activeShiftInfo} 
                    onLogout={onLogout} 
                    canControl={canControl} 
                    isOwner={isOwner}
                    onEndShift={onEndShift}
                />
            )}
        </div>
    );
}

// 2. KOMPONEN PENDUKUNG: SHIFTFORM (Definisikan di luar komponen utama)
function ShiftForm({ shiftInp, onInputChange, onStart }) {
    return (
        <>
            <div className="inp-group">
                Admin
                <input
                    className="inp-s"
                    value={shiftInp.name}
                    onChange={e => onInputChange('name', e.target.value)}
                />
            </div>
            <div className="inp-group">
                Shift
                <select
                    className="inp-s"
                    value={shiftInp.session}
                    onChange={e => onInputChange('session', e.target.value)}
                >
                    {SHIFT_SESSIONS.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
            <div className="inp-group">
                Tanggal
                <input
                    className="inp-s"
                    type="date"
                    value={shiftInp.date}
                    onChange={e => onInputChange('date', e.target.value)}
                />
            </div>
            <button onClick={onStart} className="btn-start-shift"
            style={{
                    flex: '1', background: '#2563eb', color: 'white',
                    padding: '10px', borderRadius: '6px', border: 'none',
                    fontWeight: 'bold', cursor: 'pointer',
                }}>
                
                MULAI SHIFT
            </button>
        </>
    );
}

// 3. KOMPONEN PENDUKUNG: SHIFTINFO
// ShiftBar.jsx
function ShiftInfo({ activeShiftInfo, canControl, isOwner, onEndShift }) {
    return (
        <div style={{ display: 'flex', width: '100%', justifyBetween: 'center', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
                {isOwner && <span style={{ color: '#2563eb', fontWeight: 'bold' }}>[PANTUAN] </span>}
                <strong>{activeShiftInfo.session} - {activeShiftInfo.name}</strong>{' '}
                <small style={{ opacity: 0.7 }}>({activeShiftInfo.date})</small>
            </div>
            
            <div>
                {/* Tombol Akhiri Shift hanya muncul jika user adalah pemilik shift tersebut */}
                {canControl && (
                    <button
                        onClick={() => onEndShift()} // Memanggil endShift() dari props
                        style={{
                            background: '#fbbf24', color: 'black', padding: '6px 12px',
                            borderRadius: '4px', border: 'none', cursor: 'pointer', 
                            fontWeight: 'bold', fontSize: '12px'
                        }}
                    >
                        AKHIRI SHIFT
                    </button>
                )}
            </div>
        </div>
    );
}