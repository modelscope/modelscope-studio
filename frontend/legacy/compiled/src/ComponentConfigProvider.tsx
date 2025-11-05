import React, { useMemo } from 'react';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import type { Locale } from 'antd/es/locale';
import en_US from 'antd/locale/en_US';
import zh_CN from 'antd/locale/zh_CN';

const langs: Record<string, Locale> = {
  'en-US': en_US,
  'zh-CN': zh_CN,
};

const primaryColor = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue('--color-accent');

export interface ComponentConfigProviderProps {
  locale?: string | null;
  theme?: string | null;
  children?: React.ReactNode;
}

export const ComponentConfigProvider: React.FC<ComponentConfigProviderProps> = (
  props
) => {
  const { locale, theme, children } = props;

  const localeConfig = useMemo<Locale | undefined>(() => {
    if (locale) {
      return langs[locale];
    }
  }, [locale]);

  return (
    <ConfigProvider
      theme={useMemo(
        () => ({
          cssVar: true,
          token: {
            colorPrimary: primaryColor,
          },
          algorithm:
            theme === 'dark'
              ? AntdTheme.darkAlgorithm
              : AntdTheme.defaultAlgorithm,
        }),
        [theme]
      )}
      locale={localeConfig}
    >
      <StyleProvider
        hashPriority="high"
        // theme.useToken will rerender when this prop changed
        transformers={useMemo(() => [legacyLogicalPropertiesTransformer], [])}
      >
        {children}
      </StyleProvider>
    </ConfigProvider>
  );
};
