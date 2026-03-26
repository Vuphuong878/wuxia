import React, { useMemo, useState } from 'react';
import { EnvironmentData, FestivalStructure } from '../../types';

interface Props {
    Environment: EnvironmentData;
    timeFormat?: 'Number' | 'Traditional';
    festivals?: FestivalStructure[];
}

const TopItem: React.FC<{ label: string; value: string | number; highlight?: boolean }> = ({ label, value, highlight }) => (
    <div className="flex flex-col items-center justify-center mx-1 md:mx-4 relative group cursor-default">
        <div className="text-[8px] md:text-[9px] tracking-[0.18em] mb-0.5" style={{ color: 'rgba(243,244,246,0.62)' }}>{label}</div>
        <div className={`whitespace-nowrap text-xs md:text-sm drop-shadow-md transition-transform group-hover:scale-[1.03] ${highlight ? 'text-wuxia-red font-semibold' : 'text-gray-100'}`}>
            {value}
        </div>
    </div>
);

const Divider = () => (
    <div className="h-3 md:h-4 w-px bg-gradient-to-b from-transparent via-wuxia-gold/20 to-transparent mx-0.5 md:mx-1"></div>
);

const parseCanonicalGameTime = (input?: any): { year: number; month: number; day: number; hour: number; minute: number } | null => {
    if (!input) return null;
    
    if (typeof input === 'object' && input !== null && 'Year' in input) {
        return {
            year: Number(input.Year),
            month: Number(input.Month),
            day: Number(input.Day),
            hour: Number(input.Hour),
            minute: Number(input.Minute)
        };
    }

    if (typeof input !== 'string') return null;
    const match = input.trim().match(/^(\d{1,6}):(\d{1,2}):(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);

    if (
        !Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day) ||
        !Number.isFinite(hour) || !Number.isFinite(minute)
    ) {
        return null;
    }
    if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return null;
    }

    return { year, month, day, hour, minute };
};

const mapHourToWuxia = (hour: number): string => {
    if (hour >= 23 || hour < 1) return 'Giờ Tý (23h-1h)';
    if (hour < 3) return 'Giờ Sửu (1h-3h)';
    if (hour < 5) return 'Giờ Dần (3h-5h)';
    if (hour < 7) return 'Giờ Mão (5h-7h)';
    if (hour < 9) return 'Giờ Thìn (7h-9h)';
    if (hour < 11) return 'Giờ Tỵ (9h-11h)';
    if (hour < 13) return 'Giờ Ngọ (11h-13h)';
    if (hour < 15) return 'Giờ Mùi (13h-15h)';
    if (hour < 17) return 'Giờ Thân (15h-17h)';
    if (hour < 19) return 'Giờ Dậu (17h-19h)';
    if (hour < 21) return 'Giờ Tuất (19h-21h)';
    return 'Giờ Hợi (21h-23h)';
};

const mapMinuteToKe = (minute: number): string => {
    if (minute === 30) return 'Chính khắc';
    if (minute < 15) return 'Đầu khắc';
    if (minute < 30) return 'Một khắc';
    if (minute < 45) return 'Hai khắc';
    return 'Ba khắc';
};

