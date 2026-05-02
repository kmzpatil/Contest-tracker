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
  Zap,
  Globe
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Alarms', href: '/alarms', icon: Bell },
  { label: 'Statistics', href: '/stats', icon: BarChart3 },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-[280px] h-screen sticky top-0 flex flex-col p-8 bg-background border-r border-white/5 z-[100] lg:flex hidden overflow-hidden">
      
      {/* Brand Section */}
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="w-10 h-10 bg-white text-background rounded-xl flex items-center justify-center">
          <Zap size={22} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-white leading-none">VoidTrack</span>
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-1">Competition Hub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-white/5 text-white' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-sm font-medium">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-dot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Footer */}
      <div className="mt-auto pt-8 space-y-6">
        <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-white/5">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 border border-white/5">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name || 'Anonymous'}</div>
            <div className="text-[10px] font-medium text-zinc-500 truncate flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </div>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={logout} 
          className="justify-start h-12 rounded-xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all border-transparent hover:border-rose-500/10"
        >
          <LogOut size={16} className="mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
