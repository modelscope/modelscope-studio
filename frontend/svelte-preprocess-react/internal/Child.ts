import React, { useEffect, useRef } from 'react';

export interface ChildProps {
  el: HTMLElement | undefined;
  __slot__: boolean;
  children?: React.ReactNode[];
}
const Child: React.FC<ChildProps> = ({ el, children }) => {
  const ref = useRef<HTMLElement>();
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (el) {
      el.style.display = 'contents';
      ref.current.appendChild(el);
    }
  }, [el]);
  return React.createElement(
    'react-child',
    {
      ref,
      style: { display: 'contents' },
    },
    ...(children || [])
  );
};
export default Child;
