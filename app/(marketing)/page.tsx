import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UsersShowcase, UsersShowcaseSkeleton } from '@/components/users-showcase';
import { ExampleButton } from '@/components/example-button';

const features = [
  {
    eyebrow: '01 — Editor',
    title: 'A form for every section',
    body: 'Profile, projects, skills, experience, links. Each one is its own page next to a live preview, and drafts save as you type.'
  },
  {
    eyebrow: '02 — AI assist',
    title: "AI for the parts you'd skip",
    body: "Stuck writing a bio? Need to make a project description sound less like a commit message? There's a button. You always edit and confirm before anything saves."
  },
  {
    eyebrow: '03 — Your page',
    title: 'Lives at devfolio.app/you',
    body: "Server-rendered HTML with proper OG tags, so it looks decent when you paste it into a CV, a tweet, or a recruiter's inbox. Loads in under 200ms."
  }
] as const;

export default function LandingPage() {
  return (
    <div className="bg-background min-h-full px-6 pb-20 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <section className="mx-auto max-w-[760px] pb-14 text-center">
          <div className="eyebrow mb-4">v0.4 · public beta</div>
          <h1
            className="m-0 leading-[1.02] font-medium tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            A portfolio site
            <br />
            made by devs, for devs.
          </h1>
          <p
            className="mt-5 leading-[1.5]"
            style={{ fontSize: 'var(--t-lg)', color: 'var(--ink-2)' }}
          >
            GitHub login, a few forms, a public page at{' '}
            <span className="text-foreground font-mono">
              devfolio.app/
              <span style={{ color: 'var(--primary)' }}>you</span>
            </span>
            . No HTML, no hosting, no CSS to argue about.
          </p>
          <div className="mx-auto mt-7 flex max-w-[420px] flex-col items-stretch gap-3">
            <Button size="lg" className="w-full" asChild>
              <Link href="/login">Sign in with GitHub →</Link>
            </Button>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2.5">
              <ExampleButton />
              <span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-sm)' }}>or</span>
              <Button size="lg" variant="outline" asChild>
                <Link href="/developers">Search developers</Link>
              </Button>
            </div>
          </div>
          <div
            className="mt-7 flex justify-center gap-6 font-mono"
            style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
          >
            <span>· free during beta</span>
            <span>· source on github</span>
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

        <Suspense fallback={<UsersShowcaseSkeleton />}>
          <UsersShowcase />
        </Suspense>

        <footer
          className="mt-16 text-center font-mono"
          style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
        >
          built with next.js · drizzle · turso · openrouter · for pv247 @ fi muni
        </footer>
      </div>
    </div>
  );
}
