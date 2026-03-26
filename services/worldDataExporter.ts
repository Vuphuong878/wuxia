import { WorldDataStructure, MapStructure, BuildingStructure } from '../models/world';

/**
 * Biome Color Mapping
 * Defines premium colors for each biome in the world_skeleton.json
 */
const BIOME_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    huyet_hai: { bg: 'rgba(153, 27, 27, 0.45)', text: '#fca5a5', border: 'rgba(239, 68, 68, 0.6)', glow: 'rgba(239, 68, 68, 0.3)' }, // Deep Crimson
    trung_nguyen: { bg: 'rgba(22, 101, 52, 0.45)', text: '#bbf7d0', border: 'rgba(74, 222, 128, 0.55)', glow: 'rgba(74, 222, 128, 0.3)' }, // Jade Green
    bac_dao: { bg: 'rgba(30, 58, 138, 0.4)', text: '#bfdbfe', border: 'rgba(96, 165, 250, 0.5)', glow: 'rgba(96, 165, 250, 0.25)' }, // Ice Blue
    tay_vuc: { bg: 'rgba(120, 80, 10, 0.45)', text: '#fde68a', border: 'rgba(251, 191, 36, 0.6)', glow: 'rgba(251, 191, 36, 0.3)' }, // Desert Gold
    nam_cuong: { bg: 'rgba(147, 51, 234, 0.35)', text: '#e9d5ff', border: 'rgba(168, 85, 247, 0.5)', glow: 'rgba(168, 85, 247, 0.25)' }, // Purple Mystic
    dong_hai: { bg: 'rgba(14, 116, 144, 0.4)', text: '#a5f3fc', border: 'rgba(34, 211, 238, 0.5)', glow: 'rgba(34, 211, 238, 0.25)' }, // Ocean Cyan
    than_son: { bg: 'rgba(250, 250, 250, 0.2)', text: '#ffffff', border: 'rgba(255, 255, 255, 0.6)', glow: 'rgba(255, 255, 255, 0.4)' }, // Ethereal White
    minh_gioi: { bg: 'rgba(31, 41, 55, 0.6)', text: '#d1d5db', border: 'rgba(75, 85, 99, 0.6)', glow: 'rgba(107, 114, 128, 0.3)' }, // Dark Grey
    co_di_tich: { bg: 'rgba(77, 124, 15, 0.45)', text: '#d9f99d', border: 'rgba(132, 204, 22, 0.6)', glow: 'rgba(132, 204, 22, 0.3)' }, // Ancient Olive
    hon_don: { bg: 'rgba(88, 28, 135, 0.5)', text: '#e9d5ff', border: 'rgba(139, 92, 246, 0.7)', glow: 'rgba(147, 51, 234, 0.4)' }, // Chaos Indigo
};

export class WorldDataExporter {
    static transformSkeleton(skeletonJson: any): WorldDataStructure {
        if (!skeletonJson || !skeletonJson.world_skeleton) {
            console.error('Invalid skeleton JSON format');
            return { activeNpcList: [], maps: [], buildings: [], ongoingEvents: [], settledEvents: [], worldHistory: [] };
        }

        const biomes = skeletonJson.world_skeleton.level_1_biomes || [];
        const maps: MapStructure[] = [];
        const allBuildings: BuildingStructure[] = [];

        biomes.forEach((biome: any) => {
            const biomeColors = BIOME_COLORS[biome.id] || BIOME_COLORS.trung_nguyen;
            const regions = biome.level_2_regions || [];
            
            regions.forEach((region: any, rIdx: number) => {
                const regionMap: MapStructure = {
                    id: region.id || `region-${rIdx}`,
                    name: region.name,
                    description: region.description || `${region.name} thuộc ${biome.name}`,
                    coordinate: region.coordinate || `${rIdx}, 0`,
                    affiliation: {
                        majorLocation: biome.name,
                        mediumLocation: region.name,
                        minorLocation: ''
                    },
                    internalBuildings: [],
                    cities: [] 
                };

                // Add visual meta for the map component
                (regionMap as any).visuals = biomeColors;

                (region.level_3_nodes || []).forEach((node: any) => {
                    const building: BuildingStructure = {
                        name: node.name,
                        description: node.description || '',
                        type: node.type || 'Kiến trúc',
                        affiliation: {
                            majorLocation: biome.name,
                            mediumLocation: region.name,
                            minorLocation: node.name
                        }
                    };

                    // Add faction data if present
                    if (node.faction) {
                        (building as any).faction = node.faction;
                    }

                    allBuildings.push(building);
                    regionMap.internalBuildings.push(building);
                    regionMap.cities?.push({
                        id: node.id,
                        name: node.name,
                        type: node.type,
                        faction: node.faction,
                        description: node.description
                    });
                });

                maps.push(regionMap);
            });
        });

        return {
            maps,
            buildings: allBuildings,
            activeNpcList: [],
            ongoingEvents: [],
            settledEvents: [],
            worldHistory: []
        };
    }

