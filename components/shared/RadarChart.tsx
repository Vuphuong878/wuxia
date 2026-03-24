import React from 'react';

export interface RadarData {
    label: string;
    value: number;
    base?: number;
    color?: string;
}

interface RadarChartProps {
    data: RadarData[];
    size?: number;
    maxValue?: number;
    className?: string;
}

const ATTRIBUTE_COLORS: Record<string, string> = {
    'Sức mạnh': '#ef4444',
    'Thân pháp': '#22c55e',
    'Thể chất': '#3b82f6',
    'Căn cốt': '#a855f7',
    'Ngộ tính': '#f59e0b',
    'Phúc duyên': '#06b6d4',
    'Tâm tính': '#eab308',
};

export const RadarChart: React.FC<RadarChartProps> = ({
    data,
    size = 280,
    maxValue = 30,
    className = ""
}) => {
    const padding = 50;
    const center = size / 2;
    const radius = (size - padding * 2) / 2;
    const angleStep = (Math.PI * 2) / data.length;

    // Helper to calculate coordinates
    const getPoint = (value: number, index: number, totalRadius: number) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (value / maxValue) * totalRadius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    // Circular background levels
    const levels = 5;
    const backgroundCircles = Array.from({ length: levels }, (_, i) => (radius / levels) * (i + 1));

    // Axis lines and markers
    const axes = data.map((d, idx) => {
        const p = getPoint(maxValue, idx, radius);
        const markerP = getPoint(maxValue, idx, radius + 5);
        const color = d.color || ATTRIBUTE_COLORS[d.label] || '#d4af37';
        return { x: p.x, y: p.y, markerX: markerP.x, markerY: markerP.y, color };
    });

    // Data polygon
    const dataPoints = data.map((d, i) => {
        const p = getPoint(d.value, i, radius);
        return `${p.x},${p.y}`;
    }).join(' ');

    // Base value polygon
    const basePoints = data.some(d => d.base !== undefined) 
        ? data.map((d, i) => {
            const p = getPoint(d.base || d.value, i, radius);
            return `${p.x},${p.y}`;
        }).join(' ')
        : null;

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(212, 175, 55, 0.1)" />
                        <stop offset="100%" stopColor="rgba(212, 175, 55, 0.4)" />
                    </radialGradient>
                </defs>

                {/* Circular Grid Levels */}
                {backgroundCircles.map((r, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={r}
                        fill="none"
                        stroke="rgba(212, 175, 55, 0.15)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis lines */}
                {axes.map((axis, i) => (
                    <g key={i}>
                        <line
                            x1={center}
                            y1={center}
                            x2={axis.x}
                            y2={axis.y}
                            stroke="rgba(212, 175, 55, 0.2)"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                        />
                        {/* Colored Marker at the tip */}
                        <rect
                            x={axis.markerX - 4}
                            y={axis.markerY - 4}
                            width="8"
                            height="8"
                            fill={axis.color}
                            transform={`rotate(${(i * 360 / data.length)}, ${axis.markerX}, ${axis.markerY})`}
                            className="shadow-lg shadow-black/50"
                            style={{ filter: `drop-shadow(0 0 4px ${axis.color}80)` }}
                        />
                    </g>
                ))}

                {/* Base Area */}
                {basePoints && (
                    <polygon
                        points={basePoints}
                        fill="rgba(212, 175, 55, 0.05)"
                        stroke="rgba(212, 175, 55, 0.2)"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                    />
                )}

                {/* Current Data Area */}
                <polygon
                    points={dataPoints}
                    fill="url(#radar-gradient)"
                    stroke="rgba(212, 175, 55, 0.8)"
                    strokeWidth="2"
                    className="drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />

                {/* Data point markers */}
                {data.map((d, i) => {
                    const p = getPoint(d.value, i, radius);
                    const color = d.color || ATTRIBUTE_COLORS[d.label] || '#d4af37';
                    return (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="3.5"
                            fill={color}
                            stroke="white"
                            strokeWidth="1"
                            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                        />
                    );
                })}

                {/* Labels */}
                {data.map((d, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const labelRadius = radius + 30;
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);
                    
                    let textAnchor = "middle";
                    if (Math.cos(angle) > 0.1) textAnchor = "start";
                    else if (Math.cos(angle) < -0.1) textAnchor = "end";

                    return (
                        <g key={i}>
                            <text
                                x={x}
                                y={y - 5}
                                textAnchor={textAnchor}
                                className="fill-wuxia-gold font-serif font-bold text-[12px] tracking-wider"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                            >
                                {d.label.toUpperCase()}
                            </text>
                            <text
                                x={x}
                                y={y + 10}
                                textAnchor={textAnchor}
                                className="fill-gray-400 font-mono text-[11px]"
                            >
                                {d.value} <tspan className="text-[9px] opacity-50">({d.base || d.value})</tspan>
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

