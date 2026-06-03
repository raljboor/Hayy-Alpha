// Helper to clone an icon element with a custom size
import { cloneElement, ReactElement } from 'react';

export function cloneIconWithSize(icon: React.ReactNode, size: number): React.ReactNode {
  if (!icon) return null;
  return cloneElement(icon as ReactElement, { size });
}
