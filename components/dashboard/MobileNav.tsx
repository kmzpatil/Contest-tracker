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
  User 
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Alarms', href: '/alarms', icon: Bell },
  { label: 'Stats', href: '/stats', icon: BarChart3 },
  { label: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-around px-2 z-[100] lg:hidden shadow-2xl">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all duration-300 flex-1 relative h-full ${
              isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-white/5' : ''
            }`}>
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            </div>
            
            {isActive && (
              <motion.div 
                layoutId="mobile-active-indicator"
                className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
