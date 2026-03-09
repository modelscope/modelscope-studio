import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Dropdown as ADropdown, type GetProps } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

import {
  useItems as useMenuItems,
  withItemsContextProvider as withMenuItemsContextProvider,
} from '../menu/context';

export const Dropdown = sveltify<
  GetProps<typeof ADropdown> & {
    innerStyle?: React.CSSProperties;
  },
  [
    'menu.expandIcon',
    'dropdownRender',
    'popupRender',
    'menu.overflowedIndicator',
  ]
>(
  withMenuItemsContextProvider(
    ['menu.items'],
    ({
      getPopupContainer,
      innerStyle,
      children,
      slots,
      dropdownRender,
      popupRender,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const dropdownRenderFunction = useFunction(dropdownRender);
      const popupRenderFunction = useFunction(popupRender);
      const {
        items: { 'menu.items': menuItems },
      } = useMenuItems<['menu.items']>();
      return (
        <>
          <ADropdown
            {...props}
            menu={{
              ...props.menu,
              items: useMemo(() => {
                return (
                  props.menu?.items ||
                  renderItems<ItemType>(menuItems, {
                    clone: true,
                  }) ||
                  []
                );
              }, [menuItems, props.menu?.items]),
              expandIcon: slots['menu.expandIcon']
                ? renderParamsSlot(
                    { slots, key: 'menu.expandIcon' },
                    { clone: true }
                  )
                : props.menu?.expandIcon,
              overflowedIndicator: slots['menu.overflowedIndicator'] ? (
                <ReactSlot slot={slots['menu.overflowedIndicator']} />
              ) : (
                props.menu?.overflowedIndicator
              ),
            }}
            getPopupContainer={getPopupContainerFunction}
            dropdownRender={
              slots.dropdownRender
                ? renderParamsSlot(
                    {
                      slots,
                      key: 'dropdownRender',
                    },
                    { clone: true }
                  )
                : dropdownRenderFunction
            }
            popupRender={
              slots.popupRender
                ? renderParamsSlot(
                    {
                      slots,
                      key: 'popupRender',
                    },
                    { clone: true }
                  )
                : popupRenderFunction
            }
          >
            <div
              className="ms-gr-antd-dropdown-content"
              style={{
                display: 'inline-block',
                ...innerStyle,
              }}
            >
              {children}
            </div>
          </ADropdown>
        </>
      );
    }
  )
);

export default Dropdown;
