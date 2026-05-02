'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Settings as SettingsIcon, RefreshCw, UserCheck, Terminal, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [syncLoading, setSyncLoading] = useState(false);
  const [contestLoading, setContestLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileSync = async () => {
    setSyncLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sync profile');
      }

      setMessage('SUCCESS: PROFILE_PERFORMANCE_SYNCED');
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Sync failed';
      setMessage(`ERROR: ${text.toUpperCase()}`);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleContestRefresh = async () => {
    setContestLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/contests?force=1');
      if (!res.ok) {
        throw new Error('Failed to refresh contests');
      }
      setMessage('SUCCESS: CONTEST_CACHE_RELOADED');
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Contest reload failed';
      setMessage(`ERROR: ${text.toUpperCase()}`);
    } finally {
      setContestLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-accent-cyan/40 rounded-full" />
        <div className="flex items-center gap-3 text-accent-cyan mb-1">
          <SettingsIcon size={14} className="animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono">SYSTEM_CONFIG_V.4</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display glitch-text">
          SYSTEM <span className="text-accent-cyan">CONTROL</span>
        </h1>
        <p className="text-slate-400 text-sm lg:text-base max-w-2xl leading-relaxed uppercase tracking-wide font-medium">
          Manage operational parameters and node synchronization. Manual overrides for profile telemetry and global contest matrix refreshes.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card hud-corners p-8 rounded-3xl border-white/5 group hover:border-accent-cyan/30 transition-all duration-500"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
              <UserCheck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">PROFILE_SYNC</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manual node update</p>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed mb-10 font-medium uppercase tracking-wide">
            Initiate a full synchronization of connected platform handles. Pulls latest ratings, submission counts, and achievement telemetry into the local cache.
          </p>

          <Button 
            onClick={handleProfileSync} 
            loading={syncLoading}
            fullWidth
            className="h-14 rounded-2xl bg-white/5 border-white/10 text-[10px] font-black tracking-[0.3em] hover:bg-accent-cyan hover:text-black transition-all"
          >
            <RefreshCw size={14} className={`mr-3 ${syncLoading ? 'animate-spin' : ''}`} />
            EXECUTE_SYNC_PROTOCOL
          </Button>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card hud-corners p-8 rounded-3xl border-white/5 group hover:border-accent-magenta/30 transition-all duration-500"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-accent-magenta/10 text-accent-magenta border border-accent-magenta/20">
              <Terminal size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">MATRIX_RELOAD</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Force contest refresh</p>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed mb-10 font-medium uppercase tracking-wide">
            Bypass local cache and re-query global contest sources. Use this if dashboard telemetry appears desynchronized from source platform schedules.
          </p>

          <Button 
            onClick={handleContestRefresh} 
            loading={contestLoading}
            fullWidth
            className="h-14 rounded-2xl bg-white/5 border-white/10 text-[10px] font-black tracking-[0.3em] hover:bg-accent-magenta hover:text-black transition-all"
          >
            <RefreshCw size={14} className={`mr-3 ${contestLoading ? 'animate-spin' : ''}`} />
            RELOAD_MATRIX_DATA
          </Button>
        </motion.section>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-2xl border flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] font-mono shadow-2xl relative z-10 ${
              message.startsWith('ERROR') 
                ? 'bg-accent-magenta/10 border-accent-magenta/30 text-accent-magenta' 
                : 'bg-accent-green/10 border-accent-green/30 text-accent-green'
            }`}
          >
            <ShieldCheck size={18} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
