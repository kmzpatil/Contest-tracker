'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPast: false
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="flex items-center gap-2 text-accent-green">
        <span className="live-indicator !bg-accent-green !shadow-[0_0_10px_var(--accent-green)]" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse font-display text-accent-green">CONTEST IS LIVE</span>
      </div>
    );
  }

  const pad = (num: number) => num.toString().padStart(2, '0');
  const displayHours = timeLeft.days > 0 ? (timeLeft.days * 24 + timeLeft.hours) : timeLeft.hours;

  return (
    <div className="font-mono flex items-center gap-1.5 text-white/90">
      <div className="flex flex-col items-center">
        <span className="text-sm font-black tracking-tighter leading-none">{pad(displayHours)}</span>
        <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">HR</span>
      </div>
      <span className="text-slate-700 font-bold mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-sm font-black tracking-tighter leading-none">{pad(timeLeft.minutes)}</span>
        <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">MIN</span>
      </div>
      <span className="text-slate-700 font-bold mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-sm font-black tracking-tighter leading-none text-accent-cyan">{pad(timeLeft.seconds)}</span>
        <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">SEC</span>
      </div>
    </div>
  );
}