const TopBar: React.FC<Props> = ({ Environment, timeFormat, festivals = [] }) => {
    const [mobileRightMode, setMobileRightMode] = useState<'journey' | 'festival'>('journey');
    const parsedTime = parseCanonicalGameTime(Environment) || parseCanonicalGameTime(Environment?.time);
    const month = parsedTime?.month ?? Environment?.Month ?? null;
    const day = parsedTime?.day ?? Environment?.Day ?? null;

    const rawTime = Environment?.time || '';
    
    const numericTime = parsedTime
        ? `${parsedTime.hour.toString().padStart(2, '0')}:${parsedTime.minute.toString().padStart(2, '0')}`
        : (rawTime || 'Không rõ giờ');
    const traditionalTime = parsedTime
        ? `${mapHourToWuxia(parsedTime.hour)} · ${mapMinuteToKe(parsedTime.minute)}`
        : (rawTime || 'Không rõ thời khắc');
    
    const displayTime = timeFormat === 'Number' ? numericTime : traditionalTime;
    const fullDateStr = parsedTime
        ? `Năm ${parsedTime.year} Tháng ${parsedTime.month.toString().padStart(2, '0')} Ngày ${parsedTime.day.toString().padStart(2, '0')} ${displayTime}`
        : displayTime;
    const mobileDateStr = parsedTime
        ? `Năm ${parsedTime.year} Tháng ${parsedTime.month.toString().padStart(2, '0')} Ngày ${parsedTime.day.toString().padStart(2, '0')}`
        : 'Không rõ ngày';
    const mobileClockStr = displayTime;

    // Determine Festival automatically
    const currentFestival = useMemo(() => {
        if (month == null || day == null) return undefined;
        return festivals.find(f => f.month === month && f.day === day);
    }, [festivals, month, day]);

    const festivalDisplay = Environment?.festival?.name?.trim()
        ? Environment.festival.name.trim()
        : (currentFestival ? currentFestival.name : 'Ngày bình thường');
    const weatherDisplay = useMemo(() => {
        const weather = Environment?.weather;
        if (weather && typeof weather === 'object') {
            const type = typeof weather?.type === 'string' ? weather.type.trim() : '';
            const title = typeof (weather as any)?.title === 'string' ? (weather as any).title.trim() : '';
            return type || title || 'Không rõ';
        }
        return 'Không rõ';
    }, [Environment]);
    const mobileRightLabel = mobileRightMode === 'journey' ? 'Hành trình' : 'Lễ hội';
    const mobileRightValue = mobileRightMode === 'journey'
        ? `Ngày ${Environment?.gameDays || 1}`
        : festivalDisplay;
    const locationBadge = useMemo(() => {
        const rawSmall = typeof Environment?.minorLocation === 'string' ? Environment.minorLocation.trim() : '';
        const rawSpecific = typeof Environment?.specificLocation === 'string' ? Environment.specificLocation.trim() : '';
        let normalizedSpecific = rawSpecific;
        if (rawSmall && rawSpecific.startsWith(rawSmall)) {
            const stripped = rawSpecific.slice(rawSmall.length).replace(/^[\s\-—>·/|，,ã€。:：]+/, '').trim();
            if (stripped) normalizedSpecific = stripped;
        }
        const segments = [Environment?.majorLocation, Environment?.mediumLocation, rawSmall, normalizedSpecific]
            .map((part) => (typeof part === 'string' ? part.trim() : ''))
            .filter(Boolean);
        const uniqueSegments = segments.filter((part, idx) => segments.indexOf(part) === idx);
        return uniqueSegments.length > 0 ? uniqueSegments.join(' - ') : 'Vị trí không rõ';
    }, [Environment?.majorLocation, Environment?.mediumLocation, Environment?.minorLocation, Environment?.specificLocation]);
    const mobileLocationBadge = useMemo(() => {
        const rawSmall = typeof Environment?.minorLocation === 'string' ? Environment.minorLocation.trim() : '';
        const rawSpecific = typeof Environment?.specificLocation === 'string' ? Environment.specificLocation.trim() : '';
        let normalizedSpecific = rawSpecific;
        if (rawSmall && rawSpecific.startsWith(rawSmall)) {
            const stripped = rawSpecific.slice(rawSmall.length).replace(/^[\s\-—>·/|，,ã€。:：]+/, '').trim();
            if (stripped) normalizedSpecific = stripped;
        }

        // Mobile only keeps the last 3 location levels: mediumLocation / minorLocation / specificLocation
        const segments = [Environment?.mediumLocation, rawSmall, normalizedSpecific]
            .map((part) => (typeof part === 'string' ? part.trim() : ''))
            .filter(Boolean);
        const uniqueSegments = segments.filter((part, idx) => segments.indexOf(part) === idx);
        return uniqueSegments.length > 0 ? uniqueSegments.join(' - ') : 'Vị trí không rõ';
    }, [Environment?.mediumLocation, Environment?.minorLocation, Environment?.specificLocation]);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="h-12 md:h-[58px] w-full flex items-center justify-center relative overflow-visible z-50 bg-[rgb(var(--c-ink-black))]">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-wuxia-gold/35 to-transparent"></div>
            
            {/* Main Content Flex */}
            <div className="flex items-center justify-between w-full px-4 md:px-20 relative z-10 h-full">
                
                {/* Left Side Information */}
                <div className="flex items-center">
                    <div className="md:hidden">
                        <TopItem label="Thời tiết" value={weatherDisplay} />
                    </div>
                    <div className="hidden md:flex items-center">
                        <TopItem label="Thời tiết" value={weatherDisplay} />
                    </div>
                </div>

                {/* Center Plaque */}
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full flex flex-col items-center justify-start pt-0 z-20">
                    {/* Hanging ropes */}
                    <div className="flex gap-8 md:gap-16 w-full justify-center absolute top-0">
                        <div className="w-[2px] h-7 md:h-8 bg-gradient-to-b from-wuxia-gold/40 to-black"></div>
                        <div className="w-[2px] h-7 md:h-8 bg-gradient-to-b from-wuxia-gold/40 to-black"></div>
                    </div>

                    {/* Plaque body */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFullScreen();
                        }}
                        className="mt-2.5 md:mt-4 bg-[#111] border-2 border-double border-wuxia-gold/50 px-4 md:px-10 py-1.5 md:py-3 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative flex flex-col items-center min-w-[150px] md:min-w-[220px] hover:border-wuxia-gold/60 transition-all duration-200 cursor-pointer"
                    >
                        {/* Corner marks */}
                        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-wuxia-gold/40"></div>
                        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-wuxia-gold/40"></div>
                        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-wuxia-gold/40"></div>
                        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-wuxia-gold/40"></div>

                        {/* Time display */}
                        <div className="hidden md:block font-semibold font-serif text-wuxia-gold tracking-[0.08em] md:tracking-[0.1em]"
                             style={{ textShadow: '0 0 14px rgba(230,200,110,0.35)', fontSize: 'clamp(1rem, 1.2vw, 1.25rem)' }}>
                            {fullDateStr}
                        </div>
                        <div className="md:hidden text-wuxia-gold text-center leading-tight">
                            <div className="text-[9px] tracking-[0.06em]">{mobileDateStr}</div>
                            <div className="font-bold font-mono tracking-[0.12em]" style={{ fontSize: '1rem', lineHeight: 1.3 }}>{mobileClockStr}</div>
                        </div>

                        {/* Location badge */}
                        <div className="absolute -bottom-2.5 md:-bottom-3 bg-wuxia-red text-[8px] md:text-[10px] px-2 md:px-3 py-px rounded border border-wuxia-gold/30 shadow-md flex items-center gap-1 z-30 tracking-wide max-w-[200px] md:max-w-[420px]" style={{ color: 'white' }}>
                            <span className="md:hidden opacity-90 truncate" title={mobileLocationBadge}>{mobileLocationBadge}</span>
                            <span className="hidden md:inline opacity-90 truncate" title={locationBadge}>{locationBadge}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Information */}
                <div className="flex items-center">
                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileRightMode(prev => (prev === 'journey' ? 'festival' : 'journey'))}
                            title="Nhấn để chuyển Hành trình / Lễ hội"
                            className="bg-transparent border-0 p-0 cursor-pointer"
                        >
                            <TopItem
                                label={mobileRightLabel}
                                value={mobileRightValue}
                                highlight={mobileRightMode === 'festival' && !!currentFestival}
                            />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center">
                        <TopItem
                            label="Lễ hội"
                            value={festivalDisplay}
                            highlight={!!currentFestival}
                        />
                        <Divider />
                        <TopItem label="Hành trình" value={`Ngày ${Environment.gameDays || 1}`} />
                        <Divider />
                        <TopItem label="Thế giới" value={Environment.worldTick || 0} />
                    </div>
                </div>

            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-wuxia-gold/50 to-transparent"></div>
        </div>
    );
};

export default TopBar;

