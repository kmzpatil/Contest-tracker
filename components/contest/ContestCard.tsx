'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Contest } from '@/lib/contestApi';
import { Button } from '@/components/ui/Button';
import { CountdownTimer } from './CountdownTimer';
import { Bell, ExternalLink, Terminal, Code2, Trophy, Clock } from 'lucide-react';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="luxury-card flex flex-col justify-between group h-full"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-zinc-500 group-hover:text-white transition-all">
              {isCodeforces ? <Terminal size={20} /> :
               isLeetCode ? <Code2 size={20} /> :
               <Trophy size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                {contest.platform}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 
            className="text-lg font-bold tracking-tight line-clamp-2 leading-tight group-hover:text-white transition-colors cursor-help"
            title={contest.name}
          >
            {contest.name}
          </h3>
          <div className="flex items-center gap-2 text-zinc-500">
            <Clock size={12} />
            <p className="text-xs font-semibold">Starts In</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="p-4 bg-zinc-900/40 rounded-xl border border-white/5 flex items-center justify-center">
          <CountdownTimer targetDate={contest.startTime} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => onSetAlarm(contest)}
            className="text-xs"
          >
            <Bell size={14} className="mr-2" />
            Remind
          </Button>
          <a href={contest.url} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button 
              size="sm" 
              fullWidth
              className="text-xs"
            >
              <ExternalLink size={14} className="mr-2" />
              Open
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
