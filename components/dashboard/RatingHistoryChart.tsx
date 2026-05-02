'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

export function RatingHistoryChart() {
  // Mock data for rating history
  const cfData = [1200, 1250, 1230, 1300, 1450, 1400, 1550, 1600, 1580, 1720];
  const lcData = [1000, 1050, 1100, 1080, 1150, 1200, 1180, 1250, 1300, 1350];
  
  const width = 800;
  const height = 200;
  const padding = 40;
  
  const getPath = (data: number[], color: string) => {
    const min = Math.min(...data, ...cfData, ...lcData);
    const max = Math.max(...data, ...cfData, ...lcData);
    const range = max - min;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((val - min) / range) * (height - 2 * padding) - padding;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="glass-card p-8 rounded-3xl border-white/5 relative overflow-hidden hud-corners"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Activity size={120} className="text-accent-cyan" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-cyan/10 rounded-xl border border-accent-cyan/20">
            <TrendingUp size={20} className="text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-[0.4em] uppercase tech-bracket font-display">PERFORMANCE_HISTORY</h3>
            <p className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-[0.3em] font-mono">NEURAL_RATING_TREND_V.1</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">CODEFORCES</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-magenta shadow-[0_0_8px_var(--accent-magenta)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">LEETCODE</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[4/1] min-h-[200px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding)) / 4}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding)) / 4}
              stroke="white"
              strokeOpacity="0.03"
              strokeWidth="1"
            />
          ))}

          {/* Lines */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d={getPath(cfData, 'var(--accent-cyan)')}
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(0,245,255,0.4)]"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            d={getPath(lcData, 'var(--accent-magenta)')}
            fill="none"
            stroke="var(--accent-magenta)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(255,0,255,0.4)]"
          />

          {/* Data Points (End) */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2 }}
            cx={(cfData.length - 1) / (cfData.length - 1) * (width - 2 * padding) + padding}
            cy={height - ((cfData[cfData.length - 1] - Math.min(...cfData, ...lcData)) / (Math.max(...cfData, ...lcData) - Math.min(...cfData, ...lcData))) * (height - 2 * padding) - padding}
            r="4"
            fill="var(--accent-cyan)"
            className="shadow-[0_0_10px_var(--accent-cyan)]"
          />
        </svg>
      </div>
    </motion.div>
  );
}
