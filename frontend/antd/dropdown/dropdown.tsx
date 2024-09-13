import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { type Item } from '@utils/createItemsContext';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { Dropdown as ADropdown, type GetProps } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

export const Dropdown = sveltify<
  GetProps<typeof ADropdown> & {
    menuItems: Item[];
    innerStyle?: React.CSSProperties;
  },
  ['menu.expandIcon', 'menu.overflowedIndicator']
>(
  ({
    getPopupContainer,
    innerStyle,
    children,
    slots,
    menuItems,
    dropdownRender,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const dropdownRenderFunction = useFunction(dropdownRender);
    return (
      <>
        <ADropdown
          {...props}
          menu={{
            ...props.menu,
            items: useMemo(() => {
              return props.menu?.items || renderItems<ItemType>(menuItems);
            }, [menuItems, props.menu?.items]),
            expandIcon: slots['menu.expandIcon'] ? (
              <ReactSlot slot={slots['menu.expandIcon']} clone />
            ) : (
              props.menu?.expandIcon
            ),
            overflowedIndicator: slots['menu.overflowedIndicator'] ? (
              <ReactSlot slot={slots['menu.overflowedIndicator']} />
            ) : (
              props.menu?.overflowedIndicator
            ),
          }}
          getPopupContainer={getPopupContainerFunction}
          dropdownRender={dropdownRenderFunction}
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
);

export default Dropdown;
