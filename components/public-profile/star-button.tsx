'use client';

import { Star } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { toggleStar } from '@/server-actions/stars';

type Props = {
  username: string;
  initialCount: number;
  initialStarred: boolean;
  canStar: boolean;
};

export function StarButton({ username, initialCount, initialStarred, canStar }: Props) {
  const [state, applyOptimistic] = useOptimistic<
    { count: number; starred: boolean },
    { starred: boolean }
  >({ count: initialCount, starred: initialStarred }, (current, next) => ({
    starred: next.starred,
    count: current.count + (next.starred ? 1 : -1)
  }));
  const [pending, start] = useTransition();

  const label = state.starred ? 'Starred' : 'Star';

  return (
    <Button
      type="button"
      variant={state.starred ? 'default' : 'outline'}
      size="sm"
      disabled={!canStar || pending}
      aria-pressed={state.starred}
      aria-label={`${label} ${username}`}
      title={canStar ? label : 'You cannot star your own profile'}
      onClick={() =>
        start(async () => {
          applyOptimistic({ starred: !state.starred });
          await toggleStar({ username });
        })
      }
    >
      <Star size={14} className={state.starred ? 'fill-current' : ''} />
      <span>{state.count}</span>
      <span>{label}</span>
    </Button>
  );
}
