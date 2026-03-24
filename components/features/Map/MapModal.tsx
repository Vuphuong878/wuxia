import React, { useEffect, useMemo, useState } from 'react';
import { WorldDataStructure } from '../../../models/world';
import { EnvironmentData } from '../../../models/environment';
import { Map as IconMap, MapPin as IconMapPin, Building as IconBuilding, ChevronRight as IconChevronRight, Loader as IconLoader, RefreshCw as IconRefresh, Layout as IconLayout, Network as IconNetwork } from 'lucide-react';
import { ImageService, ImageCacheService } from '../../../services/imageService';
import { MapGraph } from './MapGraph';

interface MapModalProps {
    world: WorldDataStructure;
    env: EnvironmentData;
    settings?: any;
    apiConfig?: any;
    onClose: () => void;
    onUpdateWorld: (world: WorldDataStructure) => void;
    workerUrl: string | string[];
}

const normalizedText = (value: any) => {
    if (value === null || value === undefined) return '';
    const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
    return stringValue.trim().replace(/\s+/g, '').toLowerCase();
};

export const MapModal: React.FC<MapModalProps> = ({ world, env, settings, apiConfig, onClose, onUpdateWorld, workerUrl }) => {
    const provinces = Array.isArray(world?.maps) ? world.maps : [];
    const allBuildings = Array.isArray(world?.buildings) ? world.buildings : [];
    
    // Navigation State
    const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(0);
    const [selectedCityIndex, setSelectedCityIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewMode, setViewMode] = useState<'tabs' | 'graph'>('tabs');

    const currentProvince = provinces[selectedProvinceIndex] || null;
    const currentCity = currentProvince?.cities?.[selectedCityIndex] || null;

    // Finding initial location based on environment
    useEffect(() => {
        const major = normalizedText(env?.majorLocation || '');
        const medium = normalizedText(env?.mediumLocation || '');
        
        const pIdx = provinces.findIndex(p => normalizedText(p.name) === major);
        if (pIdx >= 0) {
            setSelectedProvinceIndex(pIdx);
            const cIdx = (provinces[pIdx].cities || []).findIndex((c: any) => normalizedText(c.name) === medium);
            if (cIdx >= 0) setSelectedCityIndex(cIdx);
        }
    }, [env, provinces]);

    const cityBuildings = useMemo(() => {
        if (!currentCity) return [];
        const cityName = normalizedText(currentCity.name);
        
        return allBuildings.filter(b => {
            const aff = b.affiliation || {};
            return normalizedText(aff.mediumLocation || '') === cityName;
        }).slice(0, 9);
    }, [currentCity, allBuildings]);

    // Image Generation Logic - REMOVED AS PER USER REQUEST
    const handleGenerateImage = async () => {
        // Disabled
    };

    // Auto-generate if missing - REMOVED AS PER USER REQUEST
    /* 
    useEffect(() => {
        if (currentCity && !currentCity.image && !isGenerating) {
            handleGenerateImage();
        }
    }, [currentCity?.name, currentCity?.image]);
    */

    if (!world) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-ink-black/95 border border-wuxia-gold/30 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                
                {/* Header */}
                <div className="h-16 md:h-20 shrink-0 border-b border-white/5 bg-black/40 px-6 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 border border-wuxia-gold/30 bg-wuxia-gold/5 rotate-45 flex items-center justify-center group overflow-hidden">
                            <IconMap className="-rotate-45 w-5 h-5 md:w-6 md:h-6 text-wuxia-gold group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-serif font-bold text-wuxia-gold tracking-widest flex items-center gap-2">
                                VÔ TẬN GIANG HỒ ĐỒ
                                <span className="text-[10px] font-sans font-normal text-wuxia-gold/40 border border-wuxia-gold/20 px-1.5 py-0.5 ml-2">WORLD MAP</span>
                            </h3>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                                <span className="flex items-center gap-1.5"><IconMapPin size={10} className="text-wuxia-gold" /> {currentProvince?.name || 'Loading...'}</span>
                                <IconChevronRight size={8} className="opacity-30" />
                                <span className="text-wuxia-gold/60">{currentCity?.name || 'Khám Phá'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex border border-white/10 rounded-lg overflow-hidden mr-2">
                            <button 
                                onClick={() => setViewMode('tabs')}
                                className={`p-2 transition-all ${viewMode === 'tabs' ? 'bg-wuxia-gold/20 text-wuxia-gold' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}
                                title="Giao diện danh sách"
                            >
                                <IconLayout size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('graph')}
                                className={`p-2 transition-all ${viewMode === 'graph' ? 'bg-wuxia-gold/20 text-wuxia-gold' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}
                                title="Bản đồ quan hệ"
                            >
                                <IconNetwork size={18} />
                            </button>
                        </div>
                        {/* Generate button removed as per user request */}
                        {/* <button 
                            onClick={handleGenerateImage}
                            disabled={isGenerating}
                            className={`p-2 border border-white/5 text-wuxia-gold hover:bg-white/5 transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            title="Làm mới hình ảnh"
                        >
                            <IconRefresh size={18} className={isGenerating ? 'animate-spin' : ''} />
                        </button> */}
                        <button 
                            onClick={onClose} 
                            className="p-2 border border-white/5 text-wuxia-gold hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                {viewMode === 'graph' ? (
                    <div className="flex-1 overflow-hidden">
                        <MapGraph maps={provinces} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        
                        {/* Level 1: Province Selection */}
                        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 flex flex-row md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
                            <div className="hidden md:block mb-4 px-2">
                                <span className="text-[10px] font-bold text-wuxia-gold/40 uppercase tracking-widest">Đại Địa</span>
                            </div>
                            {provinces.map((p: any, idx: number) => (
                                <button 
                                    key={idx}
                                    onClick={() => { setSelectedProvinceIndex(idx); setSelectedCityIndex(0); }}
                                    className={`flex-shrink-0 md:w-full px-4 py-3 md:py-4 text-left border transition-all duration-300 ${idx === selectedProvinceIndex ? 'border-wuxia-gold/40 bg-wuxia-gold/5 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                                >
                                    <div className={`text-sm md:text-lg font-serif font-bold ${idx === selectedProvinceIndex ? 'text-wuxia-gold' : 'text-gray-400'}`}>
                                        {p.name || 'Vô danh'}
                                    </div>
                                    <div className="hidden md:block text-[9px] text-gray-500 uppercase tracking-tighter mt-1">3 Thành thị | 27 Kiến trúc</div>
                                </button>
                            ))}
                        </div>

                        {/* Level 2: City List & Selection */}
                        <div className="w-full md:w-80 border-r border-white/5 bg-black/10 flex flex-col overflow-hidden shrink-0">
                            <div className="p-4 md:p-6 border-b border-white/5 bg-white/[0.01]">
                                <h4 className="text-[10px] font-bold text-wuxia-gold/60 uppercase tracking-[0.2em] mb-1">Thành Thị Thuộc {currentProvince?.name}</h4>
                                <p className="text-[9px] text-gray-500 italic opacity-60">Sầm uất náo nhiệt, nhân tài tề tụi</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 no-scrollbar">
                                {(currentProvince?.cities || []).map((city: any, idx: number) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedCityIndex(idx)}
                                        className={`w-full group relative overflow-hidden transition-all duration-500 border ${idx === selectedCityIndex ? 'border-wuxia-gold/30 bg-wuxia-gold/5 h-32' : 'border-white/5 bg-white/[0.02] hover:border-white/20 h-20'}`}
                                    >
                                        {/* City Background Thumbnail */}
                                        {idx === selectedCityIndex && city.image && (
                                            <div className="absolute inset-0 z-0">
                                                <img src={city.image} alt="" className="w-full h-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                            </div>
                                        )}
                                        
                                        <div className="relative z-10 h-full p-4 flex flex-col justify-center">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-base font-serif font-bold ${idx === selectedCityIndex ? 'text-wuxia-gold' : 'text-gray-300'}`}>
                                                    {city.name}
                                                </span>
                                                {city.leader && (
                                                    <span className="text-[9px] text-wuxia-gold/60 border border-wuxia-gold/20 px-1 bg-black/40">
                                                        {city.leader.name}
                                                    </span>
                                                )}
                                            </div>
                                            {idx === selectedCityIndex && (
                                                <p className="text-[10px] text-gray-400 line-clamp-2 mt-2 italic leading-relaxed">
                                                    {city.description}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Level 3: City Details & Buildings */}
                        <div className="flex-1 bg-black/30 overflow-y-auto no-scrollbar relative">
                            {currentCity ? (
                                <div className="p-6 md:p-10 space-y-10 animate-fade-in">
                                    {/* City Showcase */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-wuxia-gold/20 text-wuxia-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border border-wuxia-gold/30 italic">Đại Địa {currentProvince?.name}</span>
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-serif text-wuxia-gold font-bold drop-shadow-sm">{currentCity.name}</h2>
                                            </div>
                                            <div className="h-[2px] w-24 bg-gradient-to-r from-wuxia-gold/40 to-transparent"></div>
                                            <p className="text-gray-300 text-sm md:text-base italic leading-relaxed border-l-2 border-wuxia-gold/10 pl-6 py-2">
                                                "{currentCity.description}"
                                            </p>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/[0.03] border border-white/5 p-4">
                                                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Thành Chủ</span>
                                                    <p className="text-xs text-wuxia-gold font-serif">
                                                        {currentCity.leader?.name || "Ẩn danh"}
                                                    </p>
                                                    {currentCity.leader?.description && (
                                                        <p className="text-[9px] text-gray-500 mt-1 line-clamp-1 italic">
                                                            {currentCity.leader.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="bg-white/[0.03] border border-white/5 p-4">
                                                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Tọa Độ</span>
                                                    <p className="text-xs text-gray-300">Vùng {selectedProvinceIndex + 1}-{selectedCityIndex + 1}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {currentCity.image && (
                                            <div className="relative aspect-[4/3] group overflow-hidden border border-white/10 shadow-2xl">
                                                <img src={currentCity.image} alt={currentCity.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none"></div>
                                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-wuxia-gold rounded-full"></div>
                                                    <span className="text-[10px] text-wuxia-gold font-bold uppercase tracking-widest">Minh Họa AI</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Building Grid */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-xs font-bold text-wuxia-gold uppercase tracking-[0.3em]">Cửu Đại Kiến Trúc</h4>
                                            <div className="flex-1 h-[1px] bg-white/5"></div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {cityBuildings.map((b: any, idx: number) => (
                                                <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.05] hover:border-wuxia-gold/20 transition-all group">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-serif text-wuxia-gold/40 italic">#0{idx + 1}</span>
                                                            {b.type && (
                                                                <span className="text-[9px] bg-wuxia-gold/10 text-wuxia-gold/70 px-1.5 py-0.5 border border-wuxia-gold/10 uppercase tracking-tighter font-bold">
                                                                    {b.type}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="w-4 h-4 rounded-full border border-wuxia-gold/20 flex items-center justify-center">
                                                            <div className="w-1 h-1 bg-wuxia-gold group-hover:scale-150 transition-transform"></div>
                                                        </div>
                                                    </div>
                                                    <h5 className="text-sm font-serif font-bold text-gray-200 mb-2 group-hover:text-wuxia-gold transition-colors">{b.name}</h5>
                                                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed italic">{b.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                                    <svg className="w-20 h-20 text-wuxia-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-[0.5em] text-wuxia-gold">Chọn Thành Thị Để Khám Phá</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="h-10 md:h-12 shrink-0 bg-black/60 border-t border-white/5 px-6 flex items-center justify-between text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-wuxia-gold shadow-[0_0_5px_rgba(212,175,55,0.8)]"></div>
                            <span>Giang Hồ Vạn Lý</span>
                        </div>
                        <span className="hidden md:inline opacity-30">|</span>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-wuxia-gold/60">{provinces.length} Đại Địa</span>
                            <span className="opacity-30">/</span>
                            <span>9 Thành Thị</span>
                            <span className="opacity-30">/</span>
                            <span>81 Kiến Trúc</span>
                        </div>
                    </div>
                    <div className="text-wuxia-cyan/40">
                        Thiên Long Khí Vận - Nhất Niệm Càn Khôn
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapModal;



