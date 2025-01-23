import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';

export const Span = sveltify<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > & {
    value?: string;
  }
>(({ slots: _slots, value, children, ...props }) => {
  const targets = useTargets(children);
  return (
    <span {...props}>{targets.length > 0 ? children : value || children}</span>
  );
});

export default Span;
