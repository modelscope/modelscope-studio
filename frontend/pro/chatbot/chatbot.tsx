import { sveltify } from '@svelte-preprocess-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bubble } from '@ant-design/x';
import type {
  BubbleDataType,
  BubbleListProps,
  BubbleListRef,
} from '@ant-design/x/es/bubble/BubbleList';
import { convertObjectKeyToCamelCase } from '@utils/convertToCamelCase';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { theme } from 'antd';
import cls from 'classnames';
import { produce } from 'immer';
import { isEqual, omit } from 'lodash-es';

import { withRoleItemsContextProvider } from '../../antdx/bubble/list/context';
import {
  messageIndexSymbol,
  useRolesRender,
} from '../../antdx/bubble/list/utils';

import { WelcomeMessage } from './messages/welcome';
import { ChatbotFooter, type ChatbotFooterProps } from './chatbot-footer';
import { ChatbotHeader } from './chatbot-header';
import { Message } from './message';
import type {
  ChatbotBotConfig,
  ChatbotMarkdownConfig,
  ChatbotMessage,
  ChatbotMessages,
  ChatbotUserConfig,
  ChatbotWelcomeConfig,
  CopyData,
  DeleteData,
  EditData,
  LikeData,
  RetryData,
  SuggestionData,
  WelcomePromptData,
} from './type';
import { getAvatarProps } from './utils';

import './chatbot.less';

export const Chatbot = sveltify<{
  urlRoot: string;
  urlProxyUrl: string;
  themeMode: string;
  roles?: BubbleListProps['roles'];
  autoScroll?: boolean;
  height?: string | number;
  userConfig?: ChatbotUserConfig;
  botConfig?: ChatbotBotConfig;
  markdownConfig?: ChatbotMarkdownConfig;
  welcomeConfig?: ChatbotWelcomeConfig;
  value: ChatbotMessages;
  onValueChange: (v: ChatbotMessages) => void;
  onChange?: () => void;
  onCopy?: (v: CopyData) => void;
  onEdit?: (v: EditData) => void;
  onDelete?: (v: DeleteData) => void;
  onLike?: (v: LikeData) => void;
  onRetry?: (v: RetryData) => void;
  onSuggestionSelect?: (v: SuggestionData) => void;
  onWelcomePromptSelect?: (v: WelcomePromptData) => void;
}>(
  withRoleItemsContextProvider(
    ['roles'],
    ({
      id,
      className,
      style,
      height,
      value,
      roles,
      urlRoot,
      urlProxyUrl,
      themeMode,
      autoScroll = true,
      markdownConfig,
      welcomeConfig,
      userConfig,
      botConfig,
      onValueChange,
      onCopy,
      onChange,
      onEdit,
      onRetry,
      onDelete,
      onLike,
      onSuggestionSelect,
      onWelcomePromptSelect,
    }) => {
      const resolvedWelcomeConfig = useMemo(() => {
        return {
          variant: 'borderless',
          ...(welcomeConfig
            ? omitUndefinedProps(welcomeConfig, { omitNull: true })
            : {}),
        } as typeof welcomeConfig;
      }, [welcomeConfig]);

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
          userConfig ? omitUndefinedProps(userConfig, { omitNull: true }) : {}
        ) as typeof userConfig;
      }, [userConfig]);
      const resolvedBotConfig = useMemo(() => {
        return (
          botConfig ? omitUndefinedProps(botConfig, { omitNull: true }) : {}
        ) as typeof botConfig;
      }, [botConfig]);
      const resolvedValue = useMemo(() => {
        const newValue = (value || [])
          .map((item, i) => {
            const isLastMessage = i === value.length - 1;
            const resolvedItem = omitUndefinedProps(item, { omitNull: true });
            return {
              ...resolvedItem,
              [messageIndexSymbol]: i,
              isLastMessage,
              key: resolvedItem.key ?? `${i}`,
            };
          })
          .filter((item) => item.role !== 'system') as BubbleDataType[];
        return newValue.length > 0
          ? newValue
          : [
              {
                role: 'welcome',
              },
            ];
      }, [value]);

      const { token } = theme.useToken();
      const chatbotRef = useRef<BubbleListRef | null>(null);
      const [editIndex, setEditIndex] = useState(-1);
      const [editValues, setEditValues] = useState<Record<number, string>>({});
      const [footerWidth, setFooterWidth] = useState(0);
      const oldValueRef = useRef<typeof value>();

      const handleEditValue = useMemoizedFn((itemIndex: number, v: string) => {
        setEditValues((prev) => ({ ...prev, [itemIndex]: v }));
      });

      const onChangeMemoized = useMemoizedFn(onChange);
      useEffect(() => {
        if (isEqual(oldValueRef.current, value)) {
          return;
        }
        onChangeMemoized();
        oldValueRef.current = value;
      }, [value, onChangeMemoized]);

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

      const handleWelcomePromptSelect = useMemoizedFn(
        (v: WelcomePromptData) => {
          onWelcomePromptSelect?.(v);
        }
      );

      const handleRetry = useMemoizedFn((v: RetryData) => {
        onRetry?.(v);
      });

      const handleEdit = useMemoizedFn((index: number) => {
        setEditIndex(index);
      });
      const handleEditCancel = useMemoizedFn(() => {
        setEditIndex(-1);
      });
      const handleEditConfirm: ChatbotFooterProps['onEditConfirm'] =
        useMemoizedFn((v) => {
          onEdit?.(v);
          setEditIndex(-1);
          onValueChange([
            ...value.slice(0, v.index),
            {
              ...value[v.index],
              content: v.value,
            },
            ...value.slice(v.index + 1),
          ]);
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
              case 'welcome':
                return {
                  variant: 'borderless',
                  styles: {
                    content: { width: '100%' },
                  },
                  messageRender() {
                    return (
                      <WelcomeMessage
                        urlRoot={urlRoot}
                        urlProxyUrl={urlProxyUrl}
                        options={resolvedWelcomeConfig || {}}
                        onWelcomePromptSelect={handleWelcomePromptSelect}
                      />
                    );
                  },
                };
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
                      urlRoot={urlRoot}
                      urlProxyUrl={urlProxyUrl}
                      editValues={editValues}
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
                      onRetry={handleRetry}
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
                        message={bubbleProps}
                        isLastMessage={bubbleProps.isLastMessage || false}
                        markdownConfig={resolvedMarkdownConfig}
                        onEdit={handleEditValue}
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
          resolvedWelcomeConfig,
          resolvedBotConfig,
          resolvedMarkdownConfig,
          footerWidth,
          editValues,
        ]
      );
      return (
        <Bubble.List
          ref={chatbotRef}
          id={id}
          className={cls(className, 'ms-gr-pro-chatbot')}
          style={{
            height,
            ...style,
          }}
          autoScroll={autoScroll}
          roles={rolesRender}
          items={resolvedValue}
        />
      );
    }
  )
);

export default Chatbot;
