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

const tierColor: Record<Tier, string> = {
  ok: 'var(--brand)',
  warn: 'var(--warn)',
  danger: 'var(--danger)'
};

const tierBar: Record<Tier, string> = {
  ok: 'bg-[var(--brand)]',
  warn: 'bg-[var(--warn)]',
  danger: 'bg-[var(--danger)]'
};

export const AiUsageCard = async ({ userId }: AiUsageCardProps) => {
  const { used, limit } = await getAiUsageToday(userId);
  const remaining = Math.max(0, limit - used);
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const exhausted = remaining === 0;
  const t = tier(remaining, limit);

  return (
    <div className="rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
      <div className="flex items-center justify-between">
        <div className="eyebrow">ai usage</div>
        <div
          className="font-mono tabular-nums"
          style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
        >
          {used} / {limit}
        </div>
      </div>
      <Progress value={pct} className="mt-3 h-2" indicatorClassName={tierBar[t]} />
      <p
        className="m-0 mt-3"
        style={{
          fontSize: 'var(--t-sm)',
          color: exhausted ? 'var(--danger)' : tierColor[t]
        }}
      >
        {exhausted
          ? 'Daily limit reached — resets at 00:00 UTC.'
          : `${remaining} ${remaining === 1 ? 'request' : 'requests'} left today.`}
      </p>
    </div>
  );
};
