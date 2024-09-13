import { sveltify } from '@svelte-preprocess-react';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { renderItems } from '@utils/renderItems';
import { ColorPicker as AColorPicker, type GetProps } from 'antd';

import { type Item } from './context';

export const ColorPicker = sveltify<
  GetProps<typeof AColorPicker> & {
    onValueChange: (value: string) => void;
    onChange?: (value: string, ...args: any[]) => void;
    value_format: 'rgb' | 'hex' | 'hsb';
    presetItems: Item[];
  }
>(
  ({
    onValueChange,
    onChange,
    panelRender,
    showText,
    value,
    presets,
    presetItems,
    children,
    value_format,
    ...props
  }) => {
    const panelRenderFunction = useFunction(panelRender);
    const showTextFunction = useFunction(showText);
    const targets = useTargets(children);

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
          showText={showTextFunction}
          panelRender={panelRenderFunction}
          onChange={(v, ...args) => {
            const color = {
              rgb: v.toRgbString(),
              hex: v.toHexString(),
              hsb: v.toHsbString(),
            };
            onChange?.(color[value_format], ...args);
            onValueChange(color[value_format]);
          }}
        >
          {targets.length === 0 ? null : children}
        </AColorPicker>
      </>
    );
  }
);

export default ColorPicker;
