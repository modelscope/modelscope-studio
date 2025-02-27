import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo, useRef, useState } from 'react';
import { Bubble } from '@ant-design/x';
import type {
  BubbleDataType,
  BubbleListProps,
  BubbleListRef,
} from '@ant-design/x/es/bubble/BubbleList';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { theme } from 'antd';
import cls from 'classnames';
import { produce } from 'immer';
import { omit } from 'lodash-es';

import { withRoleItemsContextProvider } from '../../antdx/bubble/list/context';
import {
  messageIndexSymbol,
  useRolesRender,
} from '../../antdx/bubble/list/utils';

import { ChatbotFooter } from './chatbot-footer';
import { ChatbotHeader } from './chatbot-header';
import { Message } from './message';
import type {
  ChatbotBotConfig,
  ChatbotMarkdownConfig,
  ChatbotMessage,
  ChatbotMessages,
  ChatbotSuggestionContent,
  ChatbotUserConfig,
  CopyData,
  DeleteData,
  EditData,
  LikeData,
  RegenerateData,
  SuggestionData,
} from './type';
import {
  convertObjectKeyToCamelCase,
  getAvatarProps,
  getContextText,
  updateContent,
  walkSuggestionContent,
} from './utils';

import './chatbot.less';

export const Chatbot = sveltify<{
  urlRoot: string;
  urlProxyUrl: string;
  themeMode: string;
  roles?: BubbleListProps['roles'];
  autoScroll?: boolean;
  userConfig?: ChatbotUserConfig;
  botConfig?: ChatbotBotConfig;
  markdownConfig?: ChatbotMarkdownConfig;
  value: ChatbotMessages;
  onValueChange: (v: ChatbotMessages) => void;
  onCopy?: (v: CopyData) => void;
  onEdit?: (v: EditData) => void;
  onDelete?: (v: DeleteData) => void;
  onLike?: (v: LikeData) => void;
  onRegenerate?: (v: RegenerateData) => void;
  onSuggestionSelect?: (v: SuggestionData) => void;
}>(
  withRoleItemsContextProvider(
    ['roles'],
    ({
      id,
      className,
      style,
      value,
      roles,
      urlRoot,
      urlProxyUrl,
      themeMode,
      autoScroll = true,
      markdownConfig,
      userConfig,
      botConfig,
      onValueChange,
      onCopy,
      onEdit,
      onRegenerate,
      onDelete,
      onLike,
      onSuggestionSelect,
    }) => {
      const resolvedMarkdownConfig: ChatbotMarkdownConfig = useMemo(
        () => ({
          lineBreaks: true,
          renderMarkdown: true,
          ...convertObjectKeyToCamelCase(markdownConfig),
          urlRoot,
          themeMode,
        }),
        [markdownConfig, themeMode, urlRoot]
      );
      const resolvedUserConfig = useMemo(() => {
        return (
          userConfig
            ? Object.keys(userConfig).reduce((acc, key) => {
                if (userConfig[key] !== undefined && userConfig[key] !== null) {
                  acc[key] = userConfig[key];
                }
                return acc;
              }, {})
            : {}
        ) as typeof userConfig;
      }, [userConfig]);
      const resolvedBotConfig = useMemo(() => {
        return (
          botConfig
            ? Object.keys(botConfig).reduce((acc, key) => {
                if (botConfig[key] !== undefined && botConfig[key] !== null) {
                  acc[key] = botConfig[key];
                }
                return acc;
              }, {})
            : {}
        ) as typeof botConfig;
      }, [botConfig]);
      const resolvedValue = useMemo(() => {
        return (value || []).map((item, i) => {
          const isLastMessage = i === value.length - 1;
          const resolvedItem = Object.keys(item).reduce((acc, key) => {
            // omit default item value
            if (item[key] !== undefined && item[key] !== null) {
              acc[key] = item[key];
            }
            return acc;
          }, {} as ChatbotMessage);
          return {
            ...resolvedItem,
            [messageIndexSymbol]: i,
            // patch gradio global style
            type: undefined,
            content:
              resolvedItem.type === 'suggestion' && !isLastMessage
                ? walkSuggestionContent(
                    resolvedItem.content as ChatbotSuggestionContent,
                    (v) => {
                      return {
                        ...v,
                        disabled: v.disabled ?? true,
                      };
                    }
                  )
                : resolvedItem.content,
            content_type: resolvedItem.type || 'text',
            key:
              resolvedItem.key ||
              `${getContextText(resolvedItem.content)}-${i}`,
          };
        }) as BubbleDataType[];
      }, [value]);
      const { token } = theme.useToken();
      const chatbotRef = useRef<BubbleListRef | null>(null);
      const [editIndex, setEditIndex] = useState(-1);
      const [editValue, setEditValue] = useState('');
      const [footerWidth, setFooterWidth] = useState(0);

      const getContentContainerRef = useMemoizedFn(
        (el: HTMLDivElement, message: ChatbotMessage) => {
          let padding = 2 * token.padding;
          if (message.variant === 'borderless') {
            padding = 0;
          } else if (
            (message.role === 'user' &&
              resolvedUserConfig?.variant === 'borderless') ||
            (message.role === 'assistant' &&
              resolvedBotConfig?.variant === 'borderless')
          ) {
            padding = 0;
          }
          setFooterWidth(el.getBoundingClientRect().width + padding);
        }
      );

      const handleSuggestionSelect = useMemoizedFn((v: SuggestionData) => {
        onSuggestionSelect?.(v);
      });

      const handleRegenerate = useMemoizedFn((v: RegenerateData) => {
        onRegenerate?.(v);
      });

      const handleEdit = useMemoizedFn((index: number) => {
        setEditIndex(index);
      });
      const handleEditCancel = useMemoizedFn(() => {
        setEditIndex(-1);
      });
      const handleEditConfirm = useMemoizedFn((v: EditData) => {
        onEdit?.(v);
        setEditIndex(-1);
        onValueChange(
          produce(value, (draft) => {
            draft[v.index] = {
              ...draft[v.index],
              content: updateContent(draft[v.index].content, v.value),
            };
          })
        );
      });
      const handleCopy = useMemoizedFn((v: CopyData) => {
        onCopy?.(v);
      });

      const handleLike = useMemoizedFn((v: LikeData) => {
        onLike?.(v);
        onValueChange(
          produce(value, (draft) => {
            const meta = draft[v.index].meta || {};
            const action = v.liked ? 'like' : 'dislike';
            draft[v.index] = {
              ...draft[v.index],
              meta: {
                ...meta,
                feedback: meta.feedback === action ? null : action,
              },
            };
          })
        );
      });
      const handleDelete = useMemoizedFn((v: DeleteData) => {
        onDelete?.(v);
        onValueChange(
          produce(value, (draft) => {
            draft.splice(v.index, 1);
          })
        );
      });

      const rolesRender = useRolesRender<ChatbotMessage>(
        {
          roles,
          preProcess(bubbleProps, index) {
            return {
              ...(bubbleProps as BubbleDataType),
              style: bubbleProps.elem_style,
              className: cls(
                bubbleProps.elem_classes,
                'ms-gr-pro-chatbot-message'
              ),
              classNames: {
                ...bubbleProps.class_names,
                avatar: cls(
                  bubbleProps.class_names?.avatar,
                  'ms-gr-pro-chatbot-message-avatar'
                ),
                header: cls(
                  bubbleProps.class_names?.header,
                  'ms-gr-pro-chatbot-message-header'
                ),
                footer: cls(
                  bubbleProps.class_names?.footer,
                  'ms-gr-pro-chatbot-message-footer',
                  index === editIndex
                    ? 'ms-gr-pro-chatbot-message-footer-editing'
                    : undefined
                ),
                content: cls(
                  bubbleProps.class_names?.content,
                  'ms-gr-pro-chatbot-message-content'
                ),
              },
            };
          },
          postProcess(bubbleProps, index) {
            const isUserRole = bubbleProps.role === 'user';
            switch (bubbleProps.role) {
              case 'user':
              case 'assistant':
                return {
                  ...omit(isUserRole ? resolvedUserConfig : resolvedBotConfig, [
                    'actions',
                    'avatar',
                    'header',
                  ]),
                  ...bubbleProps,
                  style: {
                    ...(isUserRole
                      ? resolvedUserConfig?.style
                      : resolvedBotConfig?.style),
                    ...bubbleProps.style,
                  },
                  className: cls(
                    bubbleProps.className,
                    isUserRole
                      ? resolvedUserConfig?.elem_classes
                      : resolvedBotConfig?.elem_classes
                  ),
                  header: (
                    <ChatbotHeader
                      title={
                        (bubbleProps.header as string) ??
                        ((isUserRole
                          ? resolvedUserConfig?.header
                          : resolvedBotConfig?.header) as string)
                      }
                      markdownConfig={resolvedMarkdownConfig}
                    />
                  ),
                  avatar: getAvatarProps(
                    bubbleProps.avatar ??
                      (isUserRole
                        ? resolvedUserConfig?.avatar
                        : resolvedBotConfig?.avatar)
                  ),
                  footer: (
                    <ChatbotFooter
                      isEditing={editIndex === index}
                      message={bubbleProps}
                      editValue={editValue}
                      index={index}
                      width={footerWidth}
                      actions={
                        bubbleProps.actions ??
                        (isUserRole
                          ? resolvedUserConfig?.actions
                          : resolvedBotConfig?.actions || [])
                      }
                      onEditCancel={handleEditCancel}
                      onEditConfirm={handleEditConfirm}
                      onCopy={handleCopy}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onRegenerate={handleRegenerate}
                      onLike={handleLike}
                    />
                  ),
                  messageRender() {
                    return (
                      <Message
                        index={index}
                        urlProxyUrl={urlProxyUrl}
                        urlRoot={urlRoot}
                        isEditing={editIndex === index}
                        getContainerRef={getContentContainerRef}
                        message={{
                          ...bubbleProps,
                          type: bubbleProps.content_type,
                        }}
                        markdownConfig={resolvedMarkdownConfig}
                        onEdit={setEditValue}
                        onSuggestionSelect={handleSuggestionSelect}
                      />
                    );
                  },
                };
              default:
                return;
            }
          },
        },
        [
          editIndex,
          resolvedUserConfig,
          resolvedBotConfig,
          resolvedMarkdownConfig,
          footerWidth,
          editValue,
        ]
      );
      return (
        <Bubble.List
          ref={chatbotRef}
          id={id}
          className={cls(className, 'ms-gr-pro-chatbot')}
          style={style}
          autoScroll={autoScroll}
          roles={rolesRender}
          items={resolvedValue}
        />
      );
    }
  )
);

export default Chatbot;
