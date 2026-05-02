'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ExternalLink, Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { SubmissionEntry } from '@/lib/profileSync';

interface RecentSubmissionsProps {
  submissions?: SubmissionEntry[];
}

const getDifficultyColor = (platform: string, diff?: string) => {
  if (!diff) return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
  
  if (platform.toLowerCase() === 'leetcode') {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (diff === 'Medium') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (diff === 'Hard') return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  } else {
    const rating = parseInt(diff);
    if (isNaN(rating)) return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    if (rating < 1200) return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    if (rating < 1400) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (rating < 1600) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (rating < 1900) return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    if (rating < 2100) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  }
  return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
};

const formatTimestamp = (ts: number) => {
  const diff = Date.now() - ts * 1000;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export function RecentSubmissions({ submissions = [] }: RecentSubmissionsProps) {
  const [search, setSearch] = React.useState('');

  const filteredSubmissions = React.useMemo(() => {
    return submissions
      .filter(sub => 
        sub.title.toLowerCase().includes(search.toLowerCase()) ||
        sub.platform.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [submissions, search]);

  return (
    <div className="luxury-card flex flex-col h-full bg-zinc-900/10">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Recent Submissions</h3>
        <div className="relative w-48 group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none focus:border-white/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3 min-h-[400px]">
        {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
          <div 
            key={sub.id} 
            className="p-4 hover:bg-white/[0.03] rounded-xl transition-all border border-transparent hover:border-white/5 group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-emerald-500">
                  <CheckCircle2 size={18} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{sub.platform}</span>
                  </div>
                  <h4 className="text-sm font-semibold tracking-tight flex items-center gap-2 group-hover:text-zinc-200 transition-colors">
                    {sub.title}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
                  </h4>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">
                  Accepted
                </div>
                <div className="text-[10px] text-zinc-600 flex items-center justify-end gap-1">
                  <Clock size={10} />
                  {formatTimestamp(sub.timestamp)}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center py-20 text-zinc-700">
            <p className="text-xs font-medium uppercase tracking-widest italic">No recent activity detected.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
        <Button variant="secondary" fullWidth size="sm" className="text-xs">
          Sync Latest Submissions
        </Button>
      </div>
    </div>
  );
}
