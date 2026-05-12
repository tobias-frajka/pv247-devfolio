'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function SignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setError(null);
    setPending(true);
    // Better Auth returns { data, error } via better-fetch — failures don't throw,
    // they resolve with `error` populated. On success the server hands back a
    // redirect URL and the client navigates, so reaching the post-await line at all
    // means something went wrong.
    try {
      const result = await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard'
      });
      if (result?.error) {
        setError(result.error.message ?? 'Sign-in failed. Try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed. Try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Button size="lg" disabled={pending} onClick={onClick}>
        {pending ? 'Redirecting…' : 'Continue with GitHub →'}
      </Button>
      {error && (
        <p className="text-danger m-0 text-center text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
