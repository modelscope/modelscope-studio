import { sveltify } from '@svelte-preprocess-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownOutlined } from '@ant-design/icons';
import {
  Bubble,
  type BubbleItemType,
  type BubbleListProps,
} from '@ant-design/x';
import type { BubbleListRef } from '@ant-design/x/es/bubble';
import { convertObjectKeyToCamelCase } from '@utils/convertToCamelCase';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { Avatar, Button } from 'antd';
import cls from 'classnames';
import { produce } from 'immer';
import { isEqual, omit } from 'lodash-es';

import { withRoleItemsContextProvider } from '../../antdx/bubble/list/context';
import { messageIndexSymbol, useRole } from '../../antdx/bubble/list/utils';

import { useScroll } from './hooks/useScroll';
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
import {
  getAvatarProps,
  lastMessageSymbol,
  messageAvatarSymbol,
  messageFooterSymbol,
  messageHeaderSymbol,
} from './utils';

import './chatbot.less';

export const Chatbot = sveltify<{
  rootUrl: string;
  apiPrefix: string;
  themeMode: string;
  role?: BubbleListProps['role'];
  autoScroll?: boolean;
  showScrollToBottomButton?: boolean;
  scrollToBottomButtonOffset?: number;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
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
    ['role'],
    ({
      id,
      className,
      style,
      height,
      minHeight,
      maxHeight,
      value,
      role,
      rootUrl,
      apiPrefix,
      themeMode,
      autoScroll = true,
      showScrollToBottomButton = true,
      scrollToBottomButtonOffset = 200,
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
          rootUrl,
          themeMode,
        }),
        [markdownConfig, themeMode, rootUrl]
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
        const newValue = (value || []).map((item, i) => {
          const isLastMessage = i === value.length - 1;
          const resolvedItem = omitUndefinedProps(item, { omitNull: true });
          return {
            ...omitUndefinedProps({
              ...omit(resolvedItem, [
                'header',
                'footer',
                'avatar',
                'divider_props',
              ]),
              dividerProps: resolvedItem.divider_props,
            }),
            ...{
              [messageIndexSymbol]: i,
              [messageHeaderSymbol]: resolvedItem.header,
              [messageFooterSymbol]: resolvedItem.footer,
              [messageAvatarSymbol]: resolvedItem.avatar,
              [lastMessageSymbol]: isLastMessage,
              key: resolvedItem.key ?? `${i}`,
            },
          };
        }) as BubbleItemType[];
        return newValue.length > 0
          ? newValue
          : [
              {
                role: 'chatbot-internal-welcome',
                key: 'chatbot-internal-welcome',
              } as BubbleItemType,
            ];
      }, [value]);

      const chatbotRef = useRef<BubbleListRef | null>(null);
      const [editIndex, setEditIndex] = useState(-1);
      const [editValues, setEditValues] = useState<Record<number, string>>({});
      const oldValueRef = useRef<typeof value | undefined>(undefined);

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
          setEditIndex(-1);
          onValueChange([
            ...value.slice(0, v.index),
            {
              ...value[v.index],
              content: v.value,
            },
            ...value.slice(v.index + 1),
          ]);
          onEdit?.(v);
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
        onValueChange(
          produce(value, (draft) => {
            draft.splice(v.index, 1);
          })
        );
        onDelete?.(v);
      });
      const resolvedRole = useRole<ChatbotMessage>(
        {
          role,
          preProcess(bubbleProps, index) {
            const isUserRole = bubbleProps.role === 'user';
            return {
              ...(bubbleProps as BubbleItemType),
              style: bubbleProps.elem_style,
              className: cls(
                bubbleProps.elem_classes,
                'ms-gr-pro-chatbot-message'
              ),
              classNames: {
                ...bubbleProps.class_names,
                avatar: cls(
                  isUserRole
                    ? resolvedUserConfig?.class_names?.avatar
                    : resolvedBotConfig?.class_names?.avatar,
                  bubbleProps.class_names?.avatar,
                  'ms-gr-pro-chatbot-message-avatar'
                ),
                body: cls(
                  isUserRole
                    ? resolvedUserConfig?.class_names?.body
                    : resolvedBotConfig?.class_names?.body,
                  bubbleProps.class_names?.body,
                  'ms-gr-pro-chatbot-message-body'
                ),
                header: cls(
                  isUserRole
                    ? resolvedUserConfig?.class_names?.header
                    : resolvedBotConfig?.class_names?.header,
                  bubbleProps.class_names?.header,
                  'ms-gr-pro-chatbot-message-header'
                ),
                footer: cls(
                  isUserRole
                    ? resolvedUserConfig?.class_names?.footer
                    : resolvedBotConfig?.class_names?.footer,
                  bubbleProps.class_names?.footer,
                  'ms-gr-pro-chatbot-message-footer',
                  index === editIndex
                    ? 'ms-gr-pro-chatbot-message-footer-editing'
                    : undefined
                ),
                content: cls(
                  isUserRole
                    ? resolvedUserConfig?.class_names?.content
                    : resolvedBotConfig?.class_names?.content,
                  bubbleProps.class_names?.content,
                  'ms-gr-pro-chatbot-message-content'
                ),
              },
            };
          },
          defaultRolePostProcess(bubbleProps, index) {
            const isUserRole = bubbleProps.role === 'user';
            switch (bubbleProps.role) {
              case 'chatbot-internal-welcome':
                return {
                  variant: 'borderless',
                  styles: {
                    root: {
                      paddingInlineEnd: 0,
                    },
                    content: { width: '100%' },
                    body: {
                      width: '100%',
                    },
                  },
                  contentRender() {
                    return (
                      <WelcomeMessage
                        rootUrl={rootUrl}
                        apiPrefix={apiPrefix}
                        options={resolvedWelcomeConfig || {}}
                        onWelcomePromptSelect={handleWelcomePromptSelect}
                      />
                    );
                  },
                };
              case 'user':
              case 'assistant': {
                const avatarProps = getAvatarProps(
                  bubbleProps[messageAvatarSymbol] ??
                    (isUserRole
                      ? resolvedUserConfig?.avatar
                      : resolvedBotConfig?.avatar)
                );
                return {
                  ...(isUserRole ? resolvedUserConfig : resolvedBotConfig),
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
                        (bubbleProps[messageHeaderSymbol] as string) ??
                        ((isUserRole
                          ? resolvedUserConfig?.header
                          : resolvedBotConfig?.header) as string)
                      }
                      markdownConfig={resolvedMarkdownConfig}
                    />
                  ),
                  avatar: avatarProps ? <Avatar {...avatarProps} /> : undefined,
                  footer:
                    // bubbleProps[lastMessageSymbol] &&
                    bubbleProps.loading ||
                    bubbleProps.status === 'pending' ? undefined : (
                      <ChatbotFooter
                        isEditing={editIndex === index}
                        message={bubbleProps}
                        extra={
                          (bubbleProps[messageFooterSymbol] as string) ??
                          ((isUserRole
                            ? resolvedUserConfig?.footer
                            : resolvedBotConfig?.footer) as string)
                        }
                        rootUrl={rootUrl}
                        apiPrefix={apiPrefix}
                        editValues={editValues}
                        index={index}
                        actions={
                          bubbleProps.actions ??
                          (isUserRole
                            ? resolvedUserConfig?.actions || []
                            : resolvedBotConfig?.actions || [])
                        }
                        disabledActions={
                          bubbleProps.disabled_actions ??
                          (isUserRole
                            ? resolvedUserConfig?.disabled_actions || []
                            : resolvedBotConfig?.disabled_actions || [])
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
                  contentRender() {
                    return (
                      <Message
                        index={index}
                        apiPrefix={apiPrefix}
                        rootUrl={rootUrl}
                        isEditing={editIndex === index}
                        message={bubbleProps}
                        isLastMessage={bubbleProps[lastMessageSymbol] || false}
                        markdownConfig={resolvedMarkdownConfig}
                        onEdit={handleEditValue}
                        onSuggestionSelect={handleSuggestionSelect}
                      />
                    );
                  },
                };
              }
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
          editValues,
        ]
      );
      const { scrollToBottom, showScrollButton } = useScroll({
        ref: chatbotRef,
        value,
        autoScroll,
        scrollButtonOffset: scrollToBottomButtonOffset,
      });

      return (
        <div
          id={id}
          className={cls(className, 'ms-gr-pro-chatbot')}
          style={{
            height,
            minHeight,
            maxHeight,
            ...style,
          }}
        >
          <Bubble.List
            ref={chatbotRef}
            className="ms-gr-pro-chatbot-messages"
            autoScroll={false}
            role={resolvedRole}
            items={resolvedValue}
          />
          {showScrollToBottomButton && showScrollButton && (
            <div className="ms-gr-pro-chatbot-scroll-to-bottom-button">
              <Button
                icon={<ArrowDownOutlined />}
                shape="circle"
                variant="outlined"
                color="primary"
                onClick={() => scrollToBottom('smooth')}
              />
            </div>
          )}
        </div>
      );
    }
  )
);

export default Chatbot;
