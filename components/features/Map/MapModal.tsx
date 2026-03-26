import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapGraph } from './MapGraph';

interface MapModalProps {
  onClose: () => void;
  onUpdateEnv?: (env: any) => void;
  // standard props from App.tsx (ignoring most for graph style)
  world?: any;
  env?: any;
  apiConfig?: any;
  onUpdateWorld?: any;
  workerUrl?: string;
}

export const MapModal: React.FC<MapModalProps> = ({ onClose, onUpdateEnv, env, world }) => {
  return (
    <AnimatePresence>
       <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-8"
       >
          {/* Decorative Border Layer */}
          <div className="absolute inset-4 border border-wuxia-gold/10 rounded-3xl pointer-events-none opacity-40"></div>
          
          {/* Close Button UI */}
          <div className="absolute top-8 right-8 z-[1001]">
            <button 
              onClick={onClose}
              className="group relative flex items-center gap-4 px-6 py-2 bg-black/40 border border-wuxia-gold/30 rounded-full hover:border-wuxia-gold transition-all duration-300"
            >
              <div className="text-[10px] text-wuxia-gold/60 tracking-[0.4em] uppercase group-hover:text-wuxia-gold transition-colors">Close Map</div>
              <div className="w-8 h-px bg-wuxia-gold/30 group-hover:w-12 transition-all"></div>
              <div className="text-wuxia-gold font-bold text-xl leading-none">×</div>
            </button>
          </div>
 
          {/* Main Map Content Area */}
          <div className="w-full h-full max-w-6xl max-h-[85vh] relative bg-[#0a0a0a] rounded-none md:rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
              <div className="flex-1 relative">
                  <MapGraph 
                    currentLocation={env?.minorLocation || env?.specificLocation || ''}
                    currentX={env?.x ?? 500}
                    currentY={env?.y ?? 500}
                    visitedNodeIds={world?.visitedNodeIds}
                  />
              </div>

              {/* Bottom Legend/Instructions */}
              <div className="h-16 bg-black/80 border-t border-white/5 flex items-center justify-between px-8 z-20">
                  <div className="flex gap-8 items-center">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-wuxia-gold shadow-[0_0_8px_rgba(230,200,110,0.8)]"></div>
                          <span className="text-[10px] text-wuxia-gold/60 uppercase tracking-widest font-bold">Kinh Thành / Sect</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-wuxia-gold/30"></div>
                          <span className="text-[10px] text-wuxia-gold/60 uppercase tracking-widest font-bold">Vùng Đất / Landmark</span>
                      </div>
                  </div>
                  <div className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-sans">
                      Select a node to travel or view details
                  </div>
              </div>
          </div>
       </motion.div>
    </AnimatePresence>
  );
};

export default MapModal;
