import React, { useMemo } from 'react';
import type { Components } from 'react-markdown';
import cls from 'classnames';
import GithubSlugger from 'github-slugger';

import { useMarkdownContext } from '../context';

const LINK_ICON_CODE = `<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg>`;
export interface HeadingProps {
  children: React.ReactNode[];
}
const slugger = new GithubSlugger();

export const Heading: Components['h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'] = ({
  children,
  node,
  ...props
}) => {
  const { header_links, text } = useMarkdownContext();

  const id = useMemo(() => {
    if (!header_links) {
      return '';
    }
    if (node) {
      if (node.children[0].type === 'text') {
        return 'h-' + slugger.slug(node.children[0].value);
      }
      const raw = text.slice(
        node.position?.start.offset,
        node.position?.end.offset
      );
      return (
        'h-' +
        slugger.slug(
          raw
            .replace(/^#*/gi, '')
            .replace(/<[!/a-z].*?>/gi, '')
            .trim()
        )
      );
    }

    return 'h-' + slugger.slug(String(children));
  }, [children, header_links, node, text]);
  return (
    <>
      {React.createElement(
        node?.tagName || 'h1',
        {
          ...props,
          className: cls(props.className, 'ms-markdown-heading'),
        },
        <>
          {header_links ? (
            <a
              className="ms-markdown-heading-anchor"
              id={id}
              href={`#${id}`}
              dangerouslySetInnerHTML={{ __html: LINK_ICON_CODE }}
            />
          ) : null}
          {children}
        </>
      )}
    </>
  );
};
