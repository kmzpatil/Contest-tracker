'use client';

import React, { useState } from 'react';
import { Contest } from '@/lib/contestApi';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';

interface CalendarGridProps {
  contests: Contest[];
}

export function CalendarGrid({ contests }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const getContestsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toDateString();
    return contests.filter(c => new Date(c.startTime).toDateString() === dateStr);
  };

  const renderCells = () => {
    const cells = [];
    
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[120px] bg-white/[0.01] border border-white/5 rounded-2xl opacity-20" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayContests = getContestsForDay(day);
      const active = isToday(day);
      
      cells.push(
        <motion.div 
          key={`day-${day}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          className={`group min-h-[120px] p-3 glass-card hud-corners rounded-2xl border-white/5 relative transition-all duration-300 hover:border-accent-cyan/30 hover:bg-white/[0.03] ${
            active ? 'border-accent-cyan/40 bg-accent-cyan/5' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-black font-mono transition-colors ${
              active ? 'text-accent-cyan' : 'text-slate-500 group-hover:text-slate-300'
            }`}>
              {day < 10 ? `0${day}` : day}
            </span>
            {active && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,245,255,1)] animate-pulse" />
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {dayContests.slice(0, 4).map((contest, idx) => (
              <div 
                key={idx} 
                className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-transform hover:scale-125 cursor-pointer" 
                style={{ 
                  backgroundColor: contest.platformColor,
                  boxShadow: `0 0 10px ${contest.platformColor}80`
                }}
                title={contest.name}
              />
            ))}
            {dayContests.length > 4 && (
              <span className="text-[7px] font-black text-slate-500 font-mono">+{dayContests.length - 4}</span>
            )}
          </div>

          <AnimatePresence>
            {dayContests.length > 0 && (
              <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 pointer-events-none group-hover:translate-y-0 z-20">
                <div className="glass-card p-3 rounded-xl border-accent-cyan/20 bg-void/90 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                    <Activity size={10} className="text-accent-cyan" />
                    <span className="text-[8px] font-black text-accent-cyan uppercase tracking-widest font-mono">NODE_DETAILS</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dayContests.map(c => (
                      <div key={c.id} className="flex items-start gap-2">
                         <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: c.platformColor }} />
                         <span className="text-[9px] font-bold text-slate-300 leading-tight truncate uppercase">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    return cells;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between glass-card p-6 rounded-3xl border-white/5">
        <button 
          onClick={prevMonth} 
          className="p-3 rounded-xl bg-white/5 hover:bg-accent-cyan hover:text-black transition-all group"
        >
          <ChevronLeft size={20} className="group-active:-translate-x-1 transition-transform" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] font-display">
            {monthNames[month]} <span className="text-accent-cyan">{year}</span>
          </h2>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-0.5 bg-accent-cyan/20 rounded-full" />
            ))}
          </div>
        </div>
        <button 
          onClick={nextMonth} 
          className="p-3 rounded-xl bg-white/5 hover:bg-accent-cyan hover:text-black transition-all group"
        >
          <ChevronRight size={20} className="group-active:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} className="py-4 text-center">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {renderCells()}
      </div>
    </div>
  );
}
