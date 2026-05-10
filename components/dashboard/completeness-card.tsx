import Link from 'next/link';

import { Progress } from '@/components/ui/progress';
import { calculateCompleteness } from '@/lib/completeness';
import { getCompletenessData } from '@/lib/completeness-data';

type CompletenessCardProps = {
  userId: string;
  username: string;
};

const renderHintLabel = (label: string) => {
  const match = label.match(/(.*?)(\+\d+)(.*)/);
  if (!match) return label;
  const [, before, gain, after] = match;
  return (
    <>
      {before}
      <b style={{ color: 'var(--ink)' }}>{gain}</b>
      {after}
    </>
  );
};

export const CompletenessCard = async ({ userId, username }: CompletenessCardProps) => {
  const data = await getCompletenessData(userId);
  const { score, nextItem } = calculateCompleteness(data);

  return (
    <div className="rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="eyebrow">portfolio score</div>
        <div className="font-mono" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
          {score} / 100
        </div>
      </div>
      <Progress value={score} className="h-1.5" />
      {nextItem ? (
        <Link
          href={nextItem.href}
          className="mt-3 block hover:underline"
          style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
        >
          {renderHintLabel(nextItem.label)}
        </Link>
      ) : (
        <Link
          href={`/${username}`}
          className="mt-3 block hover:underline"
          style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
        >
          Profile complete. View your public page →
        </Link>
      )}
    </div>
  );
};
