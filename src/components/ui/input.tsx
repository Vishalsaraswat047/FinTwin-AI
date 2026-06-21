import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  prefix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, icon, prefix, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-[10px] text-surface-400 uppercase font-mono tracking-wider block font-semibold">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-primary-400 transition-colors pointer-events-none">
              {icon}
            </div>
          )}
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-bold font-mono text-xs pointer-events-none select-none">
              {prefix}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'w-full bg-surface-900 border text-surface-100 px-3.5 py-3 rounded-xl focus:outline-none transition-all duration-200 text-xs font-mono placeholder:text-surface-600',
              icon && 'pl-10',
              prefix && 'pl-8',
              error
                ? 'border-danger/50 focus:border-danger focus:ring-2 focus:ring-danger/20'
                : 'border-surface-700/60 hover:border-surface-600/60 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/15',
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/5 group-focus-within:ring-primary-500/20 transition-all" />
        </div>
        {error && <p className="text-[10px] text-danger font-mono flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-danger" />{error}</p>}
        {hint && !error && <p className="text-[10px] text-surface-500 font-mono">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
