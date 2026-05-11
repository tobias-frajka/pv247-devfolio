import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none placeholder:text-[var(--ink-3)] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Input };
