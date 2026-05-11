import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { calculateCompleteness, type CompletenessItemId } from '@/lib/completeness';
import { getCompletenessData } from '@/lib/completeness-data';

type ProfileChecklistCardProps = {
  userId: string;
  username: string;
};

const SHORT_LABEL: Record<CompletenessItemId, string> = {
  displayName: 'Display name',
  headline: 'Headline',
  bio: 'Bio (40+ chars)',
  avatar: 'Avatar URL',
  projects1: 'First project',
  projects3: '3 projects total',
  skills5: '5 skills total',
  experience1: 'First work entry',
  social1: 'Social link'
};

const scoreColor = (score: number): string => {
  if (score >= 80) return 'var(--brand)';
  if (score >= 50) return 'var(--ink)';
  return 'var(--warn)';
};

export const ProfileChecklistCard = async ({ userId, username }: ProfileChecklistCardProps) => {
  const data = await getCompletenessData(userId);
  const { score, items } = calculateCompleteness(data);
  const unmet = items.filter(item => !item.met).sort((a, b) => b.points - a.points);
  const complete = unmet.length === 0;

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: 'var(--brand)' }}
      />
      <div className="flex items-center justify-between">
        <div className="eyebrow">profile</div>
        <div className="font-mono" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
          {score} / 100
        </div>
      </div>
      <div
        className="mt-1 leading-none font-medium tabular-nums"
        style={{
          fontSize: 'var(--t-3xl)',
          letterSpacing: '-0.02em',
          color: scoreColor(score)
        }}
      >
        {score}
      </div>
      <Progress value={score} className="mt-3 h-2" />

      {complete ? (
        <Link
          href={`/${username}`}
          className="mt-4 flex items-center gap-1.5 hover:underline"
          style={{ fontSize: 'var(--t-sm)', color: 'var(--brand)' }}
        >
          Profile complete — view your public page
          <ArrowRight size={12} />
        </Link>
      ) : (
        <ul className="m-0 mt-4 flex list-none flex-col gap-0.5 p-0">
          {unmet.map(item => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="-mx-2 flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-[var(--paper-3)]"
              >
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 'var(--t-xs)',
                    color: 'var(--brand)',
                    minWidth: '2.25rem'
                  }}
                >
                  +{item.points}
                </span>
                <span style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
                  {SHORT_LABEL[item.id]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
