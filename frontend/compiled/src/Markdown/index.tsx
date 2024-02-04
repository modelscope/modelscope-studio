import { useEffect, useMemo } from 'react';
import ReactMarkdown, {
  defaultUrlTransform,
  Options as ReactMarkdownOptions,
} from 'react-markdown';
import cls from 'classnames';
import deepmerge from 'deepmerge';
import dark from 'github-markdown-css/github-markdown-dark.css?inline';
import light from 'github-markdown-css/github-markdown-light.css?inline';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { defineComponent } from '../defineComponent';

import { Anchor } from './components/Anchor';
import { Audio } from './components/Audio';
import { Code } from './components/Code';
import { Accordion, AccordionTitle } from './components/custom/Accordion';
import { File } from './components/custom/File';
import { FlushingEnd } from './components/custom/FlushingEnd';
import { SelectBox } from './components/custom/SelectBox';
import { CustomComponent } from './components/CustomComponent';
import { Heading } from './components/Heading';
import { Image } from './components/Image';
import { Video } from './components/Video';
import rehypeInlineCodeProperty from './rehype-plugins/rehype-Inline-code-property';
import rehypeSanitize, {
  defaultSchema,
} from './rehype-plugins/rehype-sanitize';
import remarkDirectiveRehype from './remark-plugins/remark-directive-rehype';
import { MarkdownContext, MarkdownContextValue } from './context';

import 'katex/dist/katex.min.css';
import './index.less';

export * from './type';
export interface MarkdownProps extends MarkdownContextValue {
  sanitize_html?: boolean;
  flushing?: boolean;
  preview?: boolean;
  disabled?: boolean;
  render_markdown?: boolean;
  latex_delimiters?: {
    left: string;
    right: string;
    display: boolean;
  }[];
  line_breaks?: boolean;
  on_load?: () => void;
  header_links?: boolean;
  last_flushing_end_index?: number;
  enable_base64?: boolean;
}

const buildInCustomComponents = {
  'select-box': SelectBox,
  'accordion-title': AccordionTitle,
  accordion: Accordion,
  'flushing-end': FlushingEnd,
  file: File,
};

const defaultCustomComponents: MarkdownProps['custom_components'] = {};

export const Markdown = defineComponent<MarkdownProps>((props) => {
  const {
    render_markdown = true,
    sanitize_html = true,
    latex_delimiters: _latex_delimiters = [],
    text: _text = '',
    line_breaks = true,
    flushing,
    className,
    disabled,
    style,
    preview = true,
    theme = 'light',
    end = true,
    on_load: _on_load,
    last_flushing_end_index,
    enable_base64,
    on_custom,
    header_links = false,
    custom_components = defaultCustomComponents,
  } = props;
  const text = _text.trim();

  useEffect(() => {
    const styleTagId = '$MODELSCOPE_STUDIO_MARKDOWN_THEME';
    if (document.getElementById(styleTagId)) {
      return;
    }
    const styleTag = document.createElement('style');
    styleTag.id = styleTagId;
    const cssRules = theme === 'dark' ? dark : light;

    if ((styleTag as any).styleSheet) {
      // IE8
      (styleTag as any).styleSheet.cssText = cssRules;
    } else {
      styleTag.appendChild(document.createTextNode(cssRules));
    }

    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [theme]);

  const custom_tags = useMemo(
    () => Object.keys(custom_components || {}),
    [custom_components]
  );

  const sanitizeSchema = useMemo(() => {
    return deepmerge(defaultSchema, {
      // deepmerge to https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/schema.js
      tagNames: [
        'video',
        'audio',
        ...Object.keys(buildInCustomComponents),
        ...custom_tags,
      ],
      attributes: {
        '*': ['className', 'style', 'id', 'type'],
        code: ['inline'],
        source: ['src'],
        file: ['src', 'viewable', 'title', 'type'],
        video: ['src', 'loop', 'autoplay', 'autoPlay', 'muted', 'controls'],
        audio: ['src', 'loop', 'autoplay', 'autoPlay', 'muted', 'controls'],
        accordion: ['title'],
        'select-box': [
          'value',
          'options',
          'direction',
          'type',
          'shape',
          'disabled',
          'submit-text',
          'select-once',
          'img-height',
          'item-height',
          'item-width',
          'columns',
          'equal-height',
        ],
        ...custom_tags.reduce(
          (acc, custom_tag) => {
            acc[custom_tag] = custom_components[custom_tag].props || [];
            return acc;
          },
          {} as Record<string, string[]>
        ),
      },
      clobberPrefix: '',
      protocols: enable_base64
        ? {
            src: ['data'],
          }
        : {},
    });
  }, [custom_components, custom_tags, enable_base64]);

  if (!render_markdown) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  return (
    <MarkdownContext.Provider
      value={{
        text,
        end,
        preview,
        flushing,
        theme,
        disabled,
        header_links,
        last_flushing_end_index,
        on_custom,
        custom_components,
      }}
    >
      <ReactMarkdown
        remarkPlugins={
          [
            remarkDirective,
            remarkDirectiveRehype,
            [remarkGfm, { singleTilde: false }],
            line_breaks ? remarkBreaks : null,
            remarkMath,
          ].filter(Boolean) as NonNullable<
            ReactMarkdownOptions['remarkPlugins']
          >
        }
        remarkRehypeOptions={{
          clobberPrefix: '',
        }}
        rehypePlugins={
          [
            rehypeKatex,
            rehypeRaw,
            rehypeInlineCodeProperty,
            sanitize_html ? [rehypeSanitize, sanitizeSchema] : null,
          ].filter(Boolean) as NonNullable<
            ReactMarkdownOptions['rehypePlugins']
          >
        }
        className={cls(
          'ms-markdown',
          'markdown-body',
          {
            'ms-markdown-flushing': flushing,
            'ms-markdown-flushing-empty': !text && flushing,
          },
          className
        )}
        urlTransform={
          enable_base64
            ? (url) => {
                if (url.startsWith('data:')) {
                  return url;
                }
                return defaultUrlTransform(url);
              }
            : undefined
        }
        components={{
          a: Anchor,
          audio: Audio,
          video: Video,
          code: Code,
          h1: Heading,
          h2: Heading,
          h3: Heading,
          h4: Heading,
          h5: Heading,
          h6: Heading,
          img: Image,
          ...buildInCustomComponents,
          ...custom_tags.reduce(
            (acc, custom_tag) => {
              acc[custom_tag] = CustomComponent;
              return acc;
            },
            {} as Record<string, any>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </MarkdownContext.Provider>
  );
});
