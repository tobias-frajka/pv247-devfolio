export const ProfileChecklistCardSkeleton = () => (
  <div className="border-hairline-soft bg-paper-2 relative overflow-hidden rounded-lg border p-4">
    <div aria-hidden className="bg-brand absolute inset-x-0 top-0 h-[2px]" />
    <div className="flex items-center justify-between">
      <div className="eyebrow">profile</div>
      <div className="skeleton-bone h-3 w-12 rounded-[4px]" />
    </div>
    <div className="skeleton-bone mt-2 h-9 w-16 rounded-[4px]" />
    <div className="skeleton-bone mt-3 h-2 w-full rounded-[4px]" />
    <div className="mt-4 flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton-bone h-3 w-8 rounded-[4px]" />
          <div className="skeleton-bone h-3 w-32 rounded-[4px]" />
        </div>
      ))}
    </div>
  </div>
);
