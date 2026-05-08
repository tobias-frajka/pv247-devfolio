'use client';

import * as React from 'react';
import { Label } from 'radix-ui';

import { cn } from '@/lib/utils';

function LabelRoot({ className, ...props }: React.ComponentProps<typeof Label.Root>) {
  return (
    <Label.Root
      className={cn(
        'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}

export { LabelRoot as Label };
