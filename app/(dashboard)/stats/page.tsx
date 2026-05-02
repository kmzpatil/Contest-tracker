'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useContests } from '@/hooks/useContests';
import { motion } from 'framer-motion';
import { BarChart3, Activity, Trophy, Globe, Cpu } from 'lucide-react';

interface PlatformStat {
  platform: string;
  count: number;
  color: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  codeforces: '#1a8cff',
  leetcode: '#ffa116',
  codechef: '#d4a373',
  atcoder: '#00c0af',
};

export default function StatsPage() {
  const { contests, loading } = useContests();
  const [alarmCount, setAlarmCount] = useState(0);

  const fetchAlarmCount = useCallback(async () => {
    try {
      const res = await fetch('/api/alarms');
      if (res.ok) {
        const data = await res.json();
        setAlarmCount(data.alarms?.length || 0);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchAlarmCount(); }, [fetchAlarmCount]);

  const platformStats: PlatformStat[] = Object.entries(
    contests.reduce((acc, c) => {
      acc[c.platform] = (acc[c.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([platform, count]) => ({
    platform,
    count,
    color: PLATFORM_COLORS[platform] || '#8b5cf6',
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...platformStats.map(s => s.count), 1);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-accent-cyan/40 rounded-full" />
        <div className="flex items-center gap-3 text-accent-cyan mb-1">
          <BarChart3 size={14} className="animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono">TELEMETRY_LOG_V.4</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display glitch-text">
          MISSION <span className="text-accent-cyan">STATS</span>
        </h1>
        <p className="text-slate-400 text-sm lg:text-base max-w-2xl leading-relaxed uppercase tracking-wide font-medium">
          Analyze operational efficiency and cross-platform activity distribution. Real-time telemetry from connected nodes and scheduled alerts.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <StatCard 
          icon={Globe} 
          value={loading ? '—' : contests.length} 
          label="UPCOMING_CONTESTS" 
          color="text-accent-cyan" 
          delay={0.1}
        />
        <StatCard 
          icon={Activity} 
          value={alarmCount} 
          label="ACTIVE_ALERTS" 
          color="text-accent-magenta" 
          delay={0.2}
        />
        <StatCard 
          icon={Trophy} 
          value={platformStats.length} 
          label="TRACKED_NODES" 
          color="text-accent-green" 
          delay={0.3}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card hud-corners p-8 rounded-3xl border-white/5 relative overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
          <div className="p-3 rounded-xl bg-white/5 text-white">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">NODE_DISTRIBUTION</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Telemetry by platform source</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Cpu size={32} className="text-slate-700 animate-spin-slow" />
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono">PULLING_TELEMETRY...</span>
          </div>
        ) : platformStats.length === 0 ? (
          <div className="text-center py-20 text-slate-600 italic uppercase font-mono text-xs tracking-widest">
            No data packets detected.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {platformStats.map((stat, idx) => (
              <motion.div 
                key={stat.platform} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="group"
              >
                <div className="flex justify-between items-end mb-3 px-1">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-mono group-hover:text-accent-cyan transition-colors">{stat.platform}</span>
                  <span className="text-sm font-black text-white font-mono">{stat.count}</span>
                </div>
                <div className="h-4 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.count / maxCount) * 100}%` }}
                    transition={{ duration: 1, ease: "circOut", delay: 0.6 + idx * 0.1 }}
                    className="h-full rounded-full relative"
                    style={{
                      backgroundColor: stat.color,
                      boxShadow: `0 0 20px ${stat.color}40`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-shimmer" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card hud-corners p-8 rounded-3xl border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500"
    >
      <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
        <Icon size={120} />
      </div>
      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>
            <Icon size={18} />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">{label}</span>
        </div>
        <div className={`text-5xl font-black tracking-tight ${color}`}>{value}</div>
      </div>
    </motion.div>
  );
}
