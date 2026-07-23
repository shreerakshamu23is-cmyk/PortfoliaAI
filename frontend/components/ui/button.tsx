'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, type = 'button', ...props }, ref) => {
    const sizeMap = { sm: 'px-3 py-2 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3.5 text-base', icon: 'p-2 w-9 h-9' };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn('inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed', sizeMap[size], variant === 'primary' && 'btn-primary', variant === 'secondary' && 'btn-secondary', variant === 'outline' && 'btn-secondary', variant === 'ghost' && 'text-slate-300 hover:text-white hover:bg-white/[0.06] px-3 py-2', variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700', className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{leftIcon}{children}{rightIcon}</>}
      </button>
    );
  }
);
Button.displayName = 'Button';
