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
          <label className="text-xs font-semibold text-zinc-400 px-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-700 transition-all duration-300 outline-none focus:border-zinc-500 focus:bg-zinc-900/50",
              error && "border-rose-500/50 focus:border-rose-500/50",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-[10px] font-semibold text-rose-500 px-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
