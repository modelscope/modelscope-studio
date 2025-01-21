import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
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
    setSlotParams: SetSlotParams;
  },
  ['menu.expandIcon', 'dropdownRender', 'menu.overflowedIndicator']
>(
  withMenuItemsContextProvider(
    ['menu.items'],
    ({
      getPopupContainer,
      innerStyle,
      children,
      slots,
      dropdownRender,
      setSlotParams,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const dropdownRenderFunction = useFunction(dropdownRender);
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
                    // clone???
                    clone: true,
                  }) ||
                  []
                );
              }, [menuItems, props.menu?.items]),
              expandIcon: slots['menu.expandIcon']
                ? renderParamsSlot(
                    { slots, setSlotParams, key: 'menu.expandIcon' },
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
                      setSlotParams,
                      key: 'dropdownRender',
                    },
                    { clone: true }
                  )
                : dropdownRenderFunction
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
