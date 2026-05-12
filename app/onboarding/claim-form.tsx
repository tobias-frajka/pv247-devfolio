'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { claimUsername } from '@/server-actions/username';

const ERROR_MESSAGES: Record<string, string> = {
  taken: 'That username is taken.',
  invalid: 'Invalid format. Lowercase letters, digits, hyphens; must start with a letter.'
};

export function ClaimForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (formData: FormData) => {
    setError(null);
    const value = String(formData.get('username') ?? '').trim();
    if (!value) {
      setError('Pick something first.');
      return;
    }
    startTransition(async () => {
      const result = await claimUsername(value);
      if (result && !result.ok) setError(ERROR_MESSAGES[result.code] ?? 'Something went wrong.');
    });
  };

  return (
    <form action={onSubmit} className="flex flex-col gap-3">
      <div className="focus-within:border-ring border-hairline bg-paper-2 flex items-stretch gap-0 overflow-hidden rounded-md border">
        <span className="text-ink-3 flex items-center px-3 font-mono text-sm">devfolio.app/</span>
        <input
          name="username"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          maxLength={20}
          placeholder="your-name"
          disabled={pending}
          className="text-foreground placeholder:text-ink-3 flex-1 bg-transparent py-3 pr-3 font-mono outline-none"
        />
      </div>
      {error && (
        <p className="text-danger m-0 text-sm" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? 'Claiming…' : 'Claim username'}
      </Button>
    </form>
  );
}
