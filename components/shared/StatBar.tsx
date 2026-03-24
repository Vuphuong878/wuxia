import React from 'react';

interface StatBarProps {
    label: string;
    value: number;
    max?: number;
    color?: string;
    baseValue?: number;
    className?: string;
    onIncrease?: () => void;
    onDecrease?: () => void;
    disabledIncrease?: boolean;
    disabledDecrease?: boolean;
    showControls?: boolean;
    icon?: React.ReactNode;
}

export const StatBar: React.FC<StatBarProps> = ({
    label,
    value,
    max = 20,
    color = '#d4af37',
    baseValue,
    className = "",
    onIncrease,
    onDecrease,
    disabledIncrease = false,
    disabledDecrease = false,
    showControls = false,
    icon
}) => {
    const segments = Array.from({ length: max }, (_, i) => i + 1);

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-serif font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1.5">
                    {icon && <span className="text-wuxia-gold/60">{icon}</span>}
                    {label}
                </span>
                <div className="flex items-center gap-3">
                    {showControls && (
                        <div className="flex items-center gap-2 mr-2">
                            <button
                                onClick={onDecrease}
                                disabled={disabledDecrease}
                                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                    disabledDecrease 
                                    ? 'border-white/5 text-white/10 cursor-not-allowed' 
                                    : 'border-wuxia-gold/30 text-wuxia-gold hover:bg-wuxia-gold/10 hover:border-wuxia-gold'
                                }`}
                            >
                                <span className="text-xs leading-none">-</span>
                            </button>
                            <button
                                onClick={onIncrease}
                                disabled={disabledIncrease}
                                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                    disabledIncrease 
                                    ? 'border-white/5 text-white/10 cursor-not-allowed' 
                                    : 'border-wuxia-gold/30 text-wuxia-gold hover:bg-wuxia-gold/10 hover:border-wuxia-gold'
                                }`}
                            >
                                <span className="text-xs leading-none">+</span>
                            </button>
                        </div>
                    )}
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-mono font-bold text-white shadow-sm">
                            {value}
                        </span>
                        {baseValue !== undefined && baseValue !== value && (
                            <span className="text-[9px] font-mono text-gray-500">
                                ({baseValue})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-0.5 h-2.5 w-full bg-black/40 p-0.5 rounded-sm border border-white/5 shadow-inner">
                {segments.map((s) => {
                    const isFilled = s <= value;
                    const isBase = baseValue !== undefined && s <= baseValue;
                    
                    return (
                        <div
                            key={s}
                            className={`flex-1 rounded-[1px] transition-all duration-500 ease-out ${
                                isFilled 
                                    ? 'shadow-[0_0_8px_var(--bar-color)]' 
                                    : 'bg-white/5'
                            }`}
                            style={{ 
                                backgroundColor: isFilled ? color : undefined,
                                opacity: isFilled ? 1 : (isBase ? 0.3 : 1),
                                border: isBase && !isFilled ? `1px solid ${color}40` : 'none',
                                '--bar-color': color
                            } as React.CSSProperties}
                        />
                    );
                })}
            </div>
        </div>
    );
};
