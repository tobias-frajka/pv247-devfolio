import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UsersShowcase, UsersShowcaseSkeleton } from '@/components/users-showcase';
import { ExampleButton } from '@/components/example-button';
import { getSession } from '@/lib/dal';

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

export default async function LandingPage() {
  const session = await getSession();
  const username = session?.user.username ?? null;

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
          <p className="text-ink-2 mt-5 text-lg leading-[1.5]">
            GitHub login, a few forms, a public page at{' '}
            <span className="text-foreground font-mono">
              devfolio.app/
              <span className="text-primary">you</span>
            </span>
            . No HTML, no hosting, no CSS to argue about.
          </p>
          <div className="mx-auto mt-7 flex max-w-[420px] flex-col items-stretch gap-3">
            {username ? (
              <Button size="lg" className="w-full" asChild>
                <Link href="/dashboard/profile">Open dashboard →</Link>
              </Button>
            ) : (
              <Button size="lg" className="w-full" asChild>
                <Link href="/login">Sign in with GitHub →</Link>
              </Button>
            )}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2.5">
              <ExampleButton />
              <span className="text-ink-3 text-sm">or</span>
              {username ? (
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/${username}`}>View your profile</Link>
                </Button>
              ) : (
                <Button size="lg" variant="outline" asChild>
                  <Link href="/developers">Search developers</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="text-ink-3 mt-7 flex justify-center gap-6 font-mono text-xs">
            <span>· free during beta</span>
            <span>· source on github</span>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {features.map(f => (
            <Card
              key={f.eyebrow}
              className="border-hairline bg-paper-2 gap-3 rounded-[14px] px-5 py-5"
            >
              <div className="eyebrow">{f.eyebrow}</div>
              <div className="text-lg font-medium tracking-[-0.01em]">{f.title}</div>
              <p className="text-ink-2 m-0 text-sm">{f.body}</p>
            </Card>
          ))}
        </section>

        <Suspense fallback={<UsersShowcaseSkeleton />}>
          <UsersShowcase />
        </Suspense>

        <footer className="text-ink-3 mt-16 text-center font-mono text-xs">
          built with next.js · drizzle · turso · openrouter · for pv247 @ fi muni
        </footer>
      </div>
    </div>
  );
}
