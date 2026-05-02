'use client';

import React from 'react';
import { useContests } from '@/hooks/useContests';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Calendar as CalendarIcon, Filter, Cpu } from 'lucide-react';

const PLATFORM_OPTIONS = [
  { label: 'ALL_NODES', value: 'all' },
  { label: 'CODEFORCES', value: 'codeforces', color: '#1a8cff' },
  { label: 'LEETCODE', value: 'leetcode', color: '#ffa116' },
  { label: 'CODECHEF', value: 'codechef', color: '#d4a373' },
  { label: 'ATCODER', value: 'atcoder', color: '#00c0af' },
];

export default function CalendarPage() {
  const { contests, loading, error, platform, setPlatform } = useContests();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-accent-cyan/40 rounded-full" />
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-accent-cyan">
            <CalendarIcon size={14} className="animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono">TEMPORAL_MATRIX_V.2</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display glitch-text">
            CONTEST <span className="text-accent-cyan">CALENDAR</span>
          </h1>
          <p className="text-slate-400 text-sm lg:text-base max-w-xl leading-relaxed uppercase tracking-wide font-medium">
            Synchronize with upcoming execution windows. Inspect monthly telemetry across global competitive nodes.
          </p>
        </div>

        <div className="glass-card p-2 rounded-2xl border-white/5 flex items-center gap-4">
          <div className="p-2 rounded-xl bg-accent-cyan/10 text-accent-cyan">
            <Filter size={16} />
          </div>
          <ToggleGroup 
            options={PLATFORM_OPTIONS} 
            value={platform} 
            onChange={setPlatform} 
          />
        </div>
      </header>

      <div className="relative z-10 min-h-[600px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 glass-card rounded-3xl border-white/5">
            <Cpu size={40} className="text-accent-cyan animate-spin-slow" />
            <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.4em] font-mono">INITIALIZING_MATRIX...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 glass-card rounded-3xl border-white/5 border-accent-magenta/20 bg-accent-magenta/5">
            <span className="text-[10px] font-black text-accent-magenta uppercase tracking-[0.4em] font-mono">MATRIX_ERROR: {error}</span>
          </div>
        ) : (
          <CalendarGrid contests={contests} />
        )}
      </div>
    </div>
  );
}
