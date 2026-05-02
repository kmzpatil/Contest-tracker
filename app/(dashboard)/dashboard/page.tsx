'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useContests } from '@/hooks/useContests';
import { ContestCard } from '@/components/contest/ContestCard';
import { StatsProfileCard } from '@/components/dashboard/StatsProfileCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { RecentSubmissions } from '@/components/dashboard/RecentSubmissions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { RatingHistoryChart } from '@/components/dashboard/RatingHistoryChart';
import { Loader2, Zap, RefreshCw, Terminal as TerminalIcon, ShieldCheck, ExternalLink, PanelRightClose, PanelRightOpen, Flame } from 'lucide-react';
import type { Contest } from '@/lib/contestApi';


export default function DashboardPage() {
  const { user } = useAuth();
  const { contests, loading, error, refresh } = useContests();
  const [profile, setProfile] = useState<any>(null);
  const [handleInput, setHandleInput] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [alarmModalOpen, setAlarmModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [savingAlarm, setSavingAlarm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile/me');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const syncProfile = async (handle: string) => {
    if (!handle) return;
    setProfileBusy(true);
    setProfileMessage('ESTABLISHING_UPLINK...');
    try {
      const res = await fetch('/api/profile/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.profile);
        setProfileMessage('SYNC_COMPLETE_STATUS_OK');
        setTimeout(() => setProfileMessage(''), 3000);
      } else {
        setProfileMessage(`ERROR: ${data.error || 'SYNC_FAILED'}`);
      }
    } catch (err) {
      setProfileMessage('SYSTEM_UNREACHABLE');
    } finally {
      setProfileBusy(false);
    }
  };

  const handleSetAlarm = (contest: Contest) => {
    setSelectedContest(contest);
    setAlarmModalOpen(true);
  };

  const handleSaveAlarm = async (minutes: number) => {
    if (!selectedContest) return;
    setSavingAlarm(true);
    try {
      const res = await fetch('/api/alarms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contestId: selectedContest.id,
          remindMinutes: minutes,
        }),
      });
      if (res.ok) {
        setAlarmModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to save alarm', err);
    } finally {
      setSavingAlarm(false);
    }
  };

  const REMIND_OPTIONS = [
    { label: '5_MINUTES_PRIOR', value: 5 },
    { label: '15_MINUTES_PRIOR', value: 15 },
    { label: '30_MINUTES_PRIOR', value: 30 },
    { label: '60_MINUTES_PRIOR', value: 60 },
  ];

  const userData = useMemo(() => ({
    name: user?.name || 'VOID_USER_001',
    rank: profile?.codeforces?.rank?.toString() || profile?.leetcode?.rank?.toString() || '#42',
    solved: profile?.solvedTotal || 0,
    cfRating: profile?.codeforces?.rating || 0,
    lcSolved: profile?.leetcode?.solved || 0,
    streak: 124
  }), [user, profile]);

  if (loading && !contests.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-void">
        <Loader2 className="animate-spin text-accent-cyan" size={48} />
        <p className="font-mono text-xs tracking-[0.5em] text-accent-cyan animate-pulse">LOADING_VOID_INTERFACE...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto space-y-8 custom-scrollbar h-[calc(100vh-80px)] overflow-y-auto relative">
      <div className="mesh-bg" />
      
      {/* Top Section: Profile Card (Bento) */}
      <div className="grid grid-cols-1 gap-6">
        <StatsProfileCard user={userData} />
      </div>

      {/* Main Grid: Contests & Activity */}
      <div className="flex flex-col xl:flex-row gap-6 relative">
        {/* Contests Column */}
        <div className={`flex-1 space-y-8 transition-all duration-500 ${isSidebarOpen ? 'xl:w-[70%]' : 'xl:w-full'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="text-accent-cyan" fill="currentColor" size={24} />
              <h2 className="text-2xl font-bold text-white tracking-tight glitch-text uppercase">Upcoming Contests</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-accent-cyan transition-all"
              >
                {isSidebarOpen ? <PanelRightClose size={14} className="mr-2" /> : <PanelRightOpen size={14} className="mr-2" />}
                {isSidebarOpen ? 'COMPRESS_PANEL' : 'EXPAND_PANEL'}
              </Button>
              <Button variant="ghost" size="sm" onClick={refresh} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent-cyan transition-colors">
                <RefreshCw size={12} className="mr-2" />
                REFRESH_SYNC
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 rounded-md">
                <div className="live-indicator"></div>
                <span className="text-[10px] font-black text-accent-cyan tracking-[0.2em] uppercase">SYSTEM_LIVE</span>
              </div>
            </div>
          </div>
          
          <div className={`grid grid-cols-1 gap-6 ${isSidebarOpen ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {contests.slice(0, 4).map((contest, index) => (
              <ContestCard 
                key={contest.id} 
                contest={contest} 
                onSetAlarm={handleSetAlarm} 
                index={index} 
              />
            ))}
            {contests.length === 0 && (
              <div className="col-span-full glass-card p-12 text-center rounded-2xl border-dashed border-white/10">
                <p className="text-slate-500 font-mono text-sm tracking-widest">NO_CONTESTS_DETECTED_IN_SECTOR</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
               <RecentSubmissions />
            </div>
            <div className="lg:col-span-5">
               <RatingHistoryChart />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <motion.div 
          initial={false}
          animate={{ 
            width: isSidebarOpen ? '400px' : '0px',
            opacity: isSidebarOpen ? 1 : 0,
            x: isSidebarOpen ? 0 : 40
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`space-y-6 shrink-0 overflow-hidden ${!isSidebarOpen && 'pointer-events-none'}`}
        >
          <div className="w-[400px] space-y-6">
            <ActivityHeatmap />
            
            {/* Profile Sync Panel (Terminal Style) */}
            <div className="glass-card p-8 rounded-3xl border-white/5 bg-black/40 relative group overflow-hidden hud-corners shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-accent-cyan/10 rounded-xl border border-accent-cyan/20">
                    <TerminalIcon size={20} className="text-accent-cyan" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase">TERMINAL_SYNC</h3>
                    <p className="text-[8px] font-black text-slate-600 mt-1 uppercase tracking-widest">Profile Uplink Node</p>
                  </div>
                </div>
                <ShieldCheck size={20} className="text-slate-700 group-hover:text-accent-cyan transition-colors" />
              </div>

              <div className="space-y-5 font-mono">
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-cyan opacity-40 text-[10px] font-black group-hover/input:opacity-100 transition-opacity">PROMPT{">"}</div>
                  <input
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-accent-cyan/30 rounded-2xl py-4 px-14 text-sm text-white placeholder:text-slate-800 outline-none transition-all font-mono shadow-inner"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    placeholder="USER_IDENTIFIER"
                  />
                </div>
                <Button 
                  onClick={() => syncProfile(handleInput.trim())}
                  disabled={!handleInput.trim() || profileBusy}
                  loading={profileBusy}
                  fullWidth
                  className="h-14 bg-accent-cyan text-black font-black uppercase text-[11px] tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,245,255,0.2)] rounded-2xl"
                >
                  EXECUTE_SYNC
                </Button>
                {profileMessage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-white/[0.02] rounded-2xl border border-white/5"
                  >
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-cyan animate-pulse text-center">
                       {profileMessage}
                     </p>
                  </motion.div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between opacity-60">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">LAST_SYNC_TS</span>
                <span className="text-[10px] font-black text-accent-cyan font-mono tracking-widest">
                  {profile?.syncedAt ? new Date(profile.syncedAt).toLocaleTimeString() : 'NULL_PTR'}
                </span>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="glass-card p-8 rounded-3xl border-white/5 relative group overflow-hidden hud-corners shadow-2xl">
              <h3 className="text-xs font-black text-white mb-8 tracking-[0.4em] uppercase tech-bracket">DATA_GATEWAYS</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'CODEFORCES', url: 'https://codeforces.com', color: 'group-hover:text-blue-400' },
                  { label: 'LEETCODE', url: 'https://leetcode.com', color: 'group-hover:text-yellow-500' },
                  { label: 'ATCODER', url: 'https://atcoder.jp', color: 'group-hover:text-red-500' },
                  { label: 'VOID_CONFIG', url: '/settings', color: 'group-hover:text-accent-cyan' }
                ].map(item => (
                  <a 
                    key={item.label} 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/10 group"
                  >
                    <span className={`tracking-[0.4em] transition-colors ${item.color}`}>{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] text-slate-800 group-hover:text-slate-600 transition-colors uppercase font-mono">LINK_SECURE</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-all text-accent-cyan" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Modal isOpen={alarmModalOpen} onClose={() => setAlarmModalOpen(false)} title="NEURAL_ALARM_CONFIG">
        {selectedContest ? (
          <div className="space-y-6">
            <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-xl">
              <p className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest mb-1 tech-bracket">TARGET_CONTEST</p>
              <p className="text-lg font-black text-white font-mono tracking-tighter uppercase">{selectedContest.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {REMIND_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="secondary"
                  onClick={() => handleSaveAlarm(option.value)}
                  loading={savingAlarm}
                  className="text-[10px] font-bold tracking-widest border-white/10 hover:border-accent-cyan/50"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
