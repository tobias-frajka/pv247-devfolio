'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getRandomUser } from '@/server-actions/user';

export function ExampleButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    startTransition(async () => {
      const username = await getRandomUser();
      if (username) {
        router.push(`/${username}`);
      }
    });
  };

  return (
    <Button size="lg" variant="outline" onClick={handleClick} disabled={isPending}>
      {isPending ? 'Loading...' : 'See an example'}
    </Button>
  );
}
