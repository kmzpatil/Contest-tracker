import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '' }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function ContestCardSkeleton() {
  return (
    <div className={`${styles.cardSkeleton} glass`}>
      <div className={styles.row}>
        <Skeleton width="36px" height="36px" borderRadius="8px" />
        <div className={styles.col}>
          <Skeleton width="70%" height="18px" />
          <Skeleton width="50%" height="14px" />
        </div>
      </div>
      <Skeleton width="180px" height="40px" className={styles.timerSkeleton} />
      <div className={styles.row}>
        <Skeleton width="80px" height="32px" />
        <Skeleton width="120px" height="32px" />
      </div>
    </div>
  );
}
