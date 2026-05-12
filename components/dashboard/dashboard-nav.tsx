'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  items: readonly { href: string; label: string }[];
  onItemClick?: () => void;
};

export function DashboardNav({ items, onItemClick }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn('justify-start', active && 'bg-paper-2 text-foreground')}
          >
            <Link href={item.href} aria-current={active ? 'page' : undefined} onClick={onItemClick}>
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
