import { redirect } from 'next/navigation';

import { getSession } from '@/lib/dal';

import { SignInButton } from './sign-in-button';

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect(session.user.username ? '/dashboard/profile' : '/onboarding');
  }

  return (
    <div className="bg-background flex flex-1 flex-col items-center justify-center px-6 pb-10">
      <div className="flex w-full max-w-[380px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-2xl font-medium tracking-[-0.02em]">Sign in to DevFolio</h1>
          <p
            className="m-0 leading-[1.5]"
            style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
          >
            We use GitHub to authenticate. Your portfolio lives at devfolio.app/your-name.
          </p>
        </div>
        <SignInButton />
      </div>
    </div>
  );
}
