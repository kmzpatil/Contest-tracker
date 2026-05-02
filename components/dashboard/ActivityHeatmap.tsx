'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ActivityHeatmap() {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  // Generate random activity levels for 52 weeks x 7 days
  const weeks = Array.from({ length: 52 }, () => 
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
  );

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-white/[0.03]';
      case 1: return 'bg-accent-cyan/10';
      case 2: return 'bg-accent-cyan/30';
      case 3: return 'bg-accent-cyan/60 shadow-[0_0_12px_rgba(0,245,255,0.2)]';
      case 4: return 'bg-accent-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]';
      default: return 'bg-white/[0.03]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6 rounded-2xl border-white/5 relative group overflow-hidden hud-corners"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-white tracking-[0.4em] uppercase tech-bracket font-display">ACTIVITY_STREAM</h3>
          <p className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-[0.3em] font-mono">ANNUAL_DETECTION_MATRIX</p>
        </div>
        
        <div className="flex items-center gap-2.5 px-4 py-2 bg-black/40 rounded-xl border border-white/5 shadow-inner">
          <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] font-mono">MIN</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div key={level} className={`w-3 h-3 rounded-[2px] ${getLevelColor(level)} transition-all duration-700`} />
          ))}
          <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] font-mono">MAX</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[800px] flex gap-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1.5 shrink-0">
              {week.map((level, dayIndex) => (
                <motion.div 
                  key={dayIndex}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.3 + (weekIndex * 7 + dayIndex) * 0.002,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.5, zIndex: 10, borderRadius: '4px' }}
                  className={`w-3 h-3 rounded-[1px] ${getLevelColor(level)} transition-all duration-300 cursor-crosshair`}
                  title={`NODE_LOAD_${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6 px-2">
        {months.map(month => (
          <span key={month} className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono hover:text-accent-cyan transition-colors">
            {month}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
