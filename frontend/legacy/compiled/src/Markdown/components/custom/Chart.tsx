import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Components } from 'react-markdown';
import { Spin } from 'antd';
import cls from 'classnames';
import type { EChartsCoreOption } from 'echarts';

import { safeParseJSON } from '../../../utils';
import { useMarkdownContext } from '../../context';

export interface ChartProps {
  options?: string;
  style?: React.CSSProperties;
  className?: string;
}

const langs: Record<string, string> = {
  'en-US': 'en',
  'zh-CN': 'zh',
};

let echarts: typeof import('echarts') | undefined;

export const Chart: Components['chart'] = (props) => {
  const { options: _options = '', style, className } = props;
  const { theme, locale } = useMarkdownContext();
  const [asyncEcharts, setAsyncEcharts] = useState<
    typeof import('echarts') | undefined
  >(echarts);
  const divRef = useRef<HTMLDivElement>(null);
  const options = useMemo(() => {
    return safeParseJSON(_options, {} as EChartsCoreOption);
  }, [_options]);

  useEffect(() => {
    if (!echarts) {
      import('echarts').then((r) => {
        echarts = r;
        setAsyncEcharts(echarts);
      });
      return;
    }
    const el = divRef.current;
    if (!el || !asyncEcharts) {
      return;
    }
    const instance = asyncEcharts.init(el, theme, {
      locale: langs[locale] || 'en',
    });
    instance.setOption(options, true);
    let timeout: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        instance.resize();
      }, 500);
    });
    resizeObserver.observe(el);
    return () => {
      instance.dispose();
      resizeObserver.disconnect();
    };
  }, [asyncEcharts, locale, options, theme]);

  return (
    <Spin spinning={!asyncEcharts}>
      <div
        style={style}
        className={cls('ms-markdown-chart', className)}
        ref={divRef}
      />
    </Spin>
  );
};

export default Chart;
