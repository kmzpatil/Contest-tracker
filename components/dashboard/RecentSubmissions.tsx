'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ExternalLink, Database, Zap, Activity, Terminal } from 'lucide-react';

const SUBMISSIONS = [
  { id: 'TX_901', problem: '1927D - Find the Different Chart', difficulty: '1400', platform: 'Codeforces', status: 'accepted', time: '2m ago' },
  { id: 'TX_902', problem: '242. Valid Anagram', difficulty: 'Easy', platform: 'LeetCode', status: 'accepted', time: '45m ago' },
  { id: 'TX_903', problem: '1926G - Vlad and Trouble at MIT', difficulty: '1900', platform: 'Codeforces', status: 'failed', time: '1h ago' },
  { id: 'TX_904', problem: '158A - Next Round', difficulty: '800', platform: 'Codeforces', status: 'accepted', time: '3h ago' },
];

export function RecentSubmissions() {
  const [search, setSearch] = React.useState('');

  const filteredSubmissions = SUBMISSIONS.filter(sub => 
    sub.problem.toLowerCase().includes(search.toLowerCase()) ||
    sub.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl overflow-hidden border-white/5 relative group hud-corners flex flex-col h-full shadow-2xl"
    >
      {/* Header Section */}
      <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.01] gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <Activity size={20} className="text-primary animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-[0.4em] uppercase tech-bracket font-display">DATA_STREAM</h3>
            <p className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-[0.3em] font-mono">LIVE_NODE_TELEMETRY</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-64 group/search">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-hover/search:text-accent-cyan transition-colors">
            <Terminal size={14} />
          </div>
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER_STREAM..."
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-black text-white placeholder:text-slate-800 outline-none focus:border-accent-cyan/30 transition-all font-mono"
          />
        </div>
      </div>

      {/* Submission List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 min-h-[400px]">
        {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub, idx) => (
          <motion.div 
            key={sub.id} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + idx * 0.05 }}
            className="group/item p-5 bg-white/[0.01] rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 relative overflow-hidden"
          >
            {/* Platform Background Text (Ghosted) */}
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-4xl font-black text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
              {sub.platform}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-5">
                <div className={`p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner transition-transform group-hover/item:scale-110 ${
                  sub.status === 'accepted' ? 'text-accent-cyan' : 'text-accent-magenta'
                }`}>
                  {sub.status === 'accepted' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] font-mono">{sub.id}</span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full" />
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] font-mono border ${
                      sub.difficulty === 'Easy' ? 'bg-accent-green/10 text-accent-green border-accent-green/20' : 
                      sub.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      'bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20'
                    }`}>LVL_{sub.difficulty}</span>
                  </div>
                  <h4 className="text-base font-black text-white tracking-tight group-hover/item:text-accent-cyan transition-colors flex items-center gap-2">
                    {sub.problem}
                    <ExternalLink size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-accent-cyan" />
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t border-white/5 pt-4 sm:pt-0 sm:border-0">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] font-mono px-3 py-1.5 rounded-lg ${
                  sub.status === 'accepted' ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-accent-magenta/10 text-accent-magenta'
                }`}>
                  {sub.status === 'accepted' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {sub.status === 'accepted' ? 'EXECUTED' : 'ABORTED'}
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">
                  {sub.time}
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
            <Database size={48} className="mb-4" />
            <p className="text-[10px] font-black tracking-[0.5em] uppercase">NO_DATA_MATCHES</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-white/[0.01] border-t border-white/5">
        <button className="w-full py-4 bg-white/[0.02] border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] hover:bg-white hover:text-black hover:border-white transition-all duration-500 group/btn shadow-inner">
          EXPAND_DATA_ARCHIVE
          <Zap size={10} className="inline ml-3 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-bounce transition-all" />
        </button>
      </div>
    </motion.div>
  );
}
