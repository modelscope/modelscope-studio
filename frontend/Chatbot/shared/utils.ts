import type { FileData } from '@gradio/client';

import { qwen } from './llm-thinking-presets';

export interface LLMThinkingPreset {
  type: 'qwen';
  action_input_title: string;
  action_output_title: string;
}

export type AvatarImage = { avatar: string; name?: string } | string | null;

export type AvatarImageItem = AvatarImage | AvatarImage[];

export interface SelectData {
  index: [number, number, number];
  value: any;
  selected?: boolean;
}

export interface LikeData {
  index: [number, number, number];
  value: any;
  liked?: boolean;
}

export interface FlushData {
  value: string;
  index: [number, number, number];
}

export type FileMessage = {
  file: FileData;
  alt_text?: string;
};

export type MultimodalMessage = {
  text: string;
  original_text: string;
  name?: string;
  avatar?: string | FileData | null;
  flushing?: boolean;
  files?: FileMessage[];
};

export type MultimodalMessageItem = MultimodalMessage | MultimodalMessage[];

export function ensureArray<T>(value: T) {
  return (Array.isArray(value) ? value : [value]) as T extends any[] ? T : T[];
}

export async function copy_to_clipboard(value: string) {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(value);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = value;

    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      return Promise.reject(error);
    } finally {
      textArea.remove();
    }
  }
}

export const format_chat_for_sharing = async (
  chat: [MultimodalMessage | null, MultimodalMessage | null][]
): Promise<string> => {
  const messages = await Promise.all(
    chat.map(async (message_pair) => {
      return await Promise.all(
        message_pair.map((message, i) => {
          if (message === null) return '';
          const speaker_emoji = i === 0 ? '😃' : '🤖';
          let html_content = message.text;

          if (Array.isArray(message.files) && message.files.length > 0) {
            html_content += '<br/>';
            message.files.forEach((fileMessage) => {
              const file = fileMessage.file;
              if (!file?.url) return '';
              const file_url = file.url;
              if (file.mime_type?.includes('audio')) {
                html_content += `<audio controls src="${file_url}"></audio>`;
              } else if (file.mime_type?.includes('video')) {
                html_content += `<video controls src="${file_url}"></video>`;
              } else if (file.mime_type?.includes('image')) {
                html_content += `<img src="${file_url}" />`;
              } else {
                html_content += `<a target="_blank" rel="noreferrer" href="${file_url}">${fileMessage.alt_text || fileMessage.file.alt_text || fileMessage.file.orig_name}</a>`;
              }
            });
          }

          return `${speaker_emoji}${message.name ? ` ${message.name}` : ''}: ${html_content}`;
        })
      );
    })
  );
  return messages
    .map((message_pair) =>
      message_pair.join(
        message_pair[0] !== '' && message_pair[1] !== '' ? '\n' : ''
      )
    )
    .join('\n');
};

export const should_flushing = (
  type: 'chatbot' | 'user',
  message: MultimodalMessage
) => {
  if (type === 'chatbot') {
    return message.flushing !== false;
  } else if (type === 'user') {
    return message.flushing;
  }
};

export function resolve_llm_thinking_presets(
  message: string,
  presets: LLMThinkingPreset[] = []
): string {
  let result = message;

  for (const preset of presets) {
    switch (preset.type) {
      case 'qwen':
        result = qwen(result, preset);
        break;
    }
  }

  return result;
}
