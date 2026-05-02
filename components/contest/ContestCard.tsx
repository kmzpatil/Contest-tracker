'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Contest } from '@/lib/contestApi';
import { Button } from '@/components/ui/Button';
import { CountdownTimer } from './CountdownTimer';
import { Bell, ExternalLink, Terminal, Code2, Trophy, Zap } from 'lucide-react';

interface ContestCardProps {
  contest: Contest;
  onSetAlarm: (contest: Contest) => void;
  index?: number;
}

export function ContestCard({ contest, onSetAlarm, index = 0 }: ContestCardProps) {
  const isCodeforces = contest.platform.toLowerCase().includes('codeforces');
  const isLeetCode = contest.platform.toLowerCase().includes('leetcode');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6 rounded-2xl relative group overflow-hidden hud-corners border border-white/5 hover:border-accent-cyan/10"
    >
      {/* Platform Glow Accent */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 blur-[100px] opacity-[0.05] group-hover:opacity-20 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: contest.platformColor || 'var(--accent-cyan)' }}
      />
      
      {/* Pro Max Scanning Line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/[0.03] to-transparent h-[2px] w-full -translate-y-full group-hover:translate-y-[1000%] transition-transform duration-[3000ms] ease-linear pointer-events-none" />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 bg-black/40 shadow-inner"
               style={{ 
                 borderColor: `${contest.platformColor}40` || 'rgba(0, 245, 255, 0.2)'
               }}>
            {isCodeforces ? <Terminal className="text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]" size={28} /> :
             isLeetCode ? <Code2 className="text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" size={28} /> :
             <Trophy className="text-accent-cyan drop-shadow-[0_0_12px_rgba(0,245,255,0.6)]" size={28} />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap size={10} className="text-accent-cyan animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">
                {contest.platform}_SECTOR
              </span>
            </div>
            <h3 className="text-base font-black text-white line-clamp-2 min-h-[3rem] font-display tracking-tight uppercase group-hover:text-accent-cyan transition-colors" title={contest.name}>
              {contest.name}
            </h3>
          </div>
        </div>
        <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest font-mono opacity-40">
          ID_{index.toString().padStart(3, '0')}
        </div>
      </div>

      <div className="mb-8 p-6 bg-black/40 rounded-xl border border-white/[0.03] relative group-hover:bg-black/60 transition-all duration-300">
        <div className="flex items-end justify-between relative z-10">
          <div className="space-y-3">
            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">STARTS_IN</p>
            <CountdownTimer targetDate={contest.startTime} />
          </div>
          <div className="text-right">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] block mb-2">NODE_STATUS</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full">
              <div className="live-indicator scale-75" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ACTIVE</span>
            </div>
          </div>
        </div>
        
        {/* Animated Progress Rail */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/[0.02] w-full overflow-hidden rounded-full">
           <motion.div 
             initial={{ x: '-100%' }}
             animate={{ x: '100%' }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="h-full w-1/4 bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent shadow-[0_0_10px_var(--accent-cyan)]"
           />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onSetAlarm(contest)}
          className="bg-white/[0.03] border-white/10 hover:border-accent-magenta/50 hover:text-accent-magenta text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-300 group/btn"
        >
          <Bell size={14} className="mr-2 group-hover/btn:animate-bounce" />
          SET_ALARM
        </Button>
        <a href={contest.url} target="_blank" rel="noopener noreferrer">
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth
            className="text-[9px] font-black tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(0,245,255,0.1)] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-all duration-500 border-accent-cyan/40 hover:bg-white hover:text-black"
          >
            <ExternalLink size={14} className="mr-2" />
            OPEN_LINK
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

