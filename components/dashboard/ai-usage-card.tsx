import { Progress } from '@/components/ui/progress';
import { getAiUsageToday } from '@/lib/queries/ai-usage';

type AiUsageCardProps = {
  userId: string;
};

type Tier = 'ok' | 'warn' | 'danger';

const tier = (remaining: number, limit: number): Tier => {
  const ratio = remaining / limit;
  if (ratio < 0.2) return 'danger';
  if (ratio < 0.5) return 'warn';
  return 'ok';
};

const tierTextClass: Record<Tier, string> = {
  ok: 'text-brand',
  warn: 'text-warn',
  danger: 'text-danger'
};

const tierBarClass: Record<Tier, string> = {
  ok: 'bg-brand',
  warn: 'bg-warn',
  danger: 'bg-danger'
};

export const AiUsageCard = async ({ userId }: AiUsageCardProps) => {
  const { used, limit } = await getAiUsageToday(userId);
  const remaining = Math.max(0, limit - used);
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const exhausted = remaining === 0;
  const t = tier(remaining, limit);

  return (
    <div className="border-hairline-soft bg-paper-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="eyebrow">ai usage</div>
        <div className="text-ink-3 font-mono text-xs tabular-nums">
          {used} / {limit}
        </div>
      </div>
      <Progress value={pct} className="mt-3 h-2" indicatorClassName={tierBarClass[t]} />
      <p className={`m-0 mt-3 text-sm ${exhausted ? 'text-danger' : tierTextClass[t]}`}>
        {exhausted
          ? 'Daily limit reached — resets at 00:00 UTC.'
          : `${remaining} ${remaining === 1 ? 'request' : 'requests'} left today.`}
      </p>
    </div>
  );
};
