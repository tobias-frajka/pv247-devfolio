import Link from 'next/link';
import { Suspense } from 'react';

import { AiUsageCard } from '@/components/dashboard/ai-usage-card';
import { AiUsageCardSkeleton } from '@/components/dashboard/ai-usage-card-skeleton';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { LinkCheckCard } from '@/components/dashboard/link-check/link-check-card';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { ProfileChecklistCard } from '@/components/dashboard/profile-checklist-card';
import { ProfileChecklistCardSkeleton } from '@/components/dashboard/profile-checklist-card-skeleton';
import { LogoLink } from '@/components/logo-link';
import { Button } from '@/components/ui/button';
import { requireUsername } from '@/lib/dal';
import { signOutAction } from '@/server-actions/account';

const NAV = [
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/skills', label: 'Skills' },
  { href: '/dashboard/experience', label: 'Experience' },
  { href: '/dashboard/socials', label: 'Socials' },
  { href: '/dashboard/settings', label: 'Settings' }
] as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUsername();

  const sidebarCards = (
    <>
      <Suspense fallback={<ProfileChecklistCardSkeleton />}>
        <ProfileChecklistCard userId={session.user.id} username={session.user.username} />
      </Suspense>
      <Suspense fallback={<AiUsageCardSkeleton />}>
        <AiUsageCard userId={session.user.id} />
      </Suspense>
      <LinkCheckCard />
    </>
  );

  return (
    <div className="bg-background flex min-h-full flex-1 flex-col lg:grid lg:min-h-full lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_320px]">
      <header className="border-hairline bg-paper flex items-center justify-between gap-3 border-b px-4 py-3 lg:hidden">
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <LogoLink size={20} />
          <Link
            href={`/${session.user.username}`}
            className="text-foreground max-w-full truncate font-mono text-xs hover:underline"
          >
            /{session.user.username}
          </Link>
        </div>
        <MobileNav items={NAV} cards={sidebarCards} />
      </header>

      <aside className="border-hairline bg-paper sticky top-0 hidden h-screen overflow-y-auto border-r px-5 py-6 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <LogoLink size={24} />
          <Link
            href={`/${session.user.username}`}
            className="text-foreground font-mono text-sm hover:underline"
          >
            /{session.user.username}
          </Link>
        </div>
        <DashboardNav items={NAV} />
        <div className="border-hairline-soft mt-8 border-t pt-4">
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 px-6 py-8 lg:px-10">{children}</main>

      <aside className="border-hairline bg-paper hidden border-l px-5 py-6 xl:block">
        <div className="flex flex-col gap-6">{sidebarCards}</div>
      </aside>
    </div>
  );
}
