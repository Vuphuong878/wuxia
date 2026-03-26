import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { MapService, MapNode, TransientNode } from '../../../services/mapService';

interface MapGraphProps {
  currentLocation?: string;
  currentX: number;
  currentY: number;
  visitedNodeIds?: string[];
  dynamicNodes?: TransientNode[];
  currentTimeMinutes?: number;
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
  dynamicNodes,
  currentTimeMinutes,
  onNodeClick: externalOnNodeClick
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const controls = useAnimation();

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

  const targetX = - (focalPoint.x * SCALE);
  const targetY = - (focalPoint.y * SCALE);

  useEffect(() => {
    controls.start({
        x: targetX,
        y: targetY,
        transition: { type: "spring", damping: 30, stiffness: 200 }
    });
  }, [focalPoint, controls, targetX, targetY]);

  const handleResetPosition = () => {
    setZoom(1);
    controls.start({
        x: targetX,
        y: targetY,
        transition: { type: "spring", damping: 30, stiffness: 200 }
    });
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.5, 0.3));

  // Revealed Nodes (Currently revealed all for exploration)
  const allNodes = useMemo(() => {
    return MapService.getNodesByProximity(1500, 1500, 5000);
  }, []);

  const { locations, visibleConnections } = useMemo(() => {
    const filteredNodes = allNodes.map(n => ({
      ...n,
      x: n.x * SCALE,
      y: n.y * SCALE,
      isVisited: true,
      isDynamic: false
    }));

    const validDynamicNodes = (dynamicNodes || []).filter(node => {
        const age = (currentTimeMinutes || 0) - node.createdAtMinutes;
        return age <= node.expiresInMinutes;
    }).map(n => ({
        ...n,
        x: n.x * SCALE,
        y: n.y * SCALE,
        isVisited: true,
        isDynamic: true
    }));

    const mergedNodes = [...filteredNodes, ...validDynamicNodes];
    const paths: { from: MapNode, to: MapNode, id: string, isDynamic?: boolean }[] = [];
    const processed = new Set<string>();

    mergedNodes.forEach(loc => {
      if (loc.connections) {
        loc.connections.forEach(targetId => {
          const target = mergedNodes.find(n => n.id === targetId);
          if (target && !processed.has(`${target.id}-${loc.id}`)) {
            processed.add(`${loc.id}-${target.id}`);
            paths.push({ 
              from: { ...loc } as any, 
              to: { ...target } as any, 
              id: `${loc.id}-${target.id}`,
              isDynamic: (loc as any).isDynamic || (target as any).isDynamic
            });
          }
        });
      }
    });

    return { locations: mergedNodes, visibleConnections: paths };
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
        stroke={conn.isDynamic ? "#a0aec0" : "#c5a059"}
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeDasharray={conn.isDynamic ? "4 4" : "none"}
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
        className="w-full h-full relative"
        animate={{ scale: zoom }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{ transformOrigin: 'center center' }}
      >
        <motion.div
          drag
          dragMomentum={false}
          className="relative z-10"
          initial={{ x: 0, y: 0 }}
          animate={controls}
          style={{ 
            width: MAP_SIZE, 
            height: MAP_SIZE, 
            position: 'absolute',
            left: '50%',
            top: '50%'
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
                  fill={isCurrent ? "#c5a059" : ((loc as any).isDynamic ? "transparent" : (loc.type === 'Tông môn' ? "#c5a059" : "#444"))}
                  stroke={isCurrent ? "#fff" : ((loc as any).isDynamic ? "#a0aec0" : "#c5a059")}
                  strokeWidth={isCurrent ? 2 : 1}
                  strokeDasharray={(loc as any).isDynamic && !isCurrent ? "2 2" : "none"}
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
                <h3 className="text-wuxia-gold text-xl font-bold flex items-center gap-2">
                    {selectedNode.name}
                    {(selectedNode as any).isDynamic && <span className="text-[9px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full border border-white/20 font-normal">Tạm thời</span>}
                </h3>
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

      {/* Map Controls */}
      <div className="absolute right-8 bottom-8 z-50 flex flex-col gap-4">
        <button
          onClick={handleResetPosition}
          className="bg-black/80 border border-wuxia-gold/30 hover:border-wuxia-gold text-wuxia-gold w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
          title="Vị trí hiện tại"
        >
          <svg className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v2m0 12v2m8-8h-2M6 12H4" />
          </svg>
        </button>

        <div className="bg-black/80 border border-wuxia-gold/30 rounded-full flex flex-col items-center shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-12 h-12 flex items-center justify-center text-wuxia-gold hover:bg-wuxia-gold/10 transition-colors"
            title="Phóng to"
          >
            <span className="text-2xl leading-none font-light">+</span>
          </button>
          <div className="w-8 h-px bg-wuxia-gold/20"></div>
          <button
            onClick={handleZoomOut}
            className="w-12 h-12 flex items-center justify-center text-wuxia-gold hover:bg-wuxia-gold/10 transition-colors"
            title="Thu nhỏ"
          >
            <span className="text-2xl leading-none font-light">-</span>
          </button>
        </div>
      </div>
    </div>
  );
};
