'use client';

import type { ReactNode } from 'react';
import { Icon } from '../icons';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  fullHeight?: boolean;
}

export function Sheet({ open, onClose, title, children, fullHeight = false }: SheetProps) {
  if (!open) return null;
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" style={fullHeight ? { height: '92%' } : undefined}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="sheet-title">{title}</div>
          <button className="ys-iconbtn" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32 }}>
            <Icon.x width="16" height="16" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
