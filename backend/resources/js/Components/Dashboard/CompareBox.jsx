import React from 'react';
import GrowthBadge from './GrowthBadge';

export default function CompareBox({ label, val, oldVal, growth, bg, color }) {
    return (
        <div className="compare-box" style={{ background: bg }}>
            <div className="compare-label">{label}</div>
            <div className="compare-val" style={{ color: color }}>{val}</div>
            <div className="compare-period">
                vs {oldVal} lalu &nbsp; <GrowthBadge value={growth} />
            </div>
        </div>
    );
}