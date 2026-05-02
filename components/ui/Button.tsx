import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  loading = false,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-accent-cyan/50",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white",
    danger: "bg-accent-magenta/10 hover:bg-accent-magenta/20 text-accent-magenta border border-accent-magenta/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm"
  };

  return (
    <button 
      className={cn(
        "relative flex items-center justify-center font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* HUD Accent Brackets on Hover */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/0 group-hover:border-white/40 transition-all duration-300 translate-x-1 translate-y-1" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/0 group-hover:border-white/40 transition-all duration-300 -translate-x-1 -translate-y-1" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <span className={cn("flex items-center gap-2", loading && "opacity-0")}>
        {children}
      </span>
    </button>
  );
}
