import React, { useMemo, useRef } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  LikeOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Button,
  Flex,
  Popconfirm,
  type PopconfirmProps,
  Tooltip,
  Typography,
} from 'antd';
import { isObject } from 'lodash-es';

import type {
  ChatbotBotConfig,
  ChatbotMessage,
  ChatbotUserConfig,
  CopyData,
  DeleteData,
  EditData,
  LikeData,
  RetryData,
} from './type';
import { getCopyText, updateContent } from './utils';

export interface ChatbotFooterProps {
  isEditing: boolean;
  index: number;
  editValues: Record<number, string>;
  onEditCancel: () => void;
  onEditConfirm: (data: EditData) => void;
  message: ChatbotMessage;
  actions: (ChatbotBotConfig | ChatbotUserConfig)['actions'];
  disabledActions: string[];
  onCopy: (data: CopyData) => void;
  onEdit: (index: number) => void;
  onDelete: (data: DeleteData) => void;
  extra?: string;
  onRetry?: (data: RetryData) => void;
  onLike?: (data: LikeData) => void;
  urlRoot: string;
  urlProxyUrl: string;
}

export const CopyButton: React.FC<{
  content: ChatbotMessage['content'];
  onCopy?: (v: string) => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  urlRoot: string;
  urlProxyUrl: string;
}> = ({
  content,
  className,
  style,
  disabled,
  urlRoot,
  urlProxyUrl,
  onCopy,
}) => {
  const text = useMemo(
    () => getCopyText(content, urlRoot, urlProxyUrl),
    [content, urlProxyUrl, urlRoot]
  );
  const copyButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Typography.Text
      copyable={{
        tooltips: false,
        onCopy() {
          onCopy?.(text);
        },
        text,
        icon: [
          <Button
            ref={copyButtonRef}
            variant="text"
            color="default"
            disabled={disabled}
            size="small"
            className={className}
            style={style}
            key="copy"
            icon={<CopyOutlined />}
          />,
          <Button
            variant="text"
            color="default"
            size="small"
            key="copied"
            disabled={disabled}
            className={className}
            style={style}
            icon={<CheckOutlined />}
          />,
        ],
      }}
    />
  );
};

