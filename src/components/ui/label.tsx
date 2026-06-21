import * as React from 'react';
import { cn } from '../../lib/utils';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-[10px] text-surface-400 uppercase font-mono tracking-wider block font-semibold',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
