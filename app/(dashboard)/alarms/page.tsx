'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { requestNotificationPermission } from '@/lib/notifications';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, Trash2, ExternalLink, Cpu, AlarmClock } from 'lucide-react';

interface Alarm {
  _id: string;
  contestName: string;
  platform: string;
  contestUrl: string;
  startTime: string;
  remindAt: string;
  remindBefore: number;
}

export default function AlarmsPage() {
  const [permission, setPermission] = useState<string>('default');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlarms = useCallback(async () => {
    try {
      const res = await fetch('/api/alarms');
      if (res.ok) {
        const data = await res.json();
        setAlarms(data.alarms || []);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    fetchAlarms();
  }, [fetchAlarms]);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/alarms?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlarms(prev => prev.filter(a => a._id !== id));
      }
    } catch { /* ignore */ }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-accent-cyan/40 rounded-full" />
        <div className="flex items-center gap-3 text-accent-cyan mb-1">
          <Bell size={14} className="animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono">ACTIVE_ALERT_FEED_V.1</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display glitch-text">
          ACTIVE <span className="text-accent-cyan">ALERTS</span>
        </h1>
        <p className="text-slate-400 text-sm lg:text-base max-w-2xl leading-relaxed uppercase tracking-wide font-medium">
          Manage your scheduled execution windows. Configure node-specific notifications and ensure total synchronization with global contest feeds.
        </p>
      </header>

      {permission !== 'granted' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl border-accent-cyan/20 bg-accent-cyan/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <ShieldAlert size={80} className="text-accent-cyan" />
          </div>
          <div className="flex items-center gap-5 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="p-4 rounded-xl bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 font-mono">NOTIFICATION_SERVICE_OFFLINE</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">System requires browser permission for real-time alert dispatch.</p>
            </div>
          </div>
          <Button onClick={handleRequestPermission} className="h-12 px-10 rounded-xl bg-accent-cyan text-black font-black uppercase tracking-[0.2em] relative z-10 shrink-0">
            ENABLE_UPLINK
          </Button>
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 glass-card rounded-3xl border-white/5 border-dashed">
          <Cpu size={32} className="text-slate-700 animate-spin-slow" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono">SCANNING_ALERTS...</span>
        </div>
      ) : alarms.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 px-10 glass-card rounded-3xl border-white/5 border-dashed text-center group"
        >
          <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 group-hover:border-accent-cyan/30 transition-colors">
            <AlarmClock size={32} className="text-slate-700 group-hover:text-accent-cyan/50 transition-colors" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest mb-3">NO_ACTIVE_ALERTS</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-sm leading-relaxed">
            Your alert queue is empty. Access the dashboard nodes and deploy reminders to stay synchronized.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <AnimatePresence>
            {alarms.map((alarm, idx) => (
              <motion.div 
                key={alarm._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="glass-card hud-corners p-6 rounded-2xl border-white/5 hover:border-accent-cyan/30 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,245,255,1)] animate-pulse" />
                    <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] font-mono">NODE_ALERT_SCHEDULED</span>
                    <span className="ml-auto text-[10px] font-black text-slate-600 font-mono tracking-tighter">ID_{alarm._id.slice(-6).toUpperCase()}</span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 truncate group-hover:text-accent-cyan transition-colors">{alarm.contestName}</h3>
                  
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
                        {alarm.platform}
                      </div>
                      <div className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest">
                        {alarm.remindBefore}M_OFFSET
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                      SYNC_TIME: {formatTime(alarm.startTime)}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {alarm.contestUrl && (
                      <a href={alarm.contestUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="secondary" fullWidth className="h-10 rounded-xl border-white/10 text-[10px] font-black tracking-widest">
                          <ExternalLink size={14} className="mr-2" />
                          OPEN_GATEWAY
                        </Button>
                      </a>
                    )}
                    <Button 
                      variant="danger" 
                      className="h-10 px-4 rounded-xl border-accent-magenta/20 text-accent-magenta hover:bg-accent-magenta/5"
                      onClick={() => handleDelete(alarm._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
