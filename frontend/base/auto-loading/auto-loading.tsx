import { sveltify } from '@svelte-preprocess-react';
import { type ConfigType } from '@svelte-preprocess-react/provider';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import type { LoadingStatus } from '@gradio/statustracker';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Alert, Spin, theme } from 'antd';

import { useLoadingStatus } from './useLoadingStatus';

import './auto-loading.less';

let instance: React.ReactNode = null;

function prettySi(num: number): string {
  const units = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z'];
  let i = 0;
  while (num > 1000 && i < units.length - 1) {
    num /= 1000;
    i++;
  }
  const unit = units[i];
  return (Number.isInteger(num) ? num : num.toFixed(1)) + unit;
}

export const AutoLoading = sveltify<
  {
    id?: string;
    configType: ConfigType;
    showMask?: boolean;
    showTimer?: boolean;
    loadingStatus?: LoadingStatus | null;
    loadingText?: string;
    children?: React.ReactNode;
    setSlotParams: SetSlotParams;
  },
  ['render', 'errorRender', 'loadingText']
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
    showMask,
    showTimer,
    loadingText,
  }) => {
    let loadingContent:
      | React.ReactNode
      | ((...args: any[]) => React.ReactNode) = null;
    let errorContent: React.ReactNode | ((...args: any[]) => React.ReactNode) =
      null;
    const {
      status,
      message,
      progress,
      queuePosition,
      queueSize,
      eta,
      formattedEta,
      formattedTimer,
    } = useLoadingStatus(loadingStatus);

    const isLoading =
      status === 'pending' || (status as string) === 'generating';
    const showLoadingText =
      slots.loadingText || typeof loadingText === 'string';
    const { token } = theme.useToken();

    if (isLoading) {
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
                style={{
                  zIndex: token.zIndexPopupBase,
                  backgroundColor: showMask ? token.colorBgMask : undefined,
                }}
                tip={
                  showLoadingText ? (
                    slots.loadingText ? (
                      renderParamsSlot({
                        setSlotParams,
                        slots,
                        key: 'loadingText',
                      })?.(loadingStatus)
                    ) : (
                      loadingText
                    )
                  ) : status === 'pending' ? (
                    <div style={{ textShadow: 'none' }}>
                      {progress
                        ? progress.map((p) => (
                            <React.Fragment key={p.index}>
                              {p.index != null && (
                                <>
                                  {p.length != null
                                    ? `${prettySi(p.index || 0)}/${prettySi(p.length)}`
                                    : `${prettySi(p.index || 0)}`}
                                  {p.unit}{' '}
                                </>
                              )}
                            </React.Fragment>
                          ))
                        : queuePosition !== null &&
                            queueSize !== undefined &&
                            typeof queuePosition === 'number' &&
                            queuePosition >= 0
                          ? `queue: ${queuePosition + 1}/${queueSize} |`
                          : queuePosition === 0
                            ? 'processing |'
                            : null}{' '}
                      {showTimer && (
                        <>
                          {formattedTimer}
                          {eta ? `/${formattedEta}` : ''}s
                        </>
                      )}
                    </div>
                  ) : null
                }
                className="ms-gr-auto-loading-default-antd"
              >
                <div />
              </Spin>
            );
            break;
        }
      }
    }
    if (status === 'error' && !instance) {
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
                style={{
                  zIndex: token.zIndexPopupBase,
                }}
                message="Error"
                description={message}
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
