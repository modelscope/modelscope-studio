import type { FileData } from '@gradio/client';
import { convertToCamelCase } from '@utils/convertToCamelCase';
import type { AvatarProps } from 'antd';
import { isObject } from 'lodash-es';

import type {
  ChatbotAvatar,
  ChatbotMessage,
  ChatbotSuggestionContent,
} from './type';

export const convertObjectKeyToCamelCase = <T>(obj: T): T => {
  if (!isObject(obj)) {
    return obj;
  }
  return Object.keys(obj).reduce((acc, key) => {
    acc[convertToCamelCase(key) as keyof T] = obj[key];
    return acc;
  }, {} as T);
};

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

export const getContextText = (
  content: ChatbotMessage['content'],
  options?: { fallback?: (v: ChatbotMessage['content']) => string }
) => {
  return typeof content === 'string'
    ? content
    : (options?.fallback?.(content) ?? JSON.stringify(content));
};

export const updateContent = (
  content: ChatbotMessage['content'],
  text: string
) => {
  try {
    return typeof content === 'string' ? text : JSON.parse(text);
  } catch {
    return content;
  }
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
