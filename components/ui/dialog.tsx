'use client';

import * as React from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const DialogRoot = Dialog.Root;
const DialogTrigger = Dialog.Trigger;
const DialogClose = Dialog.Close;

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm', className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <DialogOverlay />
      <Dialog.Content
        className={cn(
          'border-hairline bg-paper fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-2xl outline-none',
          'max-h-[90vh] overflow-y-auto',
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="text-ink-3 hover:text-ink focus-visible:ring-ring absolute top-4 right-4 rounded-sm p-1 outline-none focus-visible:ring-2">
          <X size={16} />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-5 flex flex-col gap-1', className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title className={cn('text-base font-medium', className)} {...props} />;
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description className={cn('text-ink-2 m-0 text-sm', className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-5 flex justify-end gap-2', className)} {...props} />;
}

export {
  DialogRoot,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
};
