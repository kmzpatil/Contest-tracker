import React from 'react';
import { ProfileSearch } from '@/components/profile/ProfileSearch';
import { Search } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-accent-cyan/40 rounded-full" />
        <div className="flex items-center gap-3 text-accent-cyan mb-1">
          <Search size={14} className="animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono">INTELLIGENCE_PROTOCOL_V.4</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display glitch-text inline-block">
          PROFILE <span className="text-accent-cyan">INTELLIGENCE</span>
        </h1>
        <p className="text-slate-400 text-sm lg:text-base max-w-2xl leading-relaxed uppercase tracking-wide font-medium">
          Query cross-platform data nodes. Inspect rating trajectories, problem distribution, and competitive standing across Codeforces and LeetCode.
        </p>
      </header>

      <div className="relative z-10">
        <ProfileSearch />
      </div>
    </div>
  );
}
