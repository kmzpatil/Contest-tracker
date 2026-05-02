'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import type { ContestHistoryEntry } from '@/lib/profileSync';

interface RatingHistoryChartProps {
  cfHistory?: ContestHistoryEntry[];
  lcHistory?: ContestHistoryEntry[];
}

export function RatingHistoryChart({ cfHistory = [], lcHistory = [] }: RatingHistoryChartProps) {
  const width = 800;
  const height = 200;
  const padding = 20;

  const combinedData = useMemo(() => {
    const cf = (cfHistory || []).map(h => h.rating);
    const lc = (lcHistory || []).map(h => h.rating);
    return { cf, lc };
  }, [cfHistory, lcHistory]);

  // If no data, use some fallback or empty state
  const hasData = combinedData.cf.length > 0 || combinedData.lc.length > 0;
  
  // Fallback data if empty for visualization
  const displayCf = combinedData.cf.length > 0 ? combinedData.cf : [0, 0];
  const displayLc = combinedData.lc.length > 0 ? combinedData.lc : [0, 0];

  const getPath = (data: number[]) => {
    if (data.length < 2) return '';
    
    const allValues = [...displayCf, ...displayLc].filter(v => v > 0);
    const min = allValues.length > 0 ? Math.min(...allValues) : 0;
    const max = allValues.length > 0 ? Math.max(...allValues) : 2000;
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
            <div className="w-2 h-2 rounded-full bg-accent-cyan" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Codeforces</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-orange" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LeetCode</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[4/1] min-h-[160px]">
        {!hasData ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs font-medium uppercase tracking-widest italic">
            Awaiting Synchronization...
          </div>
        ) : (
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

            {/* Codeforces Line */}
            {combinedData.cf.length > 1 && (
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d={getPath(combinedData.cf)}
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ stroke: '#00f5ff' }}
              />
            )}

            {/* LeetCode Line */}
            {combinedData.lc.length > 1 && (
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                d={getPath(combinedData.lc)}
                fill="none"
                stroke="var(--accent-orange)"
                strokeWidth="2"
                strokeOpacity="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ stroke: '#ffa116' }}
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
