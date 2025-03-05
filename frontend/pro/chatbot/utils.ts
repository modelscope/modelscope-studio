import type { FileData } from '@gradio/client';
import { getFileUrl } from '@utils/upload';
import type { AvatarProps } from 'antd';
import { isObject } from 'lodash-es';

import type {
  ChatbotAvatar,
  ChatbotFileContent,
  ChatbotMessage,
  ChatbotMessageContentObject,
  ChatbotSuggestionContent,
} from './type';

export const getAvatarProps = (
  avatar?: ChatbotAvatar
): AvatarProps | undefined => {
  if (!avatar) {
    return;
  }
  if (typeof avatar === 'string') {
    return { src: avatar };
  }
  const isFileData = (v: ChatbotAvatar): v is FileData => {
    return !!(v as FileData).url;
  };
  if (isFileData(avatar)) {
    return { src: avatar.url };
  }
  if (!avatar.src) {
    return avatar as AvatarProps;
  }
  return {
    ...avatar,
    src:
      typeof avatar.src === 'string'
        ? avatar.src
        : (avatar.src as FileData).url,
  };
};

export const normalizeMessageContent = (
  content: ChatbotMessage['content']
): ChatbotMessageContentObject[] => {
  if (typeof content === 'string') {
    return [
      {
        type: 'text',
        content,
      },
    ];
  }
  if (Array.isArray(content)) {
    return content.map((item) => {
      if (typeof item === 'string') {
        return {
          type: 'text',
          content: item,
        };
      }
      return item;
    });
  }
  if (isObject(content)) {
    return [content];
  }
  return [];
};

export const updateContent = (
  content: ChatbotMessage['content'],
  newValues: Record<number, string>
): ChatbotMessage['content'] => {
  if (typeof content === 'string') {
    return newValues[0];
  }
  if (Array.isArray(content)) {
    const newContent = [...content];
    Object.keys(newValues).forEach((key) => {
      const item = newContent[key as unknown as number];
      if (typeof item === 'string') {
        newContent[key] = newValues[key];
      } else {
        newContent[key] = {
          ...item,
          content: newValues[key],
        };
      }
    });
    return newContent;
  }
  if (isObject(content)) {
    return {
      ...content,
      content: newValues[0],
    };
  }
  return content;
};

export const getCopyText = (
  content: ChatbotMessage['content'],
  root: string,
  urlProxyUrl: string
) => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        return getCopyText(item, root, urlProxyUrl);
      })
      .filter(Boolean)
      .join('\n');
  }

  if (isObject(content)) {
    if (!(content.copyable ?? true)) {
      return '';
    }
    if (typeof content.content === 'string') {
      return content.content;
    }
    if (content.type === 'file') {
      return JSON.stringify(
        (content.content as ChatbotFileContent).map((item) =>
          getFileUrl(item, root, urlProxyUrl)
        )
      );
    }
    return JSON.stringify(content.content);
  }

  return JSON.stringify(content);
};

export const walkSuggestionContent = (
  content: ChatbotSuggestionContent,
  callback: (
    item: ChatbotSuggestionContent[number]
  ) => ChatbotSuggestionContent[number]
) => {
  return (content || []).map((item) => {
    return {
      ...callback(item),
      children: Array.isArray(item.children)
        ? walkSuggestionContent(item.children, callback)
        : undefined,
    };
  });
};
