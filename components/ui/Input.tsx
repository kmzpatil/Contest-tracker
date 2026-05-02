import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-2", fullWidth && "w-full", className)}>
        {label && (
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              "w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all duration-300 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(0,255,255,0.1)]",
              error && "border-accent-magenta/50 focus:border-accent-magenta/50 shadow-[0_0_10px_rgba(255,0,255,0.05)]",
              className
            )}
            {...props}
          />
          {/* Animated focus underline */}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent-cyan transition-all duration-500 group-focus-within:w-full opacity-50" />
        </div>
        {error && (
          <span className="text-[10px] font-bold text-accent-magenta uppercase tracking-widest px-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
