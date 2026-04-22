export default function BukuHeader({ 
    tab, setTab, shiftActive, setShiftActive, 
    shiftInp, setShiftInp, activeShiftInfo, setActiveShiftInfo, setNewRows 
}) {
    return (
        <div className="header-fixed-container">
            <div className="tabs">
                {['reguler', 'ota', 'expense'].map((t) => (
                    <button key={t} 
                        onClick={() => { setTab(t); setNewRows([]); }}
                        className={`tab-btn ${tab === t ? 'tab-active' : 'tab-inactive'}`}>
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="shift-header">
                {!shiftActive ? (
                    <>
                        <div className="inp-group">
                            <label>Admin</label>
                            <input className="inp-s" placeholder="Nama..." value={shiftInp.name} onChange={e => setShiftInp({...shiftInp, name: e.target.value})} />
                        </div>
                        <div className="inp-group">
                            <label>Shift</label>
                            <select className="inp-s" value={shiftInp.session} onChange={e => setShiftInp({...shiftInp, session: e.target.value})}>
                                <option>Pagi</option><option>Siang</option><option>Malam</option>
                            </select>
                        </div>
                        <div className="inp-group">
                            <label>Tanggal</label>
                            <input className="inp-s" type="date" value={shiftInp.date} onChange={e => setShiftInp({...shiftInp, date: e.target.value})} />
                        </div>
                        <button className="inp-s" style={{background: '#2563eb', border:'none', marginTop: '18px', cursor: 'pointer', fontWeight:'bold'}} 
                            onClick={() => { if(shiftInp.name) { setActiveShiftInfo(shiftInp); setShiftActive(true); } }}>
                            MULAI SHIFT
                        </button>
                    </>
                ) : (
                    <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                        <div>
                            <span style={{color: '#10b981'}}>●</span> <strong>{activeShiftInfo.session} - {activeShiftInfo.name}</strong> 
                            <small style={{marginLeft: 10}}>{activeShiftInfo.date}</small>
                        </div>
                        <button onClick={() => { setShiftActive(false); setActiveShiftInfo(null); setNewRows([]); }} 
                            style={{background:'#dc2626', color:'white', border:'none', padding:'8px 15px', borderRadius: '6px', cursor:'pointer'}}>
                            LOG OUT
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}