import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

// Extend HTMLMotionProps<'button'> to support both framer-motion props and standard button elements
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-display font-medium rounded-xl transition-all outline-none focus:ring-2 focus:ring-accent-violet/30 cursor-pointer select-none';
    
    const variants = {
      primary: 'bg-accent-violet text-white shadow-[0_8px_20px_-6px_rgba(139,92,246,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(139,92,246,0.55)]',
      secondary: 'bg-secondary border border-border text-text-main hover:bg-border/30',
      outline: 'bg-transparent border border-border hover:border-accent-violet hover:text-accent-violet text-text-main',
      glass: 'bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 text-text-main hover:bg-white/20 dark:hover:bg-black/40',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs rounded-lg',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3 text-base rounded-2xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98, y: 0 }}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
