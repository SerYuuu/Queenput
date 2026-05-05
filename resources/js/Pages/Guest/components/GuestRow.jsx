import CellInput    from './CellInput';
import ActionButton from './ActionButton';
import { GUEST_HEAD_COLS, GUEST_TAIL_COLS } from '../../../Constants/columns';

export default function GuestRow({ g, tab, getVal, onEdit, onNewRowChange, onBlur, onSave, onToggleStatus, query }) {
    const isSaved     = !!g.id;
    const isOut       = g.status === 'checkout';
    const isDbCheckin = isSaved && !isOut;

    const handleChange = (key, value) => {
        if (isDbCheckin) onEdit(g.id, key, value);
        else onNewRowChange(g._id, key, value);
    };

    const textVal = (key) =>
        isDbCheckin ? getVal(g, key) : (g[key] ?? '');

    const numVal = (key) =>
        isDbCheckin ? getVal(g, key) : (g[key] ? Number(g[key]) : '');

    return (
        <tr style={{ background: isSaved ? (isOut ? '#fee2e2' : '#fff') : '#fffbeb' }}>
            {GUEST_HEAD_COLS.map(col => (
                <td key={col.key} className="td">
                    <CellInput
                        value={textVal(col.key)}
                        disabled={isOut}
                        query={query}
                        onChange={e => handleChange(col.key, e.target.value)}
                        onBlur={() => isDbCheckin && onBlur(g)}
                        style={{
                            color:      isOut ? '#dc2626' : '#000',
                            fontWeight: isSaved ? 'bold' : 'normal',
                        }}
                    />
                </td>
            ))}

            {tab === 'reguler' ? (
                <td className="td">
                    <CellInput
                        type="number"
                        value={numVal('total_bayar')}
                        disabled={isOut}
                        query={query}
                        onChange={e => handleChange('total_bayar', e.target.value)}
                        onBlur={() => isDbCheckin && onBlur(g)}
                    />
                </td>
            ) : (
                <>
                        <td className="td">
                            <select
                                className="ci" // Menggunakan class ci agar styling konsisten dengan CellInput[cite: 5]
                                value={isDbCheckin ? getVal(g, 'platform') : (g['platform'] ?? 'Other')}
                                disabled={isOut}
                                onChange={e => handleChange('platform', e.target.value)}
                                onBlur={() => isDbCheckin && onBlur(g)}
                                style={{ 
                                    border: 'none', 
                                    background: 'transparent', 
                                    width: '100%',
                                    height: '100%',
                                    outline: 'none',
                                    appearance: 'none' // Menghilangkan panah default jika ingin sangat clean
                                }}
                            >
                                <option value="Agoda">Agoda</option>
                                <option value="RedDoorz">RedDoorz</option>
                                <option value="Traveloka">Traveloka</option>
                                <option value="Other">Other</option>
                            </select>
                        </td>
                    {['prepaid', 'pah'].map(key => (
                        <td key={key} className="td">
                            <CellInput
                                type="number"
                                value={numVal(key)}
                                disabled={isOut}
                                query={query}
                                onChange={e => handleChange(key, e.target.value)}
                                onBlur={() => isDbCheckin && onBlur(g)}
                            />
                        </td>
                        
                    ))}
                </>
            )}

            {GUEST_TAIL_COLS.map(col => (
                <td key={col.key} className="td">
                    <CellInput
                        value={textVal(col.key)}
                        disabled={isOut}
                        query={query}
                        onChange={e => handleChange(col.key, e.target.value)}
                        onBlur={() => isDbCheckin && onBlur(g)}
                    />
                </td>
            ))}

            <td className="td td-aksi">
                <div className="aksi-wrap">
                    {!isSaved ? (
                        <ActionButton label="SIMPAN" onClick={() => onSave(g)} color="#16a34a" />
                    ) : (
                        <>
                            <button
                                onClick={() => onToggleStatus(g)}
                                style={{
                                    background:   isOut ? '#ef4444' : '#3b82f6',
                                    color:        'white',
                                    border:       'none',
                                    padding:      '5px 10px',
                                    borderRadius: '4px',
                                    fontSize:     '10px',
                                    fontWeight:   'bold',
                                    width:        '72px',
                                    cursor:       'pointer',
                                    flexShrink:   0,
                                }}
                            >
                                {isOut ? 'OUT ✓' : 'IN ✓'}
                            </button>
                            <button
                                className="btn-delete"
                                onClick={() => onDelete(g)}
                                title="Hapus data"
                            >
                                🗑
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}