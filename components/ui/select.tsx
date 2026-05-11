'use client';

import * as React from 'react';
import { Select } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const SelectRoot = Select.Root;
const SelectGroup = Select.Group;
const SelectValue = Select.Value;

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Select.Trigger>) {
  return (
    <Select.Trigger
      data-slot="select-trigger"
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-md border border-[var(--hairline)] bg-transparent px-3 text-[length:var(--t-sm)] text-[var(--ink-2)] transition-colors outline-none',
        'hover:bg-[var(--paper-3)] hover:text-[var(--ink)]',
        'focus-visible:border-[var(--brand)] focus-visible:ring-2 focus-visible:ring-[var(--brand-ghost)]',
        'data-[placeholder]:text-[var(--ink-3)]',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <Select.Icon asChild>
        <ChevronDown
          size={14}
          className="ml-1 text-[var(--ink-3)] transition-transform duration-150 data-[state=open]:rotate-180"
          aria-hidden
        />
      </Select.Icon>
    </Select.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof Select.Content>) {
  return (
    <Select.Portal>
      <Select.Content
        data-slot="select-content"
        position={position}
        sideOffset={6}
        className={cn(
          'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--paper-2)] p-1 shadow-lg outline-none',
          className
        )}
        {...props}
      >
        <Select.Viewport className="p-0">{children}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item
      data-slot="select-item"
      className={cn(
        'relative flex cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 text-[length:var(--t-sm)] text-[var(--ink)] outline-none select-none',
        'focus:bg-[var(--paper-3)] data-[highlighted]:bg-[var(--paper-3)]',
        'data-[state=checked]:text-[var(--brand)]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 inline-flex h-4 w-4 items-center justify-center">
        <Select.ItemIndicator>
          <Check size={14} aria-hidden />
        </Select.ItemIndicator>
      </span>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof Select.Separator>) {
  return (
    <Select.Separator
      className={cn('-mx-1 my-1 h-px bg-[var(--hairline-soft)]', className)}
      {...props}
    />
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof Select.Label>) {
  return (
    <Select.Label className={cn('eyebrow m-0 px-2 py-1.5 select-none', className)} {...props} />
  );
}

export {
  SelectRoot,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectLabel
};
