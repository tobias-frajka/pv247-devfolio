import { redirect } from 'next/navigation';

import { requireSession } from '@/lib/dal';

import { ClaimForm } from './claim-form';

export default async function OnboardingPage() {
  const session = await requireSession();
  if (session.user.username) redirect('/dashboard/profile');

  return (
    <div className="bg-background flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-[420px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="eyebrow">welcome, {session.user.name?.split(' ')[0]}</div>
          <h1 className="m-0 text-2xl font-medium tracking-[-0.02em]">Pick a username</h1>
          <p
            className="m-0 leading-[1.5]"
            style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
          >
            Your portfolio will live at{' '}
            <span className="text-foreground font-mono">devfolio.app/your-name</span>. 3–20
            characters, lowercase letters, digits, and hyphens. Must start with a letter.
          </p>
        </div>
        <ClaimForm />
      </div>
    </div>
  );
}
