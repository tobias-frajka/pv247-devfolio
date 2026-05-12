import Link from 'next/link';

import { LogoLink } from '@/components/logo-link';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/dal';

export async function SiteHeader() {
  const session = await getSession();

  return (
    <nav className="mb-16 flex items-center justify-between">
      <LogoLink size={28} />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/developers">Browse developers</Link>
        </Button>
        {session ? (
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/profile">Dashboard</Link>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
