import { FULL_WORLD_SKELETON } from '../data/worldData';

export interface MapNode {
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;
    description: string;
    regionName: string;
    biomeName: string;
    faction?: string;
    possibleOrigins: string[];
    typicalPersonalities: string[];
}

export const MapService = {
    /**
     * Get nodes near a specific coordinate
     */
    getNodesByProximity(currentX: number, currentY: number, radius: number = 100): MapNode[] {
        const nodes: MapNode[] = [];
        const data = (FULL_WORLD_SKELETON as any).world_skeleton;

        if (!data || !data.level_1_biomes) return [];

        data.level_1_biomes.forEach((biome: any) => {
            biome.level_2_regions.forEach((region: any) => {
                region.level_3_nodes.forEach((node: any) => {
                    const dx = (node.x || 0) - currentX;
                    const dy = (node.y || 0) - currentY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist <= radius) {
                        nodes.push({
                            id: node.id,
                            name: node.name,
                            type: node.type,
                            x: node.x || 0,
                            y: node.y || 0,
                            description: node.description,
                            regionName: region.name,
                            biomeName: biome.name,
                            faction: node.faction,
                            possibleOrigins: node.possibleOrigins || [],
                            typicalPersonalities: node.typicalPersonalities || []
                        });
                    }
                });
            });
        });

        return nodes;
    },

    /**
     * Get all nodes in a specific region
     */
    getNodesByRegion(regionName: string): MapNode[] {
        const nodes: MapNode[] = [];
        const data = (FULL_WORLD_SKELETON as any).world_skeleton;

        if (!data || !data.level_1_biomes) return [];

        data.level_1_biomes.forEach((biome: any) => {
            biome.level_2_regions.forEach((region: any) => {
                if (region.name === regionName) {
                    region.level_3_nodes.forEach((node: any) => {
                        nodes.push({
                            id: node.id,
                            name: node.name,
                            type: node.type,
                            x: node.x || 0,
                            y: node.y || 0,
                            description: node.description,
                            regionName: region.name,
                            biomeName: biome.name,
                            faction: node.faction,
                            possibleOrigins: node.possibleOrigins || [],
                            typicalPersonalities: node.typicalPersonalities || []
                        });
                    });
                }
            });
        });

        return nodes;
    }
};
