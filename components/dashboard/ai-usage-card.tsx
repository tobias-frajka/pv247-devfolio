import { Progress } from '@/components/ui/progress';
import { getAiUsageToday } from '@/lib/queries/ai-usage';

type AiUsageCardProps = {
  userId: string;
};

export const AiUsageCard = async ({ userId }: AiUsageCardProps) => {
  const { used, limit } = await getAiUsageToday(userId);
  const remaining = Math.max(0, limit - used);
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const exhausted = remaining === 0;

  return (
    <div className="rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="eyebrow">ai usage</div>
        <div className="font-mono" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
          {used} / {limit}
        </div>
      </div>
      <Progress value={pct} className="h-1.5" />
      <p
        className="m-0 mt-3"
        style={{
          fontSize: 'var(--t-sm)',
          color: exhausted ? 'var(--danger)' : 'var(--ink-2)'
        }}
      >
        {exhausted
          ? 'Daily limit reached — resets at 00:00 UTC.'
          : `${remaining} ${remaining === 1 ? 'request' : 'requests'} left today.`}
      </p>
    </div>
  );
};
