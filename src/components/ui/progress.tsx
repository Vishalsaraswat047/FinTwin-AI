import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: 'primary' | 'success' | 'warning' | 'danger';
  }
>(({ className, value, variant = 'primary', ...props }, ref) => {
  const gradientMap = {
    primary: 'from-primary-500 to-primary-400',
    success: 'from-emerald-500 to-emerald-400',
    warning: 'from-warning to-amber-400',
    danger: 'from-danger to-rose-400',
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-surface-800/60',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
          gradientMap[variant]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
