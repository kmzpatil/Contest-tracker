'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export function RatingHistoryChart() {
  // Mock data for rating history
  const cfData = [1200, 1250, 1230, 1300, 1450, 1400, 1550, 1600, 1580, 1720];
  const lcData = [1000, 1050, 1100, 1080, 1150, 1200, 1180, 1250, 1300, 1350];
  
  const width = 800;
  const height = 200;
  const padding = 20;
  
  const getPath = (data: number[]) => {
    const min = Math.min(...cfData, ...lcData);
    const max = Math.max(...cfData, ...lcData);
    const range = max - min || 1;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((val - min) / range) * (height - 2 * padding) - padding;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="luxury-card p-8 bg-zinc-900/10 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <h3 className="text-sm font-semibold tracking-tight">Rating Trajectory</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Codeforces</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LeetCode</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[4/1] min-h-[160px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding)) / 2}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding)) / 2}
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          ))}

          {/* Lines */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={getPath(cfData)}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            d={getPath(lcData)}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
