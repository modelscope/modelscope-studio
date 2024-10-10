import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { type Item } from '@utils/createItemsContext';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Dropdown as ADropdown, type GetProps } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

export const DropdownButton = sveltify<
  GetProps<typeof ADropdown.Button> & {
    menuItems: Item[];
    setSlotParams: SetSlotParams;
  },
  [
    'icon',
    'buttonsRender',
    'dropdownRender',
    'menu.expandIcon',
    'menu.overflowedIndicator',
  ]
>(
  ({
    getPopupContainer,
    slots,
    menuItems,
    children,
    dropdownRender,
    setSlotParams,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const dropdownRenderFunction = useFunction(dropdownRender);
    const buttonsRenderTargets = useTargets(children, 'buttonsRender');
    return (
      <ADropdown.Button
        {...props}
        buttonsRender={
          buttonsRenderTargets.length
            ? (...args) => {
                setSlotParams('buttonsRender', args);
                return buttonsRenderTargets.map((item, index) => {
                  return <ReactSlot slot={item} key={index} />;
                });
              }
            : props.buttonsRender
        }
        menu={{
          ...props.menu,
          items: useMemo(() => {
            return props.menu?.items || renderItems<ItemType>(menuItems);
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
      />
    );
  }
);

export default DropdownButton;
