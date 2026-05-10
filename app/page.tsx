import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { UsersShowcase } from '@/components/users-showcase';
import { ExampleButton } from '@/components/example-button';

const features = [
  {
    eyebrow: '01 — Editor',
    title: 'Forms, not WYSIWYG',
    body: "Five sections. One field at a time. Validation that tells you exactly what's wrong."
  },
  {
    eyebrow: '02 — AI assist',
    title: 'Drafts, not autopilot',
    body: 'Bio generator, description polisher, title suggestions — every output is editable before it lands.'
  },
  {
    eyebrow: '03 — Public page',
    title: 'Server-rendered & fast',
    body: 'Real metadata. Real OG image. Loads in <200ms. Shareable on the day you sign up.'
  }
] as const;

export default function LandingPage() {
  return (
    <div className="bg-background flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-[1100px] px-10 pt-8 pb-20">
        <nav className="mb-16 flex items-center justify-between">
          <Logo size={28} />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="#">Examples</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#">Docs</a>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </nav>

        <section className="mx-auto max-w-[760px] pb-14 text-center">
          <div className="eyebrow mb-4">· now in beta · v0.4</div>
          <h1
            className="m-0 leading-[1.02] font-medium tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            A portfolio for developers,
            <br />
            not for designers.
          </h1>
          <p
            className="mt-5 leading-[1.5]"
            style={{ fontSize: 'var(--t-lg)', color: 'var(--ink-2)' }}
          >
            Sign in with GitHub. Fill out your projects, skills, and experience. Get a clean public
            page at{' '}
            <span className="text-foreground font-mono">
              devfolio.app/
              <span style={{ color: 'var(--primary)' }}>you</span>
            </span>
            . No CSS. No hosting. No Friday-night templates.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2.5">
            <Button size="lg" asChild>
              <Link href="/login">Sign in with GitHub →</Link>
            </Button>
            {/*<span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-sm)' }}>or</span>*/}
            <ExampleButton />
            <span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-sm)' }}>or</span>
            <Button size="lg" variant="outline" asChild>
              <Link href="/developers">Search developers</Link>
            </Button>
          </div>
          <div
            className="mt-7 flex justify-center gap-6 font-mono"
            style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
          >
            <span>· no credit card</span>
            <span>· export anytime</span>
            <span>· open source</span>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {features.map(f => (
            <Card
              key={f.eyebrow}
              className="gap-3 rounded-[14px] border-[var(--hairline)] bg-[var(--paper-2)] px-5 py-5"
            >
              <div className="eyebrow">{f.eyebrow}</div>
              <div className="font-medium tracking-[-0.01em]" style={{ fontSize: 'var(--t-lg)' }}>
                {f.title}
              </div>
              <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
                {f.body}
              </p>
            </Card>
          ))}
        </section>

        <Suspense fallback={null}>
          <UsersShowcase />
        </Suspense>

        <footer
          className="mt-16 text-center font-mono"
          style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
        >
          built with next.js · drizzle · turso · anthropic · for pv247 @ fi muni
        </footer>
      </div>
    </div>
  );
}
