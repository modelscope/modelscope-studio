import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useEffect, useState } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { useFunction } from '@utils/hooks/useFunction';
import { ConfigProvider as AConfigProvider, type GetProps, theme } from 'antd';
import type { Locale } from 'antd/es/locale';
import dayjs from 'dayjs';
import { produce } from 'immer';

import 'dayjs/locale/zh-cn';

import { locales } from './locales';

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
    theme_mode: string;
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
  }
>(
  ({
    slots,
    theme_mode,
    id,
    className,
    style,
    locale: localeProp,
    getTargetContainer,
    getPopupContainer,
    children,
    ...props
  }) => {
    const [locale, setLocale] = useState<Locale>();
    const algorithm = {
      dark: theme_mode === 'dark' ? true : false,
      ...(props.theme?.algorithm || {}),
    };
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const getTargetContainerFunction = useFunction(getTargetContainer);

    useEffect(() => {
      if (localeProp && locales[localeProp]) {
        locales[localeProp]().then((m) => {
          setLocale(m.default);
          if (localeProp === 'zh_CN') {
            dayjs.locale('zh-cn');
          }
        });
      }
    }, [localeProp]);

    return (
      <div id={id} className={className} style={style}>
        <StyleProvider hashPriority="high" container={document.body}>
          <AConfigProvider
            prefixCls="ms-gr-ant"
            {...combinePropsAndSlots(props, slots)}
            locale={locale}
            getPopupContainer={getPopupContainerFunction}
            getTargetContainer={getTargetContainerFunction}
            theme={{
              cssVar: true,
              ...props.theme,
              algorithm: Object.keys(algorithm)
                .map((algo) => {
                  switch (algo) {
                    case 'dark':
                      return algorithm[algo]
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm;
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
          </AConfigProvider>
        </StyleProvider>
      </div>
    );
  }
);

export default ConfigProvider;