const Action: React.FC<{
  action: NonNullable<ChatbotFooterProps['actions']>[number];
  disabledActions: ChatbotFooterProps['disabledActions'];
  disabled?: boolean;
  message: ChatbotMessage;
  onCopy: (v: string) => void;
  onDelete: () => void;
  onEdit: () => void;
  onLike: (liked: boolean) => void;
  onRetry: () => void;
  urlRoot: string;
  urlProxyUrl: string;
}> = ({
  action: actionOrActionObject,
  disabledActions,
  message,
  onCopy,
  onDelete,
  onEdit,
  onLike,
  onRetry,
  urlRoot,
  urlProxyUrl,
}) => {
  const handleActionRef = useRef<() => void>();
  const getActionProps = () => {
    return isObject(actionOrActionObject)
      ? {
          action: actionOrActionObject.action,
          disabled:
            disabledActions?.includes(actionOrActionObject.action) ||
            !!actionOrActionObject.disabled,
          disableHandler: !!actionOrActionObject.popconfirm,
        }
      : {
          action: actionOrActionObject,
          disabled: disabledActions?.includes(actionOrActionObject) || false,
          disableHandler: false,
        };
  };
  const { action, disabled, disableHandler } = getActionProps();

  const getActionContent = () => {
    switch (action) {
      case 'copy':
        return (
          <CopyButton
            disabled={disabled}
            content={message.content}
            onCopy={onCopy}
            urlRoot={urlRoot}
            urlProxyUrl={urlProxyUrl}
          />
        );
      case 'like':
        handleActionRef.current = () => onLike(true);
        return (
          <Button
            variant="text"
            color={message.meta?.feedback === 'like' ? 'primary' : 'default'}
            disabled={disabled}
            size="small"
            icon={<LikeOutlined />}
            onClick={() => {
              !disableHandler && onLike(true);
            }}
          />
        );

      case 'dislike':
        handleActionRef.current = () => onLike(false);

        return (
          <Button
            variant="text"
            color={message.meta?.feedback === 'dislike' ? 'primary' : 'default'}
            size="small"
            icon={<DislikeOutlined />}
            disabled={disabled}
            onClick={() => !disableHandler && onLike(false)}
          />
        );
      case 'retry':
        handleActionRef.current = onRetry;
        return (
          <Button
            variant="text"
            color="default"
            size="small"
            disabled={disabled}
            icon={<SyncOutlined />}
            onClick={() => !disableHandler && onRetry()}
          />
        );
      case 'edit':
        handleActionRef.current = onEdit;
        return (
          <Button
            variant="text"
            color="default"
            size="small"
            disabled={disabled}
            icon={<EditOutlined />}
            onClick={() => !disableHandler && onEdit()}
          />
        );
      case 'delete':
        handleActionRef.current = onDelete;
        return (
          <Button
            variant="text"
            color="default"
            size="small"
            disabled={disabled}
            icon={<DeleteOutlined />}
            onClick={() => !disableHandler && onDelete()}
          />
        );
      default:
        return null;
    }
  };
  const actionContent = getActionContent();
  if (isObject(actionOrActionObject)) {
    const popconfirmProps: PopconfirmProps = {
      ...(typeof actionOrActionObject.popconfirm === 'string'
        ? { title: actionOrActionObject.popconfirm }
        : {
            ...actionOrActionObject.popconfirm,
            title: actionOrActionObject.popconfirm?.title,
          }),
      disabled,
      onConfirm() {
        handleActionRef.current?.();
      },
    };
    return React.createElement(
      actionOrActionObject.popconfirm ? Popconfirm : React.Fragment,
      actionOrActionObject.popconfirm ? popconfirmProps : undefined,
      React.createElement(
        actionOrActionObject.tooltip ? Tooltip : React.Fragment,
        actionOrActionObject.tooltip
          ? typeof actionOrActionObject.tooltip === 'string'
            ? { title: actionOrActionObject.tooltip }
            : actionOrActionObject.tooltip
          : undefined,
        actionContent
      )
    );
  }
  return actionContent;
};

export const ChatbotFooter: React.FC<ChatbotFooterProps> = ({
  isEditing,
  onEditCancel,
  onEditConfirm,
  onCopy,
  onEdit,
  onLike,
  onDelete,
  onRetry,
  editValues,
  message,
  extra,
  index,
  actions,
  disabledActions,
  urlRoot,
  urlProxyUrl,
}) => {
  if (isEditing) {
    return (
      <Flex justify="end">
        <Button
          variant="text"
          color="default"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => {
            onEditCancel?.();
          }}
        />
        <Button
          variant="text"
          color="default"
          size="small"
          icon={<CheckOutlined />}
          onClick={() => {
            const newContent = updateContent(message.content, editValues);
            onEditConfirm?.({
              index,
              value: newContent,
              previous_value: message.content,
            });
          }}
        />
      </Flex>
    );
  }
  return (
    <Flex
      justify="space-between"
      align="center"
      gap={extra && actions?.length ? 'small' : undefined}
    >
      {(message.role === 'user'
        ? ['extra', 'actions']
        : ['actions', 'extra']
      ).map((type) => {
        switch (type) {
          case 'extra':
            return (
              <Typography.Text key="extra" type="secondary">
                {extra}
              </Typography.Text>
            );
          case 'actions':
            return (
              <div key="actions">
                {(actions || []).map((action, i) => {
                  return (
                    <Action
                      key={`${action}-${i}`}
                      urlRoot={urlRoot}
                      urlProxyUrl={urlProxyUrl}
                      action={action}
                      disabledActions={disabledActions}
                      message={message}
                      onCopy={(v) => onCopy({ value: v, index })}
                      onDelete={() =>
                        onDelete({
                          index,
                          value: message.content,
                        })
                      }
                      onEdit={() => onEdit(index)}
                      onLike={(liked) =>
                        onLike?.({
                          value: message.content,
                          liked,
                          index,
                        })
                      }
                      onRetry={() =>
                        onRetry?.({
                          index,
                          value: message.content,
                        })
                      }
                    />
                  );
                })}
              </div>
            );
        }
      })}
    </Flex>
  );
};
