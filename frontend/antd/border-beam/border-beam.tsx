import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { BorderBeam as ABorderBeam, type GetProps } from 'antd';

export const BorderBeam = sveltify<
  GetProps<typeof ABorderBeam> & {
    children?: React.ReactNode;
  }
>(({ children, className, style, id, ...props }) => {
  return (
    <ABorderBeam {...props}>
      {/*
        antd resolves the beam host by cloning its single child with a ref, but
        Svelte layout children arrive as bridge elements that expose no DOM
        node, so `useChildDom` would bail out and no beam would be rendered at
        all. Render the host ourselves instead: it has to be positioned because
        the beam is absolutely positioned inside it, and antd reads the beam
        border width and radius off its computed style, so `borderRadius` has to
        be set through `elem_style` to match the wrapped content.
      */}
      <div
        id={id}
        className={className}
        style={{ position: 'relative', display: 'inline-flex', ...style }}
      >
        {children}
      </div>
    </ABorderBeam>
  );
});

export default BorderBeam;
