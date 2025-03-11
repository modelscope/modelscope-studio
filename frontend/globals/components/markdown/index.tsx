import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import cls from 'classnames';
import render_math_in_element from 'katex/contrib/auto-render';

import { sanitize } from './sanitize';
import {
  bind_copy_event,
  copy_to_clipboard,
  create_marked,
  escapeTags,
} from './utils';

import 'katex/dist/katex.min.css';
import './markdown.less';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface MarkdownProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    'onCopy'
  > {
  value?: string;
  sanitizeHtml?: boolean;
  latexDelimiters?: {
    left: string;
    right: string;
    display: boolean;
  }[];
  lineBreaks?: boolean;
  headerLinks?: boolean;
  showCopyButton?: boolean;
  rtl?: boolean;
  themeMode: string;
  urlRoot: string;
  allowTags?: string[];
  onCopy?: (options: { value: string }) => void;
  onChange?: () => void;
  copyButtons?: React.ReactNode[];
}

const defaultLatexDelimiters = [
  { left: '$$', right: '$$', display: true },
  { left: '\\(', right: '\\)', display: false },
  { left: '\\begin{equation}', right: '\\end{equation}', display: true },
  { left: '\\begin{align}', right: '\\end{align}', display: true },
  { left: '\\begin{alignat}', right: '\\end{alignat}', display: true },
  { left: '\\begin{gather}', right: '\\end{gather}', display: true },
  { left: '\\begin{CD}', right: '\\end{CD}', display: true },
  { left: '\\[', right: '\\]', display: true },
];

export const Markdown: React.FC<MarkdownProps> = ({
  value: message,
  headerLinks: header_links,
  lineBreaks: line_breaks,
  latexDelimiters: latex_delimiters = defaultLatexDelimiters,
  sanitizeHtml: sanitize_html = true,
  rtl,
  themeMode,
  showCopyButton,
  urlRoot,
  onChange,
  onCopy,
  copyButtons,
  allowTags: allow_tags,
  ...props
}) => {
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>();
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

    if (allow_tags) {
      parsedValue = escapeTags(parsedValue, allow_tags);
    }

    if (sanitize_html) {
      parsedValue = sanitize(parsedValue, urlRoot);
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
      const containsDelimiter = latex_delimiters.some(
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
    if (Array.isArray(copyButtons) && copyButtons.length > 0) {
      return copyButtons.slice(0, 2).map((item, i) => {
        if ((copied && i === 0) || (!copied && i === 1)) {
          return null;
        }
        return <React.Fragment key={i}>{item}</React.Fragment>;
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
  }, [markdown, onChangeMemoized]);

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
};
