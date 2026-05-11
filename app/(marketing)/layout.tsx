import type { ReactNode } from 'react';

import { PageTransition } from '@/components/page-transition';
import { SiteHeader } from '@/components/site-header';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="px-6 pt-10 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <SiteHeader />
        </div>
      </div>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
