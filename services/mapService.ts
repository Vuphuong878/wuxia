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
    regionId: string;
    biomeId: string;
    faction?: string;
    possibleOrigins: string[];
    typicalPersonalities: string[];
    connections: string[];
}

export const MapService = {
    /**
     * Get nodes near a specific coordinate
     */
    getNodesByProximity(currentX: number, currentY: number, radius: number = 100): MapNode[] {
        const nodes: MapNode[] = [];
        if (isNaN(currentX) || isNaN(currentY)) {
            currentX = 500;
            currentY = 500;
        }

        const skeletonData = (FULL_WORLD_SKELETON as any);
        const lookups = skeletonData?.lookups;
        const data = skeletonData?.world_skeleton;
        
        console.log(`[MapService] Querying nodes at (${currentX}, ${currentY}) with radius ${radius}`);

        if (!data || !data.level_1_biomes) {
            console.error("[MapService] Skeleton data is invalid or missing 'level_1_biomes'. Check src/data/world_skeleton.json");
            return [];
        }

        data.level_1_biomes.forEach((biome: any) => {
            biome.level_2_regions.forEach((region: any) => {
                region.level_3_nodes.forEach((node: any) => {
                    const dx = (node.x || 0) - currentX;
                    const dy = (node.y || 0) - currentY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist <= radius) {
                        nodes.push(this.resolveNode(node, region, biome, lookups));
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
        const skeletonData = (FULL_WORLD_SKELETON as any);
        const lookups = skeletonData.lookups;
        const data = skeletonData.world_skeleton;

        if (!data || !data.level_1_biomes) return [];

        data.level_1_biomes.forEach((biome: any) => {
            biome.level_2_regions.forEach((region: any) => {
                if (region.name === regionName) {
                    region.level_3_nodes.forEach((node: any) => {
                        nodes.push(this.resolveNode(node, region, biome, lookups));
                    });
                }
            });
        });

        return nodes;
    },

    /**
     * Find a node by its name
     */
    findNodeByName(name: string): MapNode | null {
        const skeletonData = (FULL_WORLD_SKELETON as any);
        const lookups = skeletonData.lookups;
        const data = skeletonData.world_skeleton;

        if (!data || !data.level_1_biomes) return null;

        for (const biome of data.level_1_biomes) {
            for (const region of biome.level_2_regions) {
                for (const node of region.level_3_nodes) {
                    if (node.name === name) {
                        return this.resolveNode(node, region, biome, lookups);
                    }
                }
            }
        }
        return null;
    },

  /**
     * Get all nodes in the skeleton
     */
    getAllNodes(): MapNode[] {
        const nodes: MapNode[] = [];
        const skeletonData = (FULL_WORLD_SKELETON as any);
        const lookups = skeletonData.lookups;
        const data = skeletonData.world_skeleton;

        if (!data || !data.level_1_biomes) return [];

        data.level_1_biomes.forEach((biome: any) => {
            biome.level_2_regions.forEach((region: any) => {
                region.level_3_nodes.forEach((node: any) => {
                    nodes.push(this.resolveNode(node, region, biome, lookups));
                });
            });
        });

        return nodes;
    },

    /**
     * Helper to resolve a flat MapNode from skeleton data
     */
    resolveNode(node: any, region: any, biome: any, lookups: any): MapNode {
        const faction = node.faction;
        const alignment = lookups?.factionAlignment?.[faction] || 'trung_lap';
        
        // Resolve personalities from alignment
        const typicalPersonalities = lookups?.personalitiesByAlignment?.[alignment] || [];
        
        // Resolve origins from type and biome
        const typeOrigins = lookups?.originsByType?.[node.type] || [];
        const biomeOrigins = biome.uniqueOrigins || [];
        const possibleOrigins = [...new Set([...typeOrigins, ...biomeOrigins])];

        return {
            id: node.id,
            name: node.name,
            type: node.type,
            x: node.x || 0,
            y: node.y || 0,
            description: node.description,
            regionName: region.name,
            biomeName: biome.name,
            biomeId: biome.id,
            regionId: region.id,
            faction: node.faction,
            possibleOrigins,
            typicalPersonalities,
            connections: node.connections || []
        };
    }
};
