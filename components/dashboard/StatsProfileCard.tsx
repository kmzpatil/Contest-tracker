'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code2, Flame, Terminal, Target, ArrowUpRight, Zap, Info, User } from 'lucide-react';

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

const StatCard = ({ 
  label, 
  value, 
  subLabel, 
  icon: Icon, 
  isConnected = true,
  trend = [] 
}: { 
  label: string; 
  value: string | number; 
  subLabel: string; 
  icon: any;
  isConnected?: boolean;
  trend?: number[];
}) => (
  <div className={`luxury-card p-6 flex flex-col justify-between group h-full relative overflow-hidden ${!isConnected && 'opacity-60 bg-zinc-900/40'}`}>
    {!isConnected && (
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
        <Info size={20} className="text-muted-foreground mb-2" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Not Linked</p>
      </div>
    )}
    <div className="flex items-start justify-between">
      <div className="p-2.5 bg-white/5 rounded-xl text-muted-foreground group-hover:text-foreground transition-colors border border-white/5 shadow-inner">
        <Icon size={20} />
      </div>
      <ArrowUpRight size={16} className="text-zinc-800 group-hover:text-zinc-500 transition-colors" />
    </div>
    
    <div className="mt-8 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex items-end gap-3">
        <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
      </div>
      <p className="text-[10px] font-medium text-zinc-500">{subLabel}</p>
    </div>
  </div>
);

export function StatsProfileCard({ user }: StatsProfileCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Primary Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 luxury-card p-8 flex flex-col sm:flex-row items-center gap-10 bg-zinc-900/10"
      >
        <div className="relative shrink-0">
          <div className="w-32 h-32 rounded-full border-4 border-white/5 p-1 relative">
            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
               <User size={64} className="text-zinc-600 mt-4" />
            </div>
            {/* Subtle progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="62"
                fill="transparent"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="390"
                strokeDashoffset={390 - (user.solved / 1000) * 390}
                className="opacity-20"
              />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-foreground text-background rounded-full p-2 shadow-xl border-4 border-background">
            <Zap size={16} fill="currentColor" />
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-4xl font-bold tracking-tight">{user.name}</h2>
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-white/5">
                Pro Node
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Platform Architect & Competitor</p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <Flame size={14} className="text-orange-500" fill="currentColor" />
              <span className="text-xs font-bold">{user.streak}D Streak</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <Target size={14} className="text-zinc-400" />
              <span className="text-xs font-bold">{user.rank}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Bento Items */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard 
          label="Codeforces" 
          value={user.cfRating || '---'} 
          subLabel="Current Competitive Rating" 
          icon={Terminal} 
          isConnected={user.cfRating > 0}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatCard 
          label="LeetCode" 
          value={user.lcSolved || '---'} 
          subLabel="Total Problems Solved" 
          icon={Code2} 
          isConnected={user.lcSolved > 0}
        />
      </motion.div>

    </div>
  );
}
