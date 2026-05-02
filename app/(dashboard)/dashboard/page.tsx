'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useContests } from '@/hooks/useContests';
import { ContestCard } from '@/components/contest/ContestCard';
import { StatsProfileCard } from '@/components/dashboard/StatsProfileCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { RecentSubmissions } from '@/components/dashboard/RecentSubmissions';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RatingHistoryChart } from '@/components/dashboard/RatingHistoryChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  Plus, 
  RefreshCw, 
  Globe, 
  ChevronRight, 
  Settings, 
  ExternalLink, 
  Maximize2, 
  Minimize2,
  User,
  Link as LinkIcon,
  Shield
} from 'lucide-react';
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
    setProfileMessage('Linking accounts...');
    try {
      const res = await fetch('/api/profile/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.profile);
        setProfileMessage('Sync successful');
        setTimeout(() => setProfileMessage(''), 3000);
      } else {
        setProfileMessage(data.error || 'Sync failed');
      }
    } catch (err) {
      setProfileMessage('Connection error');
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

  const userData = useMemo(() => ({
    name: user?.name || 'Anonymous User',
    rank: profile?.codeforces?.rank || profile?.leetcode?.rank ? 
          (profile?.codeforces?.rank || `#${profile?.leetcode?.rank}`) : 'Unranked',
    solved: profile?.solvedTotal || 0,
    cfRating: profile?.codeforces?.rating || 0,
    lcSolved: profile?.leetcode?.solved || 0,
    streak: profile?.streak || 0 // Assuming streak is part of profile now, otherwise 0
  }), [user, profile]);

  const REMIND_OPTIONS = [
    { label: '5 Minutes Before', value: 5 },
    { label: '15 Minutes Before', value: 15 },
    { label: '30 Minutes Before', value: 30 },
    { label: '1 Hour Before', value: 60 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/10 custom-scrollbar overflow-y-auto">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-10 animate-in">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground text-sm">Real-time telemetry and upcoming competition schedule.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw size={14} className={`mr-2 ${loading && 'animate-spin'}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <Minimize2 size={14} className="mr-2" /> : <Maximize2 size={14} className="mr-2" />}
              {isSidebarOpen ? 'Hide Panels' : 'Show Panels'}
            </Button>
          </div>
        </div>

        {/* Top Section: Stats */}
        <section>
          {loading && !profile ? (
            <div className="h-64 luxury-card skeleton" />
          ) : (
            <StatsProfileCard user={userData} />
          )}
        </section>

        {/* Main Dashboard Grid */}
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Main Content Column */}
          <div className={`flex-1 space-y-10 transition-all duration-700 ease-out ${isSidebarOpen ? 'xl:w-[65%]' : 'xl:w-full'}`}>
            
            {/* Upcoming Contests */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold tracking-tight">Upcoming Contests</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-medium">
                  View Full Schedule <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>

              <div className={`grid grid-cols-1 gap-6 ${isSidebarOpen ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-48 luxury-card skeleton opacity-50" />
                  ))
                ) : contests.length > 0 ? (
                  contests.slice(0, 4).map((contest, index) => (
                    <ContestCard 
                      key={contest.id} 
                      contest={contest} 
                      onSetAlarm={handleSetAlarm} 
                      index={index} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center luxury-card border-dashed">
                    <p className="text-muted-foreground text-sm">No upcoming contests found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Submissions & History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
                 <RecentSubmissions />
              </div>
              <div className="space-y-6">
                 <h2 className="text-lg font-semibold tracking-tight">Rating Trajectory</h2>
                 <RatingHistoryChart />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full xl:w-[400px] space-y-8"
              >
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold tracking-tight">Consistency</h2>
                  <ActivityHeatmap />
                </div>

                {/* Profile Sync Section */}
                <div className="luxury-card p-6 space-y-6 bg-zinc-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <LinkIcon size={18} />
                      </div>
                      <h3 className="font-semibold text-sm">Platform Link</h3>
                    </div>
                    <Shield size={16} className="text-muted-foreground" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Unified Handle</label>
                      <input
                        className="w-full bg-white/[0.03] border border-white/5 focus:border-white/20 rounded-xl py-3 px-4 text-sm outline-none transition-all placeholder:text-zinc-700"
                        value={handleInput}
                        onChange={(e) => setHandleInput(e.target.value)}
                        placeholder="Enter Codeforces/LeetCode handle"
                      />
                    </div>
                    <Button 
                      onClick={() => syncProfile(handleInput.trim())}
                      disabled={!handleInput.trim() || profileBusy}
                      loading={profileBusy}
                      fullWidth
                      size="lg"
                    >
                      Sync Accounts
                    </Button>
                    
                    {profileMessage && (
                      <p className="text-xs text-center text-muted-foreground animate-pulse">
                        {profileMessage}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Synced</span>
                    <span className="text-xs font-medium">
                      {profile?.syncedAt ? new Date(profile.syncedAt).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>

                {/* External Nodes */}
                <div className="luxury-card p-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">External Resources</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: 'Codeforces', url: 'https://codeforces.com' },
                      { label: 'LeetCode', url: 'https://leetcode.com' },
                      { label: 'AtCoder', url: 'https://atcoder.jp' },
                      { label: 'Settings', url: '/settings' }
                    ].map(item => (
                      <a 
                        key={item.label} 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-all group"
                      >
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{item.label}</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Modal isOpen={alarmModalOpen} onClose={() => setAlarmModalOpen(false)} title="Configure Alarm">
        {selectedContest ? (
          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Contest</p>
              <p className="text-base font-semibold">{selectedContest.name}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {REMIND_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="secondary"
                  onClick={() => handleSaveAlarm(option.value)}
                  loading={savingAlarm}
                  className="justify-between"
                >
                  {option.label}
                  <Plus size={14} />
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
