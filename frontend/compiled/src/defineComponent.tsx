import React from 'react';

export interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
  locale?: string;
  theme?: 'light' | 'dark';
}

export function defineComponent<P = {}, E = {}>(
  Atom: React.FC<P & CommonProps>
) {
  return Atom as typeof Atom & E;
}
