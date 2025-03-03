import type {
  BubbleProps,
  PromptProps,
  PromptsProps,
  WelcomeProps,
} from '@ant-design/x';
import type { Attachment } from '@ant-design/x/es/attachments';
import type { BubbleDataType } from '@ant-design/x/es/bubble/BubbleList';
import type { MarkdownProps } from '@globals/components';
import type { FileData } from '@gradio/client';
import type {
  AvatarProps,
  FlexProps,
  PopconfirmProps,
  TooltipProps,
} from 'antd';

export interface ChatbotPromptsConfig extends PromptsProps {
  elem_style?: React.CSSProperties;
  styles?: WelcomeProps['styles'];
  class_names?: WelcomeProps['classNames'];
  elem_classes?: string | string[];
}

export interface ChatbotWelcomeConfig extends Omit<WelcomeProps, 'icon'> {
  icon?: WelcomeProps['icon'] | FileData;
  prompts?: ChatbotPromptsConfig;
  elem_style?: React.CSSProperties;
  styles?: WelcomeProps['styles'];
  class_names?: WelcomeProps['classNames'];
  elem_classes?: string | string[];
}

export type ChatbotFileContent = (string | (Attachment & FileData))[];
export type ChatbotSuggestionContent = PromptProps[];
export type ChatbotThoughtContent = string;
export type ChatbotTextContent = string;

export interface ChatbotMarkdownConfig extends Omit<MarkdownProps, 'value'> {
  renderMarkdown?: boolean;
}
export type ChatbotTextContentConfig = ChatbotMarkdownConfig;
export type ChatbotThoughtContentConfig = ChatbotMarkdownConfig & {
  status?: 'pending' | 'done';
  title?: string;
};
export type ChatbotFileContentConfig = FlexProps;

export type ChatbotSuggestionContentConfig = ChatbotPromptsConfig;

export type ChatbotAvatar =
  | string
  | (Omit<AvatarProps, 'src'> & {
      src?: FileData | string;
    })
  | FileData;

export type ChatbotUserAction = 'copy' | 'edit' | 'delete';

export interface ChatbotUserActionObject {
  action: ChatbotUserAction;
  disabled?: boolean;
  tooltip?: string | TooltipProps;
  popconfirm?: string | PopconfirmProps;
}

export interface ChatbotUserConfig
  extends Omit<BubbleProps, 'avatar' | 'content'> {
  actions?: (ChatbotUserAction | ChatbotUserActionObject)[];
  avatar?: ChatbotAvatar;
  elem_style?: React.CSSProperties;
  class_names?: BubbleProps['classNames'];
  styles?: BubbleProps['styles'];
  elem_classes?: string | string[];
}

export type ChatbotBotAction = ChatbotUserAction | 'like' | 'dislike' | 'retry';

export interface ChatbotBotActionObject {
  action: ChatbotBotAction;
  disabled?: boolean;
  tooltip?: string | TooltipProps;
  popconfirm?: string | PopconfirmProps;
}

export interface ChatbotBotConfig
  extends Omit<BubbleProps, 'avatar' | 'content'> {
  actions?: (ChatbotBotAction | ChatbotBotActionObject)[];
  avatar?: ChatbotAvatar;
  elem_style?: React.CSSProperties;
  class_names?: BubbleProps['classNames'];
  styles?: BubbleProps['styles'];
  elem_classes?: string | string[];
}

export interface ChatbotMessage extends ChatbotBotConfig {
  role: 'user' | 'assistant' | 'system' | 'welcome';
  key?: string | number;
  type: 'text' | 'thought' | 'file' | 'suggestion';
  content_type: 'text' | 'thought' | 'file' | 'suggestion';
  content:
    | ChatbotFileContent
    | ChatbotSuggestionContent
    | ChatbotTextContent
    | ChatbotThoughtContent;
  content_options?:
    | ChatbotTextContentConfig
    | ChatbotThoughtContentConfig
    | ChatbotFileContentConfig
    | ChatbotSuggestionContentConfig;
  meta?: {
    feedback?: 'like' | 'dislike' | null;
  };
}

export type ChatbotMessages = ChatbotMessage[];

export interface LikeData {
  index: number;
  value: ChatbotMessage['content'];
  liked: boolean;
}

export interface CopyData {
  index: number;
  value: string;
}

export interface EditData {
  index: number;
  value: string;
  previous_value: string;
}

export interface DeleteData {
  index: number;
  value: BubbleDataType['content'];
}

export interface RetryData {
  index: number;
  value: BubbleDataType['content'];
}

export interface SuggestionData {
  index: number;
  value: PromptProps;
}

export interface WelcomePromptData {
  value: PromptProps;
}
