export const AiUsageCardSkeleton = () => (
  <div className="rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
    <div className="mb-2 flex items-center justify-between">
      <div className="eyebrow">ai usage</div>
      <div className="skeleton-bone h-3 w-10 rounded-[4px]" />
    </div>
    <div className="skeleton-bone h-1.5 w-full rounded-[4px]" />
    <div className="skeleton-bone mt-3 h-3 w-32 rounded-[4px]" />
  </div>
);
