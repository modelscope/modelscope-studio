import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import type { MarkdownProps } from '@globals/components';
import { Markdown as BaseMarkdown } from '@globals/components';
import { useTargets } from '@utils/hooks/useTargets';

export const Markdown = sveltify<
  MarkdownProps,
  [
    // list
    'copyButtons',
  ]
>(({ copyButtons, children, ...props }) => {
  const copyTargets = useTargets(children, 'copyButtons');

  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <BaseMarkdown
        {...props}
        copyButtons={
          copyTargets.length > 0
            ? copyTargets.map((target, i) => (
                <ReactSlot slot={target} key={i} clone />
              ))
            : copyButtons
        }
      />
    </>
  );
});

export default Markdown;
