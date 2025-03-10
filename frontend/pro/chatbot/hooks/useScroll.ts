import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { BubbleListRef } from '@ant-design/x/es/bubble/BubbleList';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';

import type { ChatbotMessages } from '../type';

export interface useScrollOptions {
  autoScroll?: boolean;
  ref: React.MutableRefObject<BubbleListRef | null>;
  value: ChatbotMessages;
}

export function useScroll(options: useScrollOptions) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const prevMessageLengthRef = useRef(0);
  const canScrollRef = useRef(true);
  const { autoScroll, ref, value } = options;

  const scrollToBottom = useMemoizedFn(() => {
    if (!ref.current) {
      return;
    }
    ref.current.scrollTo({
      offset: ref.current.nativeElement.scrollHeight,
    });
    setShowScrollButton(false);
  });
  const isAtBottom = useMemoizedFn(() => {
    if (!ref.current) {
      return false;
    }
    const container = ref.current.nativeElement;
    const currentScrollHeight = container.scrollHeight;

    const { scrollTop, clientHeight } = container;
    return currentScrollHeight - (scrollTop + clientHeight) < 100;
  });
  // update when value changed
  useEffect(() => {
    if (ref.current && autoScroll) {
      if (value.length !== prevMessageLengthRef.current) {
        canScrollRef.current = true;
      }
      if (canScrollRef.current) {
        scrollToBottom();
      } else {
        if (!isAtBottom()) {
          setShowScrollButton(true);
        }
      }
      prevMessageLengthRef.current = value.length;
    }
  }, [value, ref, autoScroll, scrollToBottom, isAtBottom]);

  useEffect(() => {
    if (ref.current && autoScroll) {
      const el = ref.current.nativeElement;
      let lastScrollTop = 0;
      const handleScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        // user scroll up
        if (target.scrollTop < lastScrollTop) {
          canScrollRef.current = false;
        } else {
          if (isAtBottom()) {
            canScrollRef.current = true;
          }
        }
        lastScrollTop = target.scrollTop;
        if (isAtBottom()) {
          setShowScrollButton(false);
        }
      };

      el.addEventListener('scroll', handleScroll);
      return () => {
        el.removeEventListener('scroll', handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    showScrollButton,
    scrollToBottom,
  };
}
