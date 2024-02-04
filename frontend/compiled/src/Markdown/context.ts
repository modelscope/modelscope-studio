import React from 'react';

import { CustomComponents } from './type';

export interface MarkdownContextValue {
  text: string;
  end?: boolean;
  preview?: boolean;
  disabled?: boolean;
  last_flushing_end_index?: number;
  header_links?: boolean;
  flushing?: boolean;
  theme: 'light' | 'dark';
  on_custom: (tag: string, tagIndex: number, data?: any) => void;
  custom_components: CustomComponents;
}

export const MarkdownContext = React.createContext<MarkdownContextValue>({
  text: '',
  theme: 'light',
  on_custom: () => {},
  custom_components: {},
});

export const useMarkdownContext = () => React.useContext(MarkdownContext);
