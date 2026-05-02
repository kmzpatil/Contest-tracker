'use client';

import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 pb-32 lg:pb-10 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
