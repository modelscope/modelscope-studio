import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import {
  materialDark,
  materialLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Mermaid as XMermaid, type MermaidProps } from '@ant-design/x';
import type { ItemType } from '@ant-design/x/es/actions/interface';
import { renderItems } from '@utils/renderItems';

import {
  useItems as useActionItems,
  withItemsContextProvider as withActionItemsContextProvider,
} from '../actions/context';

const customDarkStyle = {
  ...materialDark,
  'pre[class*="language-"]': {
    ...materialDark['pre[class*="language-"]'],
    margin: 0,
  },
};

const customLightStyle = {
  ...materialLight,
  'pre[class*="language-"]': {
    ...materialLight['pre[class*="language-"]'],
    margin: 0,
  },
};

export const Mermaid = sveltify<
  MermaidProps & {
    value?: string;
    themeMode: string;
  },
  ['header', 'actions.customActions']
>(
  withActionItemsContextProvider(
    ['actions.customActions'],
    ({ slots, children, value, themeMode, actions, config, ...props }) => {
      const {
        items: { 'actions.customActions': actionItems },
      } = useActionItems<['actions.customActions']>();

      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <XMermaid
            {...props}
            highlightProps={{
              style: themeMode === 'dark' ? customDarkStyle : customLightStyle,
              ...props.highlightProps,
            }}
            config={useMemo(() => {
              return {
                theme: themeMode === 'dark' ? 'dark' : 'base',
                ...config,
              };
            }, [config, themeMode])}
            actions={{
              ...actions,
              customActions: useMemo(() => {
                return (
                  actions?.customActions ||
                  renderItems<ItemType>(actionItems, {
                    clone: true,
                  }) ||
                  []
                );
              }, [actions?.customActions, actionItems]),
            }}
            header={
              slots.header ? <ReactSlot slot={slots.header} /> : props.header
            }
          >
            {value || ''}
          </XMermaid>
        </>
      );
    }
  )
);

export default Mermaid;
