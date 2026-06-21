import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold font-mono tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 active:scale-[0.98]',
        secondary:
          'bg-surface-800 text-surface-200 hover:bg-surface-700 hover:text-white border border-surface-700/50 hover:border-surface-600/50 active:scale-[0.98]',
        outline:
          'border border-surface-700/60 bg-transparent text-surface-300 hover:text-white hover:bg-surface-800 hover:border-surface-600/60 active:scale-[0.98]',
        ghost:
          'text-surface-400 hover:text-white hover:bg-surface-800/50 active:scale-[0.98]',
        danger:
          'bg-gradient-to-r from-rose-600 to-rose-700 text-white hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/20 active:scale-[0.98]',
        success:
          'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-600/20 active:scale-[0.98]',
        accent:
          'bg-gradient-to-r from-accent-500 to-cyan-600 text-white hover:from-accent-400 hover:to-accent-500 shadow-lg shadow-accent-500/20 active:scale-[0.98]',
        link:
          'text-primary-400 underline-offset-4 hover:underline hover:text-primary-300',
      },
      size: {
        sm: 'h-8 px-3 py-1.5 text-[10px] rounded-lg',
        md: 'h-9 px-4 py-2 text-xs',
        lg: 'h-11 px-6 py-2.5 text-sm rounded-xl',
        xl: 'h-13 px-8 py-3 text-sm rounded-2xl',
        icon: 'h-9 w-9 p-0 rounded-lg',
        'icon-sm': 'h-8 w-8 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
