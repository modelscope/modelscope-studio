import React from 'react';
import type { Components } from 'react-markdown';

export const Anchor: Components['a'] = ({ children, href }) => {
  if (children) {
    return (
      <a
        target="_blank"
        href={href}
        onMouseDown={(e) => e.stopPropagation()}
        rel="noreferrer"
      >
        {React.Children.toArray(children)[0]}
      </a>
    );
  } else {
    return <>{'[](' + href + ')'}</>;
  }
};
