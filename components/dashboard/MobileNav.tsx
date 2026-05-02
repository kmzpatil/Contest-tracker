'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Bell, 
  BarChart3, 
  User, 
  Settings 
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'DASH', href: '/dashboard', icon: LayoutDashboard, id: 'DSH' },
  { label: 'CAL', href: '/calendar', icon: Calendar, id: 'CAL' },
  { label: 'ALRT', href: '/alarms', icon: Bell, id: 'ALR' },
  { label: 'DATA', href: '/stats', icon: BarChart3, id: 'STT' },
  { label: 'CORE', href: '/profile', icon: User, id: 'PRF' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-18 bg-surface/80 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-around px-4 z-[100] lg:hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border-b-accent-cyan/20">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-500 relative group flex-1 ${
              isActive ? 'text-accent-cyan' : 'text-slate-500'
            }`}
          >
            <div className={`relative p-2.5 rounded-xl transition-all duration-500 ${
              isActive ? 'bg-white/[0.03] shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]' : 'group-hover:text-white'
            }`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className="relative z-10 transition-transform group-active:scale-90" />
              
              {isActive && (
                <motion.div 
                  layoutId="mobile-icon-glow"
                  className="absolute inset-0 blur-[12px] bg-accent-cyan/30 rounded-xl"
                />
              )}
            </div>
            
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 font-mono ${
              isActive ? 'opacity-100 text-accent-cyan' : 'opacity-40 group-hover:opacity-100'
            }`}>
              {item.label}
            </span>
            
            {isActive && (
              <motion.div 
                layoutId="mobile-active-dot"
                className="absolute -bottom-1 w-1.5 h-1.5 bg-accent-cyan rounded-full shadow-[0_0_10px_rgba(0,245,255,1)]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
