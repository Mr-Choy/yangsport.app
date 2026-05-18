import type { CSSProperties } from 'react';
import { ChevronStamp } from '../brand';

interface StampGridProps {
  stamps: number;
  threshold: number;
  cols?: number;
  newIndex?: number;
}

export function StampGrid({ stamps, threshold, cols = 5, newIndex = -1 }: StampGridProps) {
  const cells = [];
  const max = threshold;
  for (let i = 0; i < max; i++) {
    const filled = i < stamps;
    const isRedeem = stamps >= threshold && i === threshold - 1;
    const isNew = i === newIndex;
    cells.push(
      <div key={i}
           className={`stamp-cell ${filled ? 'is-filled' : ''} ${isRedeem ? 'is-redeem-target' : ''} ${isNew ? 'is-new' : ''}`}>
        <ChevronStamp size={26} filled={filled} />
      </div>
    );
  }
  return (
    <div className="stamp-grid" style={{ '--cols': cols } as CSSProperties}>
      {cells}
    </div>
  );
}
