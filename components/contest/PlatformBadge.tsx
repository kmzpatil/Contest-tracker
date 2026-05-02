'use client';

import React from 'react';

interface PlatformBadgeProps {
  platform: string;
  icon: string;
  color: string;
}

export function PlatformBadge({ platform, icon, color }: PlatformBadgeProps) {
  return (
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-accent-cyan/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] group"
      style={{ borderColor: `${color}22` }}
      title={platform}
    >
      <span className="text-xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
        {icon}
      </span>
    </div>
  );
}
