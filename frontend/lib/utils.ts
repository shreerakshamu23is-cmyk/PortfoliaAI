import { clsx, type ClassValue } from 'clsx';

/**
 * Combines Tailwind CSS classes safely with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
