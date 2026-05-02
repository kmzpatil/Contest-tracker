import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '12px', className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function ContestCardSkeleton() {
  return (
    <div className="luxury-card p-6 space-y-6 opacity-50">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Skeleton width="40px" height="40px" borderRadius="12px" />
          <div className="space-y-2">
            <Skeleton width="60px" height="12px" />
          </div>
        </div>
        <Skeleton width="40px" height="20px" borderRadius="20px" />
      </div>

      <div className="space-y-2">
        <Skeleton width="80%" height="24px" />
        <Skeleton width="40%" height="16px" />
      </div>

      <div className="mt-8 space-y-6">
        <Skeleton width="100%" height="56px" borderRadius="12px" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton width="100%" height="36px" borderRadius="12px" />
          <Skeleton width="100%" height="36px" borderRadius="12px" />
        </div>
      </div>
    </div>
  );
}
