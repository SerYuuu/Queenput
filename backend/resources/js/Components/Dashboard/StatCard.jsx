import React from 'react';

export default function StatCard({ label, value, sub, icon, color, bg }) {
    return (
        <div className="card">
            <div className="card-top">
                <div className="card-label">{label}</div>
                <div className="card-icon" style={{ background: bg, fontSize: 18 }}>{icon}</div>
            </div>
            <div className="card-value" style={{ color: color }}>{value}</div>
            <div className="card-sub">{sub}</div>
        </div>
    );
}