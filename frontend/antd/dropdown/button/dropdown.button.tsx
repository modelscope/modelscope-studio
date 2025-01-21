import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Dropdown as ADropdown, type GetProps } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

import {
  useItems as useMenuItems,
  withItemsContextProvider as withMenuItemsContextProvider,
} from '../../menu/context';

export const DropdownButton = sveltify<
  GetProps<typeof ADropdown.Button> & {
    setSlotParams: SetSlotParams;
    value?: string;
  },
  [
    'icon',
    'buttonsRender',
    'dropdownRender',
    'menu.expandIcon',
    'menu.overflowedIndicator',
  ]
>(
  withMenuItemsContextProvider(
    ['menu.items'],
    ({
      getPopupContainer,
      slots,
      children,
      dropdownRender,
      buttonsRender,
      setSlotParams,
      value,
      ...props
    }) => {
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const dropdownRenderFunction = useFunction(dropdownRender);
      const buttonsRenderFunction = useFunction(buttonsRender);
      const buttonsRenderTargets = useTargets(children, 'buttonsRender');
      const targets = useTargets(children);
      const {
        items: { 'menu.items': menuItems },
      } = useMenuItems<['menu.items']>();
      return (
        <>
          <div style={{ display: 'none' }}>
            {targets.length > 0 ? null : children}
          </div>
          <ADropdown.Button
            {...props}
            buttonsRender={
              buttonsRenderTargets.length
                ? renderParamsSlot({
                    key: 'buttonsRender',
                    slots,
                    setSlotParams,
                    targets: buttonsRenderTargets,
                  })
                : buttonsRenderFunction
            }
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
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'dropdownRender',
                  })
                : dropdownRenderFunction
            }
            icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
          >
            {targets.length > 0 ? children : value}
          </ADropdown.Button>
        </>
      );
    }
  )
);

export default DropdownButton;
