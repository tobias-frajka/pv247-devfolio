import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-background flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20">
      <div className="flex flex-col gap-2 text-center">
        <h1
          className="m-0 font-medium"
          style={{ fontSize: 'var(--t-3xl)', letterSpacing: '-0.022em' }}
        >
          Portfolio not found
        </h1>
        <p className="m-0" style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}>
          This portfolio doesn&apos;t exist. Check the URL or return to the home page.
        </p>
      </div>

      <Button asChild>
        <Link href="/">← Back to home</Link>
      </Button>
    </div>
  );
}
