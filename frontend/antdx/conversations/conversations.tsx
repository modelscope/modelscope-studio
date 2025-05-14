import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import {
  Conversations as XConversations,
  type ConversationsProps,
} from '@ant-design/x';
import type { Conversation } from '@ant-design/x/es/conversations';
import type { ConversationsItemProps } from '@ant-design/x/es/conversations/Item';
import { createFunction } from '@utils/createFunction';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import type { MenuProps } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import classNames from 'classnames';
import { isFunction } from 'lodash-es';

import {
  useItems as useMenuItems,
  withItemsContextProvider as withMenuItemsContextProvider,
} from '../../antd/menu/context';

import { useItems, withItemsContextProvider } from './context';

import './index.less';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

function patchMenuEvents(menuProps: MenuProps, conversation: Conversation) {
  return Object.keys(menuProps).reduce((acc, key) => {
    if (key.startsWith('on') && isFunction(menuProps[key])) {
      const originalEvent = menuProps[key];
      if (key === 'onClick') {
        acc[key] = (menuInfo, ...args) => {
          menuInfo.domEvent.stopPropagation();
          originalEvent?.(conversation, menuInfo, ...args);
        };
      } else {
        acc[key] = (...args: any[]) => {
          originalEvent?.(conversation, ...args);
        };
      }
    } else {
      acc[key] = menuProps[key];
    }
    return acc;
  }, {} as MenuProps);
}

export const Conversations = sveltify<
  ConversationsProps & {
    setSlotParams: SetSlotParams;
  },
  [
    'menu.expandIcon',
    'menu.overflowedIndicator',
    'menu.trigger',
    'groupable.title',
  ]
>(
  withMenuItemsContextProvider(
    ['menu.items'],
    withItemsContextProvider(
      ['default', 'items'],
      ({ slots, setSlotParams, children, items, ...props }) => {
        const {
          items: { 'menu.items': menuItems },
        } = useMenuItems<['menu.items']>();
        const menuFunction = useFunction(props.menu);
        const supportGroupableConfig =
          typeof props.groupable === 'object' || slots['groupable.title'];
        const groupableConfig = getConfig(props.groupable);
        const groupableSortFunction = useFunction(props.groupable);
        const menu: ConversationsProps['menu'] = useMemo(() => {
          if (typeof props.menu === 'string') {
            return menuFunction;
          } else {
            const menuProps = (props.menu || {}) as NonNullable<
              ConversationsItemProps['menu']
            >;

            const hasMenu = menuProps.items?.length || menuItems.length > 0;
            if (!hasMenu) {
              return undefined;
            }
            return (conversation) => ({
              ...patchMenuEvents(menuProps, conversation),
              items:
                menuProps.items ||
                renderItems<ItemType>(menuItems, {
                  clone: true,
                }) ||
                [],
              trigger: slots['menu.trigger']
                ? renderParamsSlot(
                    { slots, setSlotParams, key: 'menu.trigger' },
                    { clone: true }
                  )
                : createFunction(menuProps.trigger, true) || menuProps.trigger,
              expandIcon: slots['menu.expandIcon']
                ? renderParamsSlot(
                    { slots, setSlotParams, key: 'menu.expandIcon' },
                    { clone: true }
                  )
                : menuProps.expandIcon,
              overflowedIndicator: slots['menu.overflowedIndicator'] ? (
                <ReactSlot slot={slots['menu.overflowedIndicator']} />
              ) : (
                menuProps.overflowedIndicator
              ),
            });
          }
        }, [menuFunction, menuItems, props.menu, setSlotParams, slots]);
        const { items: slotItems } = useItems<['default', 'items']>();
        const resolvedSlotItems =
          slotItems.items.length > 0 ? slotItems.items : slotItems.default;

        const resolvedItems = useMemo(() => {
          return (
            items ||
            renderItems<NonNullable<ConversationsProps['items']>[number]>(
              resolvedSlotItems,
              {
                clone: true,
              }
            )
          );
        }, [items, resolvedSlotItems]);

        return (
          <>
            <div style={{ display: 'none' }}>{children}</div>
            <XConversations
              {...props}
              menu={menu}
              classNames={{
                ...props.classNames,
                item: classNames(
                  props.classNames?.item,
                  'ms-gr-antdx-conversations-item'
                ),
              }}
              items={resolvedItems}
              groupable={
                supportGroupableConfig
                  ? {
                      ...groupableConfig,
                      title: slots['groupable.title']
                        ? renderParamsSlot({
                            slots,
                            setSlotParams,
                            key: 'groupable.title',
                          })
                        : groupableConfig.title,
                      sort: groupableSortFunction || groupableConfig.sort,
                    }
                  : props.groupable
              }
            />
          </>
        );
      }
    )
  )
);

export default Conversations;
