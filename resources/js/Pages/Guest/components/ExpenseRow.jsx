import CellInput    from './CellInput';
import ActionButton from './ActionButton';
import { EXPENSE_COLS } from '../../../Constants/columns';

export default function ExpenseRow({ g, onFieldChange, onSave, query }) {
    const isSaved = !!g.id;
    const canSave = !!(g.nama_barang && g.harga);

    return (
        <tr style={{ background: isSaved ? '#fff' : '#fffbeb' }}>
            <td className="td" style={{ textAlign: 'center' }}>
                {isSaved ? g._rowIndex : '*'}
            </td>

            {EXPENSE_COLS.map(col => (
                <td key={col.key} className="td">
                    <CellInput
                        type={col.key === 'harga' ? 'number' : 'text'}
                        value={col.key === 'harga'
                            ? (g[col.key] ? Number(g[col.key]) : '')
                            : (g[col.key] ?? '')}
                        disabled={isSaved}
                        query={query}
                        onChange={e => onFieldChange(g._id, col.key, e.target.value)}
                    />
                </td>
            ))}

            <td className="td td-aksi">
                <div className="aksi-wrap">
                    {!isSaved ? (
                        <ActionButton
                            label="SIMPAN"
                            onClick={() => onSave(g)}
                            disabled={!canSave}
                            color={canSave ? '#16a34a' : '#9ca3af'}
                        />
                    ) : (
                        <button
                            className="btn-delete"
                            onClick={() => onDelete(g)}
                            title="Hapus data"
                        >
                            🗑
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}