import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { useTargets } from '@utils/hooks/useTargets';

export const Div = sveltify<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    value?: string;
  }
>(({ slots: _slots, value, children, ...props }) => {
  const targets = useTargets(children);
  return (
    <div {...props}>{targets.length > 0 ? children : value || children}</div>
  );
});

export default Div;
