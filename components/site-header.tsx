import Link from 'next/link';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <nav className="mb-16 flex items-center justify-between">
      <Link href="/" aria-label="DevFolio home">
        <Logo size={28} />
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/developers">Browse developers</Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </nav>
  );
}
