import React, { useEffect, useState } from 'react';
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
  const [localeConfig, setLocaleConfig] = useState<Locale | undefined>();
  useEffect(() => {
    if (locale) {
      setLocaleConfig(langs[locale]);
    }
  }, [locale]);

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          colorPrimary: primaryColor,
        },
        algorithm:
          theme === 'dark'
            ? AntdTheme.darkAlgorithm
            : AntdTheme.defaultAlgorithm,
      }}
      locale={localeConfig}
    >
      <StyleProvider
        hashPriority="high"
        transformers={[legacyLogicalPropertiesTransformer]}
      >
        {children}
      </StyleProvider>
    </ConfigProvider>
  );
};
