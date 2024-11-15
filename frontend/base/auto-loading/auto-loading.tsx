import { sveltify } from '@svelte-preprocess-react';
import { type ConfigType } from '@svelte-preprocess-react/provider';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import type { LoadingStatus } from '@gradio/statustracker';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Alert, Spin } from 'antd';

import './auto-loading.less';

let instance: React.ReactNode = null;

export const AutoLoading = sveltify<
  {
    id?: string;
    configType: ConfigType;
    loadingStatus?: LoadingStatus | null;
    children?: React.ReactNode;
    setSlotParams: SetSlotParams;
  },
  ['render', 'errorRender']
>(
  ({
    slots,
    children,
    configType,
    loadingStatus,
    className,
    id,
    style,
    setSlotParams,
  }) => {
    let loadingContent:
      | React.ReactNode
      | ((...args: any[]) => React.ReactNode) = null;
    let errorContent: React.ReactNode | ((...args: any[]) => React.ReactNode) =
      null;
    if (
      loadingStatus?.status === 'pending' ||
      (loadingStatus?.status as string) === 'generating'
    ) {
      if (slots.render) {
        loadingContent = renderParamsSlot({
          setSlotParams,
          slots,
          key: 'render',
        })?.(loadingStatus);
      } else {
        switch (configType) {
          case 'antd':
            loadingContent = (
              <Spin
                size="small"
                delay={200}
                className="ms-gr-auto-loading-default-antd"
              />
            );
            break;
        }
      }
    }
    if (loadingStatus?.status === 'error' && !instance) {
      if (slots.errorRender) {
        errorContent = renderParamsSlot({
          setSlotParams,
          slots,
          key: 'errorRender',
        })?.(loadingStatus);
      } else {
        switch (configType) {
          case 'antd':
            instance = errorContent = (
              <Alert
                closable
                className="ms-gr-auto-loading-error-default-antd"
                message="Error"
                description={loadingStatus.message}
                type="error"
                onClose={() => {
                  instance = null;
                }}
              />
            );
            break;
        }
      }
    }

    return (
      <div className={className} id={id} style={style}>
        {loadingContent}
        {errorContent}
        {children}
      </div>
    );
  }
);

export default AutoLoading;
