'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 custom-scrollbar h-[calc(100vh-80px)] overflow-y-auto">
      {/* Profile Card Skeleton */}
      <div className="glass-card p-8 rounded-2xl h-48 animate-pulse flex items-center gap-10">
        <div className="w-32 h-32 rounded-full bg-white/5 shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-white/5 rounded-lg w-1/3" />
          <div className="h-4 bg-white/5 rounded-lg w-1/2" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="h-16 bg-white/5 rounded-xl" />
            <div className="h-16 bg-white/5 rounded-xl" />
            <div className="h-16 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Contests Skeleton */}
        <div className="xl:col-span-8 space-y-6">
          <div className="h-8 bg-white/5 rounded-lg w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="xl:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl h-64 animate-pulse" />
          <div className="glass-card p-6 rounded-2xl h-48 animate-pulse" />
        </div>
      </div>
      
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-sm tracking-[0.5em] animate-pulse">
          INITIALIZING_VOID_INTERFACE...
        </div>
      </div>
    </div>
  );
}
