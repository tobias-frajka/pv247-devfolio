import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex min-h-[80px] w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-[var(--ink-3)] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
