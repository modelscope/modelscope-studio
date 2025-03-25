import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { BubbleListRef } from '@ant-design/x/es/bubble/BubbleList';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';

import type { ChatbotMessages } from '../type';

export interface useScrollOptions {
  autoScroll?: boolean;
  scrollButtonOffset?: number;
  ref: React.MutableRefObject<BubbleListRef | null>;
  value: ChatbotMessages;
}

export function useScroll(options: useScrollOptions) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const prevMessageLengthRef = useRef(0);
  const canScrollRef = useRef(true);
  const isProgrammaticScroll = useRef(true);
  const { autoScroll, scrollButtonOffset, ref, value } = options;

  const scrollToBottom = useMemoizedFn(
    (behavior: ScrollBehavior = 'instant') => {
      if (!ref.current) {
        return;
      }
      isProgrammaticScroll.current = true;
      ref.current.scrollTo({
        offset: ref.current.nativeElement.scrollHeight,
        behavior,
      });

      setShowScrollButton(false);
    }
  );
  const isAtBottom = useMemoizedFn((offset: number = 100) => {
    if (!ref.current) {
      return false;
    }
    const container = ref.current.nativeElement;
    const currentScrollHeight = container.scrollHeight;

    const { scrollTop, clientHeight } = container;
    return currentScrollHeight - (scrollTop + clientHeight) < offset;
  });

  // update when value changed
  useEffect(() => {
    if (ref.current && autoScroll && value.length) {
      if (value.length !== prevMessageLengthRef.current) {
        canScrollRef.current = true;
      }
      if (canScrollRef.current) {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      }
      prevMessageLengthRef.current = value.length;
    }
  }, [value, ref, autoScroll, scrollToBottom, isAtBottom]);

  useEffect(() => {
    if (ref.current && autoScroll) {
      const el = ref.current.nativeElement;
      let lastScrollTop = 0;
      let lastScrollHeight = 0;
      const handleScroll = (e: Event) => {
        const target = e.target as HTMLElement;
        if (isProgrammaticScroll.current) {
          isProgrammaticScroll.current = false;
          // user scroll
        } else {
          if (
            target.scrollTop < lastScrollTop &&
            target.scrollHeight >= lastScrollHeight
          ) {
            canScrollRef.current = false;
          } else {
            if (isAtBottom()) {
              canScrollRef.current = true;
            }
          }
        }
        lastScrollTop = target.scrollTop;
        lastScrollHeight = target.scrollHeight;
        setShowScrollButton(!isAtBottom(scrollButtonOffset));
      };

      el.addEventListener('scroll', handleScroll);
      return () => {
        el.removeEventListener('scroll', handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScroll, isAtBottom, scrollButtonOffset]);
  return {
    showScrollButton,
    scrollToBottom,
  };
}
