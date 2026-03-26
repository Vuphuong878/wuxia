import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapService, MapNode } from '../../../services/mapService';

interface MapGraphProps {
  currentLocation?: string;
  currentX: number;
  currentY: number;
  visitedNodeIds?: string[];
  onNodeClick?: (node: MapNode) => void;
}

const WORLD_SIZE = 3000;
const SCALE = 3;
const MAP_SIZE = WORLD_SIZE * SCALE;

export const MapGraph: React.FC<MapGraphProps> = ({ 
  currentLocation,
  currentX, 
  currentY, 
  visitedNodeIds,
  onNodeClick: externalOnNodeClick
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize Map Focal Point with Player's actual position
  const focalPoint = useMemo(() => {
    if (currentLocation) {
        const node = MapService.findNodeByName(currentLocation);
        if (node) return { x: node.x, y: node.y };
    }
    
    if (!isNaN(currentX) && !isNaN(currentY)) {
        const mult = currentX < 1100 ? 3 : 1; 
        return { x: currentX * mult, y: currentY * mult };
    }
    return { x: 1500, y: 1500 };
  }, [currentLocation, currentX, currentY]);

  // Revealed Nodes (Currently revealed all for exploration)
  const allNodes = useMemo(() => {
    return MapService.getNodesByProximity(1500, 1500, 5000);
  }, []);

  const { locations, visibleConnections } = useMemo(() => {
    const filteredNodes = allNodes.map(n => ({
      ...n,
      x: n.x * SCALE,
      y: n.y * SCALE,
      isVisited: true
    }));

    const paths: { from: MapNode, to: MapNode, id: string }[] = [];
    const processed = new Set<string>();

    filteredNodes.forEach(loc => {
      if (loc.connections) {
        loc.connections.forEach(targetId => {
          const target = allNodes.find(n => n.id === targetId);
          if (target && !processed.has(`${target.id}-${loc.id}`)) {
            processed.add(`${loc.id}-${target.id}`);
            paths.push({ 
              from: { ...loc } as any, 
              to: { ...target, x: target.x * SCALE, y: target.y * SCALE } as any, 
              id: `${loc.id}-${target.id}` 
            });
          }
        });
      }
    });

    return { locations: filteredNodes, visibleConnections: paths };
  }, [allNodes]);

  const handleNodeClick = (loc: MapNode) => {
    setSelectedNode(loc);
    if (externalOnNodeClick) externalOnNodeClick(loc);
  };

  const renderConnections = useMemo(() => {
    return visibleConnections.map(conn => (
      <motion.path
        key={conn.id}
        d={`M ${conn.from.x} ${conn.from.y} L ${conn.to.x} ${conn.to.y}`}
        stroke="#c5a059"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
      />
    ));
  }, [visibleConnections]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center font-wuxia cursor-grab active:cursor-grabbing"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
      
      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-l-2 border-wuxia-gold/50 pl-6"
        >
          <h1 className="text-5xl text-white font-black tracking-widest uppercase mb-2">Thần Cơ Đồ</h1>
          <p className="text-wuxia-gold/60 text-sm tracking-[0.3em] font-sans">INK-WASH STRATEGIC MAP</p>
        </motion.div>
      </div>

      <motion.div
        drag
        dragMomentum={false}
        className="relative z-10"
        initial={{
          x: 0,
          y: 0
        }}
        animate={{
          x: - (focalPoint.x * SCALE) + (containerRef.current ? containerRef.current.clientWidth / 2 : 0),
          y: - (focalPoint.y * SCALE) + (containerRef.current ? containerRef.current.clientHeight / 2 : 0)
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{ 
          width: MAP_SIZE, 
          height: MAP_SIZE, 
          position: 'absolute',
          left: 0,
          top: 0
        }}
      >
        <svg
          viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
          width={MAP_SIZE}
          height={MAP_SIZE}
          className="overflow-visible"
        >
          <defs>
            <filter id="glow-gold">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g>{renderConnections}</g>

          {locations.map((loc) => {
            const isHovered = hoveredNode === loc.id;
            const isCurrent = currentLocation === loc.name;
            
            return (
              <motion.g
                key={loc.id}
                onMouseEnter={() => setHoveredNode(loc.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(loc)}
                className="cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={isHovered || isCurrent ? 8 : 4}
                  fill={isCurrent ? "#c5a059" : (loc.type === 'Tông môn' ? "#c5a059" : "#444")}
                  stroke={isCurrent ? "#fff" : "#c5a059"}
                  strokeWidth={isCurrent ? 2 : 1}
                  className="transition-all duration-300"
                  filter={isCurrent ? "url(#glow-gold)" : ""}
                />

                {isCurrent && (
                  <motion.circle
                    cx={loc.x}
                    cy={loc.y}
                    r={8}
                    stroke="#c5a059"
                    strokeWidth={2}
                    fill="none"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {(isHovered || isCurrent || loc.type === 'Tông môn') && (
                  <motion.text
                    x={loc.x}
                    y={loc.y - 15}
                    textAnchor="middle"
                    fill={isCurrent ? "#fff" : "#c5a059"}
                    className="text-[12px] font-bold pointer-events-none select-none"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {loc.name}
                  </motion.text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 w-80 bg-black/90 border border-wuxia-gold/40 p-6 backdrop-blur-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-wuxia-gold text-xl font-bold">{selectedNode.name}</h3>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">{selectedNode.type} • {selectedNode.faction}</p>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-white/40 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 font-sans">
              {selectedNode.description}
            </p>
            {/* Travel button Removed per USER request */}
            <div className="text-[10px] text-wuxia-gold/50 uppercase tracking-[0.2em] italic">
              Strategic View • Coordinates tracked automatically
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
