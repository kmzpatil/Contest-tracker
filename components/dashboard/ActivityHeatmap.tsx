'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ActivityHeatmap() {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  // Static-looking activity data for consistent luxury feel
  const weeks = Array.from({ length: 52 }, (_, i) => 
    Array.from({ length: 7 }, (_, j) => {
       // Create some patterns rather than pure random
       const val = (Math.sin(i * 0.5) + Math.cos(j * 0.5) + 2) / 4;
       return Math.floor(val * 5);
    })
  );

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-white/[0.03]';
      case 1: return 'bg-zinc-800';
      case 2: return 'bg-zinc-600';
      case 3: return 'bg-zinc-400';
      case 4: return 'bg-white';
      default: return 'bg-white/[0.03]';
    }
  };

  return (
    <div className="luxury-card p-6 space-y-8 bg-zinc-900/10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Activity Intensity</h3>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-zinc-600">Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} className={`w-3 h-3 rounded-[2px] ${getLevelColor(level)}`} />
            ))}
          </div>
          <span className="text-[10px] font-medium text-zinc-600">More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[700px] flex gap-1.5">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1 shrink-0">
              {week.map((level, dayIndex) => (
                <div 
                  key={dayIndex}
                  className={`w-2.5 h-2.5 rounded-[1px] ${getLevelColor(level)} transition-colors duration-500`}
                  title={`Level ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between px-2">
        {months.map(month => (
          <span key={month} className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
            {month}
          </span>
        ))}
      </div>
    </div>
  );
}
