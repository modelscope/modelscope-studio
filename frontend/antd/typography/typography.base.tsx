import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useSlotsChildren } from '@utils/hooks/useSlotsChildren';
import { useTargets } from '@utils/hooks/useTargets';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Typography } from 'antd';
import type { EllipsisConfig } from 'antd/es/typography/Base';
import cls from 'classnames';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const TypographyBase = sveltify<
  GetProps<typeof Typography.Paragraph> &
    GetProps<typeof Typography.Text> &
    GetProps<typeof Typography.Title> &
    GetProps<typeof Typography.Link> & {
      component: 'title' | 'paragraph' | 'text' | 'link';
      setSlotParams: SetSlotParams;
      value?: string;
    },
  [
    // list
    'copyable.icon',
    // list
    'copyable.tooltips',
    'editable.icon',
    'editable.tooltip',
    'editable.enterIcon',
    'ellipsis.symbol',
    'ellipsis.tooltip',
    'ellipsis.tooltip.title',
  ]
>(
  ({
    component,
    className,
    slots,
    children,
    copyable,
    editable,
    ellipsis,
    setSlotParams,
    value,
    ...props
  }) => {
    const copyableTooltipsTargets = useTargets(children, 'copyable.tooltips');
    const copyableIconTargets = useTargets(children, 'copyable.icon');
    const supportCopy =
      slots['copyable.icon'] || copyableTooltipsTargets.length > 0 || copyable;
    const supportEdit =
      slots['editable.icon'] ||
      slots['editable.tooltip'] ||
      slots['editable.enterIcon'] ||
      editable;
    const supportEllipsis =
      slots['ellipsis.symbol'] ||
      slots['ellipsis.tooltip'] ||
      slots['ellipsis.tooltip.title'] ||
      ellipsis;
    const copyableConfig = getConfig(copyable);
    const editableConfig = getConfig(editable);
    const ellipsisConfig = getConfig(ellipsis);

    const TypographyComponent = useMemo(() => {
      switch (component) {
        case 'title':
          return Typography.Title;
        case 'paragraph':
          return Typography.Paragraph;
        case 'text':
          return Typography.Text;
        case 'link':
          return Typography.Link;
      }
    }, [component]);
    const [slotsChildren, restChildren] = useSlotsChildren(children);
    const targets = useTargets(children);
    return (
      <>
        <div style={{ display: 'none' }}>{slotsChildren}</div>
        <TypographyComponent
          {...props}
          className={cls(className, `ms-gr-antd-typography-${component}`)}
          copyable={
            supportCopy
              ? omitUndefinedProps({
                  text: value,
                  ...copyableConfig,
                  tooltips:
                    copyableTooltipsTargets.length > 0
                      ? copyableTooltipsTargets.map((slot, index) => {
                          return <ReactSlot key={index} slot={slot} />;
                        })
                      : copyableConfig.tooltips,
                  icon:
                    copyableIconTargets.length > 0
                      ? copyableIconTargets.map((slot, index) => {
                          return <ReactSlot key={index} slot={slot} clone />;
                        })
                      : copyableConfig.icon,
                })
              : undefined
          }
          editable={
            supportEdit
              ? {
                  ...editableConfig,
                  icon: slots['editable.icon'] ? (
                    <ReactSlot slot={slots['editable.icon']} clone />
                  ) : (
                    editableConfig.icon
                  ),
                  tooltip: slots['editable.tooltip'] ? (
                    <ReactSlot slot={slots['editable.tooltip']} />
                  ) : (
                    editableConfig.tooltip
                  ),
                  enterIcon: slots['editable.enterIcon'] ? (
                    <ReactSlot slot={slots['editable.enterIcon']} />
                  ) : (
                    editableConfig.enterIcon
                  ),
                }
              : undefined
          }
          ellipsis={
            (component === 'link'
              ? !!supportEllipsis
              : supportEllipsis
                ? ({
                    ...ellipsisConfig,
                    symbol: slots['ellipsis.symbol']
                      ? renderParamsSlot(
                          {
                            key: 'ellipsis.symbol',
                            setSlotParams,
                            slots,
                          },
                          { clone: true }
                        )
                      : ellipsisConfig.symbol,
                    tooltip: slots['ellipsis.tooltip'] ? (
                      <ReactSlot slot={slots['ellipsis.tooltip']} />
                    ) : (
                      {
                        ...ellipsisConfig.tooltip,
                        title: slots['ellipsis.tooltip.title'] ? (
                          <ReactSlot slot={slots['ellipsis.tooltip.title']} />
                        ) : (
                          ellipsisConfig.tooltip?.title
                        ),
                      }
                    ),
                  } as EllipsisConfig)
                : undefined) as boolean
          }
        >
          {targets.length > 0 ? restChildren : value}
        </TypographyComponent>
      </>
    );
  }
);

export default TypographyBase;
