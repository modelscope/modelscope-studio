import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { useTargets } from '@utils/hooks/useTargets';
import cls from 'classnames';
import render_math_in_element from 'katex/contrib/auto-render';

import { sanitize } from './sanitize';
import { bind_copy_event, copy_to_clipboard, create_marked } from './utils';

import 'katex/dist/katex.min.css';
import './index.less';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const Markdown = sveltify<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    value?: string;
    sanitizeHtml?: boolean;
    latexDelimiters?: {
      left: string;
      right: string;
      display: boolean;
    }[];
    lineBreaks?: boolean;
    headerLinks?: boolean;
    themeMode?: string;
    showCopyButton?: boolean;
    rtl?: boolean;
    root: string;
    onCopy?: (options: { value: string }) => void;
    onChange?: () => void;
    copyButtons?: string[];
  },
  [
    // list
    'copyButtons',
  ]
>(
  ({
    slots: _slots,
    value: message,
    headerLinks: header_links,
    lineBreaks: line_breaks,
    latexDelimiters: latex_delimiters,
    sanitizeHtml: sanitize_html,
    rtl,
    themeMode,
    showCopyButton,
    root,
    onChange,
    onCopy,
    copyButtons,
    children,
    ...props
  }) => {
    const [markdown, setMarkdown] = useState('');
    const [copied, setCopied] = useState(false);
    const copyTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const copyTargets = useTargets(children, 'copyButtons');
    const ref = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const onChangeMemoized = useMemoizedFn(onChange);
    const marked = useMemo(() => {
      return create_marked({
        header_links: header_links ?? false,
        line_breaks: line_breaks ?? true,
        latex_delimiters: latex_delimiters || [],
      });
    }, [header_links, latex_delimiters, line_breaks]);

    const process_message = useMemoizedFn((value: string) => {
      let parsedValue = value;

      const latexBlocks: string[] = [];
      (latex_delimiters || []).forEach((delimiter, _index) => {
        const leftDelimiter = escapeRegExp(delimiter.left);
        const rightDelimiter = escapeRegExp(delimiter.right);
        const regex = new RegExp(
          `${leftDelimiter}([\\s\\S]+?)${rightDelimiter}`,
          'g'
        );
        parsedValue = parsedValue.replace(regex, (match, _p1) => {
          latexBlocks.push(match);
          return `%%%LATEX_BLOCK_${latexBlocks.length - 1}%%%`;
        });
      });

      parsedValue = marked.parse(parsedValue) as string;

      parsedValue = parsedValue.replace(
        /%%%LATEX_BLOCK_(\d+)%%%/g,
        (_match, p1) => latexBlocks[parseInt(p1, 10)]
      );

      if (sanitize_html) {
        parsedValue = sanitize(parsedValue, root);
      }

      return parsedValue;
    });

    const render_html = useMemoizedFn((value: string) => {
      if (
        ref.current &&
        latex_delimiters &&
        latex_delimiters.length > 0 &&
        value
      ) {
        const containsDelimiter = latex_delimiters.every(
          (delimiter) =>
            value.includes(delimiter.left) && value.includes(delimiter.right)
        );
        if (containsDelimiter) {
          render_math_in_element(ref.current, {
            delimiters: latex_delimiters,
            throwOnError: false,
          });
        }
      }
    });
    const handleCopy = useMemoizedFn(async () => {
      const value = message || '';
      const success = await copy_to_clipboard(value);
      if (success) {
        onCopy?.({
          value,
        });
        setCopied(true);
        if (copyTimerRef.current) {
          clearTimeout(copyTimerRef.current);
        }
        copyTimerRef.current = setTimeout(() => {
          setCopied(false);
        }, 1000);
      }
    });

    const renderCopyButtons = () => {
      if (copyTargets.length > 0) {
        return copyTargets.slice(0, 2).map((target, i) => {
          if ((copied && i === 0) || (!copied && i === 1)) {
            return null;
          }
          return <ReactSlot slot={target} key={i} />;
        });
      }
      if (copyButtons) {
        return copyButtons.slice(0, 2).map((item, i) => {
          if ((copied && i === 0) || (!copied && i === 1)) {
            return null;
          }
          return item;
        });
      }
      return (
        <div className="ms-gr-markdown-copy-icon">
          <button>{copied ? <CheckOutlined /> : <CopyOutlined />}</button>
        </div>
      );
    };

    useEffect(() => {
      onChangeMemoized();
    }, [onChangeMemoized]);

    useEffect(() => {
      if (message && message.trim()) {
        setMarkdown(process_message(message));
      } else {
        setMarkdown('');
      }
    }, [message, process_message]);

    useEffect(() => {
      requestAnimationFrame(() => {
        render_html(markdown);
      });
    }, [markdown, render_html]);

    useEffect(() => {
      if (containerRef.current) {
        const cleanup = bind_copy_event(containerRef.current);
        return () => {
          cleanup();
          if (copyTimerRef.current) {
            clearTimeout(copyTimerRef.current);
          }
        };
      }
    }, []);

    return (
      <>
        <div
          {...props}
          ref={containerRef}
          className={cls(
            props.className,
            'ms-gr-markdown',
            themeMode === 'dark' && 'dark'
          )}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          {showCopyButton ? (
            <div
              className="ms-gr-markdown-copy"
              onClick={() => {
                handleCopy();
              }}
            >
              {/* escape clone */}
              <div style={{ display: 'none' }}>{children}</div>
              {renderCopyButtons()}
            </div>
          ) : null}

          <span
            className={cls('md prose')}
            ref={ref}
            dangerouslySetInnerHTML={{ __html: markdown }}
          />
        </div>
      </>
    );
  }
);

export default Markdown;