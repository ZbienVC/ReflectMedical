import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      "animate-pulse rounded-xl bg-white/5",
      className
    )}
  />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-[#1C1C24] rounded-2xl p-5 border border-white/5 space-y-4", className)}>
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
  </div>
);

export const SkeletonRow: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center gap-4 px-5 py-4", className)}>
    <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-6 w-16 rounded-full" />
  </div>
);

export default Skeleton;
