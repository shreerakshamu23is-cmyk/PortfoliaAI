'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'indigo' | 'success' | 'outline' | 'purple' | 'amber';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', pulse = false, children, ...props }) => {
  const variantMap = {
    default: 'badge badge-indigo',
    indigo: 'badge badge-indigo',
    success: 'badge badge-emerald',
    outline: 'badge',
    purple: 'badge badge-purple',
    amber: 'badge badge-amber',
  };

  return (
    <span className={cn(variantMap[variant], className)} {...props}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
};
