'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const pathname = usePathname() ?? '/';
  const path = pathname.length > 64 ? pathname.slice(0, 61) + '…' : pathname;

  return (
    <div className="bg-background relative flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 0%, var(--brand-ghost), transparent 70%)'
        }}
      />

      <main className="relative mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center px-6 py-20">
        <div className="eyebrow mb-8 flex items-center gap-3">
          <span>· ERR_ROUTE_NOT_FOUND</span>
          <span style={{ color: 'var(--hairline)' }}>·</span>
          <span style={{ color: 'var(--ink-3)' }}>0x194</span>
        </div>

        <div className="mb-7 flex items-end gap-4">
          <h1
            className="m-0 font-mono leading-[0.9] font-medium tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(5rem, 16vw, 9.5rem)',
              color: 'var(--ink)'
            }}
          >
            404
          </h1>
          <span
            aria-hidden
            className="bg-primary mb-4 inline-block rounded-full"
            style={{
              width: 14,
              height: 14,
              boxShadow: '0 0 0 4px var(--brand-ghost)'
            }}
          />
        </div>

        <h2
          className="m-0 font-medium"
          style={{
            fontSize: 'var(--t-2xl)',
            letterSpacing: '-0.022em',
            color: 'var(--ink)'
          }}
        >
          We grep&apos;d the codebase. No matches.
        </h2>

        <p
          className="mt-3 mb-8 max-w-[52ch]"
          style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}
        >
          The path you tried doesn&apos;t resolve to a route in this app. Most likely a typo or a
          link that&apos;s gone stale. The portfolio you&apos;re looking for might also have been
          deleted, or never existed.
        </p>

        <div
          className="mb-8 overflow-hidden rounded-[10px] border font-mono"
          style={{
            background: 'var(--paper-2)',
            borderColor: 'var(--hairline)',
            fontSize: 'var(--t-sm)'
          }}
        >
          <div
            className="flex items-center gap-2 border-b px-3 py-1.5"
            style={{
              borderColor: 'var(--hairline-soft)',
              color: 'var(--ink-3)',
              fontSize: 'var(--t-xs)'
            }}
          >
            <span
              aria-hidden
              className="inline-block rounded-full"
              style={{ width: 8, height: 8, background: 'var(--danger)' }}
            />
            <span
              aria-hidden
              className="inline-block rounded-full"
              style={{ width: 8, height: 8, background: 'var(--warn)' }}
            />
            <span
              aria-hidden
              className="inline-block rounded-full"
              style={{ width: 8, height: 8, background: 'var(--brand)' }}
            />
            <span className="ml-2">~/devfolio — zsh</span>
          </div>
          <div className="px-4 py-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span style={{ color: 'var(--brand)' }}>$</span>
              <span style={{ color: 'var(--ink-2)' }}>resolve</span>
              <span style={{ color: 'var(--ink)' }}>devfolio.app{path}</span>
              <span aria-hidden className="not-found-cursor" />
            </div>
            <div className="mt-1 pl-4" style={{ color: 'var(--danger)' }}>
              → no such file or directory
            </div>
          </div>
        </div>

        <div className="mb-14 flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href="/">← Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/developers">Browse developers</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>

        <div
          aria-hidden
          className="mb-3 flex items-center gap-3 font-mono"
          style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
        >
          <span className="h-px flex-1" style={{ background: 'var(--hairline-soft)' }} />
          <span>stack trace (truncated)</span>
          <span className="h-px flex-1" style={{ background: 'var(--hairline-soft)' }} />
        </div>

        <pre
          className="m-0 overflow-x-auto font-mono leading-[1.7] whitespace-pre"
          style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
        >
          {`Error: Page not found
    at Router.match (app/router.ts:404:1)
    at Browser.navigate (window.location)
    at User.curiosity (https://you.are.here)
    at Reality.hours (life:23:59)`}
        </pre>
      </main>

      <style>{`
        .not-found-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1em;
          background: var(--ink);
          transform: translateY(2px);
          animation: not-found-blink 1.05s steps(2, end) infinite;
        }
        @keyframes not-found-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
