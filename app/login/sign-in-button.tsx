'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function SignInButton() {
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    setPending(true);
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard'
      });
    } catch {
      setPending(false);
    }
  };

  return (
    <Button size="lg" disabled={pending} onClick={onClick}>
      {pending ? 'Redirecting…' : 'Continue with GitHub →'}
    </Button>
  );
}
