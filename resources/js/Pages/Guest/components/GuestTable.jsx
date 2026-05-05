import { useRef, memo, useCallback, useEffect } from 'react';
import { useVirtualizer }                        from '@tanstack/react-virtual';
import SeparatorRow                              from './SeparatorRow';
import ExpenseRow                                from './ExpenseRow';
import GuestRow                                  from './GuestRow';
import { GUEST_HEAD_COLS, GUEST_TAIL_COLS, EXPENSE_COLS } from '../../../Constants/columns';

const ROW_HEIGHT       = 48;
const SEPARATOR_HEIGHT = 42;

const MemoGuestRow   = memo(GuestRow);
const MemoExpenseRow = memo(ExpenseRow);
const MemoSeparator  = memo(SeparatorRow);

const TableHead = memo(function TableHead({ tab }) {
    return (
        <thead>
            <tr>
                {tab === 'expense' ? (
                    <>
                        <th className="th" style={{ textAlign: 'center', width: 50 }}>No</th>
                        {EXPENSE_COLS.map(c => (
                            <th key={c.key} className="th" style={{ width: c.w }}>{c.label}</th>
                        ))}
                        <th className="th" style={{ textAlign: 'center', width: 100 }}>Aksi</th>
                    </>
                ) : (
                    <>
                        {GUEST_HEAD_COLS.map(c => (
                            <th key={c.key} className="th" style={{ width: c.w }}>{c.label}</th>
                        ))}
                        {tab === 'reguler' ? (
                            <th className="th" style={{ width: 130 }}>Harga</th>
                        ) : (
                            <>
                                <th className="th" style={{ width: 120 }}>Platform</th>
                                <th className="th" style={{ width: 100 }}>Prepaid</th>
                                <th className="th" style={{ width: 100 }}>PAH</th>
                                
                            </>
                        )}
                        {GUEST_TAIL_COLS.map(c => (
                            <th key={c.key} className="th" style={{ width: c.w }}>{c.label}</th>
                        ))}
                        <th className="th" style={{ textAlign: 'center', width: 100 }}>Aksi</th>
                    </>
                )}
            </tr>
        </thead>
    );
});

export default function GuestTable({ tab, displayedRows, getVal, onEdit, onNewRowChange, onBlur, onSave, onToggleStatus, onDelete, query }) {
    const scrollRef    = useRef(null);
    const prevCountRef = useRef(displayedRows.length);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [tab]);

    useEffect(() => {
        const prev    = prevCountRef.current;
        const current = displayedRows.length;
        if (current > prev && scrollRef.current) {
            requestAnimationFrame(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            });
        }
        prevCountRef.current = current;
    }, [displayedRows.length]);

    const estimateSize = useCallback(
        (i) => displayedRows[i]?.isSeparator ? SEPARATOR_HEIGHT : ROW_HEIGHT,
        [displayedRows]
    );

    const virtualizer = useVirtualizer({
        count:            displayedRows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize,
        overscan:         10,
    });

    const items       = virtualizer.getVirtualItems();
    const totalHeight = virtualizer.getTotalSize();
    const paddingTop  = items.length > 0 ? items[0].start : 0;
    const paddingBot  = items.length > 0 ? totalHeight - items[items.length - 1].end : 0;

    return (
        <div className="tbl-wrap" ref={scrollRef}>
            <table className="tbl">
                <TableHead tab={tab} />
                <tbody>
                    {paddingTop > 0 && (
                        <tr><td colSpan={100} style={{ height: paddingTop, padding: 0, border: 'none' }} /></tr>
                    )}

                    {items.map((vItem) => {
                        const g = displayedRows[vItem.index];

                        if (g.isSeparator) {
                            return <MemoSeparator key={`sep-${vItem.index}`} row={g} tab={tab} />;
                        }
                        if (tab === 'expense') {
                            return (
                                <MemoExpenseRow
                                    key={g.id || g._id}
                                    g={g}
                                    onFieldChange={onNewRowChange}
                                    onSave={onSave}
                                    onDelete={onDelete}
                                    query={query}
                                />
                            );
                        }
                        return (
                            <MemoGuestRow
                                key={g.id || g._id}
                                g={g}
                                tab={tab}
                                getVal={getVal}
                                onEdit={onEdit}
                                onNewRowChange={onNewRowChange}
                                onBlur={onBlur}
                                onSave={onSave}
                                onToggleStatus={onToggleStatus}
                                onDelete={onDelete}
                                query={query}
                            />
                        );
                    })}

                    {paddingBot > 0 && (
                        <tr><td colSpan={100} style={{ height: paddingBot, padding: 0, border: 'none' }} /></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}