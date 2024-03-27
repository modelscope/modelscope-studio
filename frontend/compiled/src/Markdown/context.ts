import React from 'react';

import { CustomComponents } from '../shared';

export interface MarkdownContextValue {
  text: string;
  end?: boolean;
  preview?: boolean;
  disabled?: boolean;
  last_flushing_end_index?: number;
  header_links?: boolean;
  flushing?: boolean;
  locale: string;
  theme: 'light' | 'dark';
  on_custom: (tag: string, tagIndex: number, data?: any) => void;
  custom_components: CustomComponents;
}

export const MarkdownContext = React.createContext<MarkdownContextValue>({
  text: '',
  theme: 'light',
  locale: 'en-US',
  on_custom: () => {},
  custom_components: {},
});

export const useMarkdownContext = () => React.useContext(MarkdownContext);
