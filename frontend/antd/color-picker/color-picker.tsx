import { sveltify } from '@svelte-preprocess-react';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { ColorPicker as AColorPicker, type GetProps } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const ColorPicker = sveltify<
  GetProps<typeof AColorPicker> & {
    onValueChange: (
      value: string | { color: string; percent: number }[]
    ) => void;
    onChange?: (
      value: string | { color: string; percent: number }[],
      ...args: any[]
    ) => void;
    value_format: 'rgb' | 'hex' | 'hsb';
  },
  ['panelRender', 'showText']
>(
  withItemsContextProvider(
    ['presets'],
    ({
      onValueChange,
      onChange,
      panelRender,
      showText,
      value,
      presets,
      children,
      value_format,
      slots,
      ...props
    }) => {
      const panelRenderFunction = useFunction(panelRender);
      const showTextFunction = useFunction(showText);
      const targets = useTargets(children);
      const {
        items: { presets: presetItems },
      } = useItems<['presets']>();
      return (
        <>
          {targets.length === 0 && (
            <div style={{ display: 'none' }}>{children}</div>
          )}

          <AColorPicker
            {...props}
            value={value}
            presets={useMemo(() => {
              return (
                presets ||
                renderItems<
                  NonNullable<GetProps<typeof AColorPicker>['presets']>[number]
                >(presetItems)
              );
            }, [presets, presetItems])}
            showText={
              slots.showText
                ? renderParamsSlot({ slots, key: 'showText' })
                : showTextFunction || showText
            }
            panelRender={
              slots.panelRender
                ? renderParamsSlot({ slots, key: 'panelRender' })
                : panelRenderFunction
            }
            onChange={(v, ...args) => {
              if (v.isGradient()) {
                const gradientColors = v.getColors().map((color) => {
                  const colors = {
                    rgb: color.color.toRgbString(),
                    hex: color.color.toHexString(),
                    hsb: color.color.toHsbString(),
                  };
                  return {
                    ...color,
                    color: colors[value_format],
                  };
                });
                onValueChange(gradientColors);
                onChange?.(gradientColors, ...args);
                return;
              }
              const colors = {
                rgb: v.toRgbString(),
                hex: v.toHexString(),
                hsb: v.toHsbString(),
              };
              onValueChange(colors[value_format]);
              onChange?.(colors[value_format], ...args);
            }}
          >
            {targets.length === 0 ? null : children}
          </AColorPicker>
        </>
      );
    }
  )
);

export default ColorPicker;
