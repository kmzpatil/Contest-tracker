'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code2, Flame, Terminal, Target, ArrowUpRight } from 'lucide-react';

interface StatsProfileCardProps {
  user: {
    name: string;
    rank: string;
    solved: number;
    cfRating: number;
    lcSolved: number;
    streak: number;
  };
}

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-50">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export function StatsProfileCard({ user }: StatsProfileCardProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.75;
  const offset = circumference - progress * circumference;

  const lcNotConnected = user.lcSolved === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-10 rounded-3xl flex flex-col lg:flex-row gap-12 items-center overflow-hidden relative group border-white/5 hud-corners shadow-2xl"
    >
      {/* High-Fidelity Background Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 blur-[120px] pointer-events-none group-hover:bg-accent-cyan/15 transition-colors duration-1000" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-magenta/5 blur-[120px] pointer-events-none transition-colors duration-1000" />
      
      {/* Circular HUD Display */}
      <div className="relative w-64 h-64 flex items-center justify-center shrink-0 scale-110 lg:scale-100">
        {/* Animated HUD Rings */}
        <div className="absolute inset-0 border-[3px] border-white/5 rounded-full animate-[spin_25s_linear_infinite]" />
        <div className="absolute inset-4 border border-dashed border-accent-cyan/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute inset-10 border border-white/5 rounded-full" />

        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-90 drop-shadow-[0_0_15px_rgba(0,245,255,0.4)]">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.01)"
            strokeWidth="12"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2.5, ease: "circOut" }}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="url(#neon-grad-pro)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="neon-grad-pro" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-cyan)" />
              <stop offset="60%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent-magenta)" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-8xl font-black text-white tracking-tighter font-mono leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {user.solved}
          </motion.div>
          <div className="text-[11px] font-black tracking-[0.5em] text-accent-cyan uppercase mt-5 opacity-80 font-display flex items-center gap-4">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse shadow-[0_0_10px_var(--accent-cyan)]" />
            SOLVED
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse shadow-[0_0_10px_var(--accent-cyan)]" />
          </div>
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="flex-1 space-y-12 w-full relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-6">
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase glitch-text cursor-default leading-none">{user.name}</h2>
              <div className="px-5 py-2 bg-primary/10 text-primary text-[11px] font-black rounded-full border border-primary/20 tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                RANK_NODE_ALPHA
              </div>
            </div>
            <div className="flex flex-wrap gap-5">
              <div className="flex items-center gap-4 px-5 py-2.5 bg-white/[0.03] rounded-2xl border border-white/5 group/tag hover:border-accent-cyan/40 transition-all hover:bg-white/[0.05] shadow-lg">
                <Target size={16} className="text-accent-cyan group-hover/tag:scale-125 transition-transform" />
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] font-mono">
                  GLOBAL_RANK <span className="text-white ml-2">{user.rank}</span>
                </p>
              </div>
              <div className="flex items-center gap-4 px-5 py-2.5 bg-white/[0.03] rounded-2xl border border-white/5 group/tag hover:border-accent-magenta/40 transition-all hover:bg-white/[0.05] shadow-lg">
                <Terminal size={16} className="text-accent-magenta group-hover/tag:scale-125 transition-transform" />
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] font-mono">
                  NODE <span className="text-white ml-2">CODEFORCES</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="text-[11px] font-black text-accent-magenta uppercase tracking-[0.5em] mb-4 opacity-70 font-mono">OPERATIONAL_STREAK</div>
            <div className="flex items-center gap-6 p-2 pl-6 bg-accent-magenta/5 rounded-3xl border border-accent-magenta/20 text-accent-magenta group/streak shadow-[0_0_40px_rgba(255,0,255,0.1)] hover:bg-accent-magenta/10 transition-all">
              <span className="text-5xl font-black font-mono tracking-tighter group-hover:scale-110 transition-transform group-hover:text-white duration-500">{user.streak}D</span>
              <div className="p-6 bg-accent-magenta rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.6)] group-hover:rotate-12 transition-transform duration-500">
                <Flame size={32} fill="black" stroke="black" className="animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { 
              label: 'CODEFORCES', 
              value: user.cfRating, 
              icon: Terminal, 
              color: 'text-accent-cyan', 
              accent: 'var(--accent-cyan)',
              sub: 'MAX_RATING_NODE',
              history: [1200, 1250, 1230, 1300, 1450, 1400, 1550, 1600, 1580, 1720]
            },
            { 
              label: 'LEETCODE', 
              value: lcNotConnected ? 'N/A' : user.lcSolved, 
              icon: Code2, 
              color: 'text-accent-magenta', 
              accent: 'var(--accent-magenta)',
              sub: lcNotConnected ? 'NOT_CONNECTED' : 'TOTAL_SOLVED_LOG',
              history: [10, 15, 20, 25, 40, 55, 70, 85, 100, 114],
              isNotConnected: lcNotConnected
            },
            { 
              label: 'RANKING', 
              value: user.rank, 
              icon: Trophy, 
              color: 'text-accent-green', 
              accent: 'var(--accent-green)',
              sub: 'SYSTEM_WIDE_POS',
              history: [100, 90, 85, 70, 60, 55, 50, 48, 45, 42]
            }
          ].map((stat, i) => (
            <div key={i} className={`relative group/stat p-8 rounded-3xl border transition-all duration-500 overflow-hidden shadow-xl ${
              stat.isNotConnected ? 'bg-black/40 border-white/5 opacity-50' : 'bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
            }`}>
              {stat.isNotConnected && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3">OFFLINE_NODE</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Uplink target not detected. Link account in settings.</p>
                </div>
              )}
              
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={56} />
              </div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover/stat:scale-110 transition-transform shadow-inner border border-white/5`}>
                  <stat.icon size={24} />
                </div>
                <ArrowUpRight size={18} className="text-slate-800 group-hover/stat:text-white transition-colors" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">{stat.label}</div>
                <div className="flex items-end gap-5">
                   <div className="text-5xl font-black text-white font-mono tracking-tighter drop-shadow-lg">{stat.value}</div>
                   {!stat.isNotConnected && <Sparkline data={stat.history} color={stat.accent} />}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest transition-all transform translate-y-2 group-hover:translate-y-0 ${
                   stat.isNotConnected ? 'text-accent-magenta opacity-100' : 'text-slate-700 opacity-0 group-hover:opacity-100'
                }`}>
                  {stat.sub}
                </div>
              </div>

              {/* Stat Progress Bar (Bottom) */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/[0.02]">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: stat.isNotConnected ? 0 : '65%' }}
                   transition={{ duration: 1.5, delay: 1 }}
                   className={`h-full ${stat.color.replace('text-', 'bg-')} opacity-40`}
                 />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
