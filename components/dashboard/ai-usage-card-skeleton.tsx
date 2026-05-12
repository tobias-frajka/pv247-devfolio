export const AiUsageCardSkeleton = () => (
  <div className="border-hairline-soft bg-paper-2 rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <div className="eyebrow">ai usage</div>
      <div className="skeleton-bone h-3 w-12 rounded-[4px]" />
    </div>
    <div className="skeleton-bone mt-3 h-2 w-full rounded-[4px]" />
    <div className="skeleton-bone mt-3 h-3 w-32 rounded-[4px]" />
  </div>
);
