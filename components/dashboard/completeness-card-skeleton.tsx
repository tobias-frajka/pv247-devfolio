import { Progress } from '@/components/ui/progress';

export const CompletenessCardSkeleton = () => (
  <div className="rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
    <div className="mb-2 flex items-center justify-between">
      <div className="eyebrow">portfolio score</div>
      <div className="font-mono" style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}>
        — / 100
      </div>
    </div>
    <Progress value={0} className="h-1.5" />
    <div className="mt-3 h-[var(--t-sm)]" aria-hidden />
  </div>
);