    /**
     * Creates a compact version of the world structure for AI prompts
     */
    static getCompactWorldStructure(skeleton: any): string {
        if (!skeleton?.world_skeleton?.level_1_biomes) return "No world data available.";

        let output = "";
        skeleton.world_skeleton.level_1_biomes.forEach((biome: any) => {
            output += `\n- Biome: ${biome.name} (${biome.id})\n`;
            (biome.level_2_regions || []).forEach((region: any) => {
                output += `  - Region: ${region.name} (${region.id})\n`;
                const nodes = (region.level_3_nodes || []).map((n: any) => 
                    `${n.name} [Type: ${n.type}, Faction: ${n.faction || 'None'}]`
                );
                output += `    - Nodes: ${nodes.join('; ')}\n`;
            });
        });

        return output;
    }

    /**
     * Returns ONLY biome level information with available node types for starting location selection
     */
    static getBiomeOnlyStructure(skeleton: any): string {
        if (!skeleton?.world_skeleton?.level_1_biomes) return "No world data available.";

        let output = "DANH SÁCH CÁC VÙNG ĐẤT LỚN (BIOMES) & LOẠI ĐỊA ĐIỂM:\n";
        skeleton.world_skeleton.level_1_biomes.forEach((biome: any) => {
            const types = new Set<string>();
            (biome.level_2_regions || []).forEach((region: any) => {
                (region.level_3_nodes || []).forEach((node: any) => {
                    if (node.type) types.add(node.type);
                });
            });
            
            output += `- ${biome.name} (ID: ${biome.id}): ${biome.description || 'Vùng đất huyền bí'}\n`;
            output += `  * Loại địa điểm có sẵn: ${Array.from(types).join(', ') || 'Chưa xác định'}\n`;
        });

        return output;
    }

    /**
     * Creates a highly compact summary of biomes, regions, and node types for general story context
     */
    static getStoryContextSummary(skeleton: any): string {
        if (!skeleton?.world_skeleton?.level_1_biomes) return "Dữ liệu thế giới hiện không khả dụng.";

        let output = "【TÓM TẮT THẾ GIỚI VÕ HIỆP】\n";
        skeleton.world_skeleton.level_1_biomes.forEach((biome: any) => {
            output += `\nVÙNG LỚN: ${biome.name}\n`;
            const regions = biome.level_2_regions || [];
            regions.forEach((region: any) => {
                const types = new Set<string>();
                (region.level_3_nodes || []).forEach((node: any) => {
                    if (node.type) types.add(node.type);
                });
                output += `  - Khu vực: ${region.name} | Loại địa điểm: ${Array.from(types).join(', ')}\n`;
            });
        });

        output += "\n(Lưu ý: Hệ thống sẽ tự động điều phối nhân vật đến một địa điểm cụ thể dựa trên Vùng và Loại địa điểm mà bạn đề cập)";
        return output;
    }
}
