import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';

export default function NotFound() {
  return (
    <div className="bg-background flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20">
      <div className="flex flex-col gap-2 text-center">
        <PageTitle>Portfolio not found</PageTitle>
        <p className="text-ink-2 m-0 text-base">
          This portfolio doesn&apos;t exist. Check the URL or return to the home page.
        </p>
      </div>

      <Button asChild>
        <Link href="/">← Back to home</Link>
      </Button>
    </div>
  );
}
