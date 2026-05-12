'use client';

import { useState } from 'react';
import { Dialog, VisuallyHidden } from 'radix-ui';
import { Menu, X } from 'lucide-react';

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/server-actions/account';

type Props = {
  items: readonly { href: string; label: string }[];
  cards?: React.ReactNode;
};

export function MobileNav({ items, cards }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Open navigation">
          <Menu size={20} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay-show fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="border-hairline bg-paper sheet-slide-in fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[80vw] flex-col overflow-y-auto border-r p-5 shadow-2xl outline-none">
          <VisuallyHidden.Root>
            <Dialog.Title>Dashboard navigation</Dialog.Title>
          </VisuallyHidden.Root>
          <div className="mb-8 flex items-center justify-between">
            <Logo size={24} />
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close navigation">
                <X size={18} />
              </Button>
            </Dialog.Close>
          </div>
          <DashboardNav items={items} onItemClick={() => setOpen(false)} />
          {cards ? (
            <div className="border-hairline-soft mt-6 flex flex-col gap-6 border-t pt-6">
              {cards}
            </div>
          ) : null}
          <div className="border-hairline-soft mt-6 border-t pt-4">
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
                Sign out
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
