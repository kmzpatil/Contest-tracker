'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Bell, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Terminal,
  Zap,
  Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard, id: 'DSH' },
  { label: 'CALENDAR', href: '/calendar', icon: Calendar, id: 'CAL' },
  { label: 'ALARMS', href: '/alarms', icon: Bell, id: 'ALR' },
  { label: 'STATS', href: '/stats', icon: BarChart3, id: 'STT' },
  { label: 'PROFILE', href: '/profile', icon: User, id: 'PRF' },
  { label: 'SETTINGS', href: '/settings', icon: Settings, id: 'SET' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-[300px] h-screen sticky top-0 flex flex-col p-8 bg-surface/80 backdrop-blur-3xl border-r border-white/5 z-[100] shadow-[25px_0_50px_-12px_rgba(0,0,0,0.8)] lg:flex hidden overflow-hidden">
      {/* Ghost Background Logo */}
      <div className="absolute -left-10 top-20 text-[180px] font-black text-white/[0.01] pointer-events-none select-none rotate-90 whitespace-nowrap tracking-tighter">
        VOID_TRACK
      </div>

      <div className="flex items-center gap-5 mb-16 px-4 relative z-10">
        <div className="w-12 h-12 bg-black border-[1.5px] border-accent-cyan/60 rounded-xl flex items-center justify-center text-accent-cyan shadow-[0_0_20px_rgba(0,245,255,0.2)] group cursor-pointer hover:border-accent-cyan transition-all">
          <Terminal size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black uppercase tracking-[0.15em] text-white font-display leading-tight">VOID<span className="text-accent-cyan">TRACK</span></span>
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono mt-1">HUD_V_4.2.0_STABLE</span>
        </div>
      </div>

      <nav className="flex flex-col gap-3 flex-1 relative z-10">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 group relative border border-transparent ${
                isActive 
                  ? 'bg-white/[0.03] text-accent-cyan border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.02] hover:border-white/5'
              }`}
            >
              {/* Floating Tooltip */}
              <div className="absolute left-[calc(100%+1.5rem)] px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black text-accent-cyan tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-[110] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {item.label}
              </div>

              <div className={`relative ${isActive ? 'text-accent-cyan' : 'group-hover:text-white'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className="transition-transform group-hover:scale-110" />
                {isActive && (
                   <motion.div 
                     layoutId="icon-glow"
                     className="absolute inset-0 blur-[10px] bg-accent-cyan/50 -z-10"
                   />
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">{item.label}</span>
                <span className="text-[7px] font-bold text-slate-700 uppercase tracking-widest mt-0.5 font-mono group-hover:text-slate-500 transition-colors">ID_{item.id}</span>
              </div>
              
              {isActive && (
                <>
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/5 bg-accent-cyan shadow-[0_0_15px_rgba(0,245,255,0.8)] rounded-r-full"
                  />
                  <div className="ml-auto">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,245,255,1)] animate-pulse" />
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-4 mb-8 p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner group/user cursor-pointer hover:bg-black/60 transition-all">
          <div className="w-11 h-11 rounded-xl border border-accent-cyan/40 bg-accent-cyan/5 flex items-center justify-center font-black text-accent-cyan shadow-[0_0_15px_rgba(0,245,255,0.1)] group-hover/user:scale-105 transition-transform">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-white uppercase tracking-tight truncate group-hover/user:text-accent-cyan transition-colors">{user?.name || 'CITIZEN_01'}</div>
            <div className="flex items-center gap-2 mt-1">
              <Activity size={10} className="text-accent-green" />
              <div className="text-[8px] font-bold text-slate-600 truncate uppercase tracking-widest font-mono">NODE_ACTIVE_08</div>
            </div>
          </div>
          <Zap size={12} className="ml-auto text-slate-800 group-hover/user:text-accent-cyan transition-colors" />
        </div>
        
        <Button 
          variant="ghost" 
          fullWidth 
          onClick={logout} 
          className="justify-start text-slate-600 hover:text-accent-magenta hover:bg-accent-magenta/5 border-transparent hover:border-accent-magenta/20 py-6 rounded-2xl text-[9px] font-black tracking-[0.3em]"
        >
          <LogOut size={16} className="mr-4" />
          TERMINATE_SEQUENCE
        </Button>
      </div>
    </aside>
  );
}
