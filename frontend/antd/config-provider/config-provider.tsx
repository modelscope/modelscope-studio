import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useEffect, useState } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { ConfigProvider as AConfigProvider, type GetProps, theme } from 'antd';
import type { Locale } from 'antd/es/locale';
import dayjs from 'dayjs';
import { produce } from 'immer';

import { getDefaultLocale, locales } from './locales';

const combinePropsAndSlots = (
  props: Record<string, any>,
  slots: Record<string, HTMLElement>
) => {
  return produce(props, (draft) => {
    Object.keys(slots).forEach((slot) => {
      const splits = slot.split('.');
      let current = draft;
      for (let i = 0; i < splits.length - 1; i++) {
        const split = splits[i];
        if (!current[split]) {
          current[split] = {};
        }
        current = current[split];
      }
      current[splits[splits.length - 1]] = (
        <ReactSlot slot={slots[slot]} clone />
      );
    });
  });
};

type ConfigProviderProps = GetProps<typeof AConfigProvider>;

export const ConfigProvider = sveltify<
  Omit<ConfigProviderProps, 'theme' | 'locale'> & {
    themeMode: string;
    theme?: Omit<ConfigProviderProps['theme'], 'algorithm'> & {
      algorithm?: {
        // Auto recognition
        dark?: boolean;
        compact?: boolean;
      };
    };
    locale?: string;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    component?: React.ComponentType<ConfigProviderProps>;
    setSlotParams: SetSlotParams;
  },
  ['renderEmpty']
>(
  ({
    slots,
    themeMode,
    id,
    className,
    style,
    locale: localeProp = 'en_US',
    getTargetContainer,
    getPopupContainer,
    renderEmpty,
    setSlotParams,
    children,
    component,
    ...props
  }) => {
    const [locale, setLocale] = useState<Locale>(() => {
      return getDefaultLocale();
    });
    const algorithm = {
      dark: themeMode === 'dark' ? true : false,
      ...(props.theme?.algorithm || {}),
    };

    const getPopupContainerFunction = useFunction(getPopupContainer);
    const getTargetContainerFunction = useFunction(getTargetContainer);
    const renderEmptyFunction = useFunction(renderEmpty);
    useEffect(() => {
      if (localeProp && locales[localeProp]) {
        locales[localeProp]().then(
          ({ antd: antdLocale, dayjs: dayjsLocale }) => {
            setLocale(antdLocale);
            dayjs.locale(dayjsLocale);
          }
        );
      }
    }, [localeProp]);
    const ProviderComponent = component || AConfigProvider;
    return (
      <div id={id} className={className} style={style}>
        <StyleProvider hashPriority="high" container={document.body}>
          <ProviderComponent
            prefixCls="ms-gr-ant"
            {...combinePropsAndSlots(props, slots)}
            locale={locale}
            getPopupContainer={getPopupContainerFunction}
            getTargetContainer={getTargetContainerFunction}
            renderEmpty={
              slots.renderEmpty
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'renderEmpty',
                  })
                : renderEmptyFunction
            }
            // switch bug
            // key={`${algorithm.dark}`}
            theme={{
              cssVar: true,
              ...props.theme,
              algorithm: Object.keys(algorithm)
                .map((algo) => {
                  switch (algo) {
                    case 'dark':
                      return algorithm[algo] ? theme.darkAlgorithm : null;
                    case 'compact':
                      return algorithm[algo] ? theme.compactAlgorithm : null;
                    default:
                      return null;
                  }
                })
                .filter(Boolean) as NonNullable<
                ConfigProviderProps['theme']
              >['algorithm'],
            }}
          >
            {children}
          </ProviderComponent>
        </StyleProvider>
      </div>
    );
  }
);

export default ConfigProvider;
