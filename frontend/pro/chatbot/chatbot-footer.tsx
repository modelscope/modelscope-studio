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
import { getContextText } from './utils';

export interface ChatbotFooterProps {
  isEditing: boolean;
  index: number;
  width: number;
  editValue: string;
  onEditCancel: () => void;
  onEditConfirm: (data: EditData) => void;
  message: ChatbotMessage;
  actions: (ChatbotBotConfig | ChatbotUserConfig)['actions'];
  onCopy: (data: CopyData) => void;
  onEdit: (index: number) => void;
  onDelete: (data: DeleteData) => void;
  onRetry?: (data: RetryData) => void;
  onLike?: (data: LikeData) => void;
}

export const CopyButton: React.FC<{
  content: ChatbotMessage['content'];
  onCopy?: (v: string) => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}> = ({ content, className, style, disabled, onCopy }) => {
  const text = useMemo(() => getContextText(content), [content]);
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
  message: ChatbotMessage;
  onCopy: (v: string) => void;
  onDelete: () => void;
  onEdit: () => void;
  onLike: (liked: boolean) => void;
  onRetry: () => void;
}> = ({
  action: actionOrActionObject,
  message,
  onCopy,
  onDelete,
  onEdit,
  onLike,
  onRetry,
}) => {
  const handleActionRef = useRef<() => void>();
  const renderAction = () => {
    const { action, disabled, disableHandler } = isObject(actionOrActionObject)
      ? {
          action: actionOrActionObject.action,
          disabled: !!actionOrActionObject.disabled,
          disableHandler: !!actionOrActionObject.popconfirm,
        }
      : {
          action: actionOrActionObject,
          disabled: false,
          disableHandler: false,
        };

    switch (action) {
      case 'copy':
        return (
          <CopyButton
            disabled={disabled}
            content={message.content}
            onCopy={onCopy}
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
  const actionContent = renderAction();
  if (isObject(actionOrActionObject)) {
    const popconfirmProps: PopconfirmProps = {
      ...(typeof actionOrActionObject.popconfirm === 'string'
        ? { title: actionOrActionObject.popconfirm }
        : {
            ...actionOrActionObject.popconfirm,
            title: actionOrActionObject.popconfirm?.title,
          }),
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
  editValue,
  message,
  width,
  index,
  actions,
}) => {
  if (isEditing) {
    return (
      <Flex justify="end" style={{ width }}>
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
            const text = getContextText(message.content);
            onEditConfirm?.({
              index,
              value: editValue,
              previous_value: text,
            });
          }}
        />
      </Flex>
    );
  }
  return (actions || []).map((action, i) => {
    return (
      <Action
        key={`${action}-${i}`}
        action={action}
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
  });
};
