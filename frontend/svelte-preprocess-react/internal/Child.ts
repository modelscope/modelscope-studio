import React, { useEffect, useRef } from 'react';

export interface ChildProps {
  el: HTMLElement | undefined;
  __slot__: boolean;
}
const Child: React.FC<ChildProps> = ({ el }) => {
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
  return React.createElement('react-child', {
    ref,
    style: { display: 'contents' },
  });
};
export default Child;
