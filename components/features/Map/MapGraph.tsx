import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapService, MapNode } from '../../../services/mapService';

interface MapGraphProps {
  onUpdateEnv?: (env: any) => void;
  currentX: number;
  currentY: number;
}

export const MapGraph: React.FC<MapGraphProps> = ({ onUpdateEnv, currentX, currentY }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  // SVG viewBox size
  const SIZE = 1000;

  // Use MapService to get nodes within range
  const locations = useMemo(() => {
    return MapService.getNodesByProximity(currentX, currentY, 80);
  }, [currentX, currentY]);

  const handleNodeClick = (loc: MapNode) => {
    setSelectedNode(loc);
    if (onUpdateEnv) {
      onUpdateEnv((prev: any) => ({
        ...prev,
        majorLocation: loc.biomeName,
        mediumLocation: loc.regionName,
        minorLocation: loc.name,
        specificLocation: loc.name,
        x: loc.x,
        y: loc.y,
        description: loc.description
      }));
    }
  };

  const renderConnections = useMemo(() => {
    const paths: React.JSX.Element[] = [];
    // For now, simpler proximity-based lines within the cluster
    const processed = new Set<string>();

    locations.forEach(loc => {
       // Find neighbors within 30 units to draw "ink strokes"
       locations.forEach(target => {
          if (loc.id !== target.id) {
             const dx = loc.x - target.x;
             const dy = loc.y - target.y;
             const dist = Math.sqrt(dx * dx + dy * dy);
             
             if (dist < 30 && !processed.has(`${target.id}-${loc.id}`)) {
                processed.add(`${loc.id}-${target.id}`);
                paths.push(
                  <motion.path
                    key={`${loc.id}-${target.id}`}
                    d={`M ${loc.x} ${loc.y} L ${target.x} ${target.y}`}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    className="text-wuxia-gold/30"
                  />
                );
             }
          }
       });
    });
    return paths;
  }, [locations]);

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center font-wuxia">
       {/* Background Paper Texture */}
       <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-40"></div>

       {/* Map Overlay Info */}
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

       {/* Main SVG Graph */}
       <svg
         viewBox={`0 0 ${SIZE} ${SIZE}`}
         className="w-full h-full max-w-[90vh] max-h-[90vh] z-10 p-20"
       >
         {/* Definitions for Filters */}
         <defs>
           <filter id="ink-blur">
             <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
           </filter>
           <filter id="glow-gold">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
           </filter>
         </defs>

         {/* Connections Layer */}
         <g>{renderConnections}</g>

         {/* Nodes Layer */}
         {locations.map((loc) => (
           <motion.g
             key={loc.id}
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: Math.random() * 0.5 }}
             className="cursor-pointer group"
             onClick={() => handleNodeClick(loc)}
             onMouseEnter={() => setHoveredNode(loc.id)}
             onMouseLeave={() => setHoveredNode(null)}
           >
             {/* Ink Drop effect */}
             <circle
               cx={loc.x}
               cy={loc.y}
               r={hoveredNode === loc.id ? 25 : 18}
               className="fill-wuxia-gold/5 stroke-wuxia-gold/20 transition-all duration-300"
               strokeWidth="1"
             />
             
             {/* Core Node */}
             <circle
               cx={loc.x}
               cy={loc.y}
               r="8"
               className={`transition-colors duration-300 shadow-[0_0_15px_rgba(230,200,110,0.8)] ${
                 loc.x === currentX && loc.y === currentY ? 'fill-white' : 'fill-wuxia-gold group-hover:fill-white'
               }`}
               filter="url(#glow-gold)"
             />

             {/* Label */}
             <text
               x={loc.x}
               y={loc.y + 35}
               textAnchor="middle"
               className={`fill-wuxia-gold/80 text-[14px] font-bold tracking-widest pointer-events-none transition-all duration-300 ${
                 hoveredNode === loc.id || (loc.x === currentX && loc.y === currentY) ? 'fill-white scale-110 opacity-100' : 'opacity-60'
               }`}
               style={{ filter: hoveredNode === loc.id ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none' }}
             >
               {loc.name}
             </text>
             
             {/* Secondary Label (English or description snippet) */}
             {(hoveredNode === loc.id || (loc.x === currentX && loc.y === currentY)) && (
                <text
                  x={loc.x}
                  y={loc.y + 55}
                  textAnchor="middle"
                  className="fill-wuxia-gold-dark/60 text-[8px] uppercase tracking-[0.2em] font-sans"
                >
                  {loc.type}
                </text>
             )}
           </motion.g>
         ))}
       </svg>

       {/* Floating Ink Particles Overlay */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-wuxia-gold/20 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0 
              }}
              animate={{ 
                y: [null, "-100%"],
                opacity: [0, 0.4, 0]
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity,
                delay: Math.random() * 10 
              }}
            />
          ))}
       </div>

       {/* Location Details Panel */}
       <AnimatePresence>
         {(hoveredNode || selectedNode) && (
           <motion.div
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 50 }}
             className="absolute bottom-12 right-12 z-30 w-80 pointer-events-none"
           >
             <div className="bg-black/80 backdrop-blur-xl border border-wuxia-gold/20 p-6 rounded-tr-3xl relative overflow-hidden">
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-wuxia-gold/40 rounded-tr-3xl"></div>
                
                <h2 className="text-2xl text-white font-black tracking-widest mb-1 italic">
                  {(locations.find(l => l.id === hoveredNode) || selectedNode)?.name}
                </h2>
                <div className="text-[10px] text-wuxia-gold uppercase tracking-[0.3em] font-sans mb-4 opacity-70">
                  { (locations.find(l => l.id === hoveredNode) || selectedNode)?.biomeName } / {(locations.find(l => l.id === hoveredNode) || selectedNode)?.type}
                </div>
                <p className="text-white/60 text-sm leading-relaxed font-serif italic border-l border-wuxia-gold/20 pl-4 py-2">
                  {(locations.find(l => l.id === hoveredNode) || selectedNode)?.description}
                </p>

                {/* Status or Extra lore info */}
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                   <div className="text-[9px] text-wuxia-gold/40 tracking-widest uppercase font-bold">Status: {(locations.find(l => l.id === hoveredNode) || selectedNode)?.faction || 'Unknown'}</div>
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-wuxia-gold/40 rounded-full"></div>
                      <div className="w-1 h-1 bg-wuxia-gold/40 rounded-full"></div>
                      <div className="w-1 h-1 bg-wuxia-gold/40 rounded-full"></div>
                   </div>
                </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

export default MapGraph;
