import React from 'react';

export default function GrowthBadge({ value }) {
    const isUp = value >= 0;
    return (
        <span style={{ 
            color: isUp ? '#188038' : '#d93025', 
            fontWeight: 'bold', fontSize: 11 
        }}>
            {isUp ? '▲' : '▼'} {Math.abs(value)}%
        </span>
    );
}