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

const scoreColorClass = (score: number): string => {
  if (score >= 80) return 'text-brand';
  if (score >= 50) return 'text-ink';
  return 'text-warn';
};

export const ProfileChecklistCard = async ({ userId, username }: ProfileChecklistCardProps) => {
  const data = await getCompletenessData(userId);
  const { score, items } = calculateCompleteness(data);
  const unmet = items.filter(item => !item.met).sort((a, b) => b.points - a.points);
  const complete = unmet.length === 0;

  return (
    <div className="border-hairline-soft bg-paper-2 relative overflow-hidden rounded-lg border p-4">
      <div aria-hidden className="bg-brand absolute inset-x-0 top-0 h-[2px]" />
      <div className="flex items-center justify-between">
        <div className="eyebrow">profile</div>
        <div className="text-ink-3 font-mono text-xs">{score} / 100</div>
      </div>
      <div
        className={`mt-1 text-3xl leading-none font-medium tracking-tight tabular-nums ${scoreColorClass(score)}`}
      >
        {score}
      </div>
      <Progress value={score} className="mt-3 h-2" />

      {complete ? (
        <Link
          href={`/${username}`}
          className="text-brand mt-4 flex items-center gap-1.5 text-sm hover:underline"
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
                className="hover:bg-paper-3 -mx-2 flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors"
              >
                <span className="text-brand min-w-9 font-mono text-xs tabular-nums">
                  +{item.points}
                </span>
                <span className="text-ink-2 text-sm">{SHORT_LABEL[item.id]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
