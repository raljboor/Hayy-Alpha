import { Skeleton } from "@/components/ui/skeleton";

export const RoomCardSkeleton = () => (
  <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-soft">
    <Skeleton className="h-24 rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-9 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

export const ReferralCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-12 w-full" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-8 w-16 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-8 w-16" />
  </div>
);
