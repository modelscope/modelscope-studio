import iframeTemplate from './react-iframe-template.html?raw';
import { sveltify } from '@svelte-preprocess-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, notification, Spin } from 'antd';
import classNames from 'classnames';

import { WebSandboxParser } from './parser';
import { type InputFileObject, renderHtmlTemplate } from './utils';

import './web-sandbox.less';

export interface WebSandboxProps {
  value?: Record<string, string | InputFileObject>;
  importMap?: Record<string, string>;
  template?: 'react' | 'html';
  showIframeError?: boolean;
  height?: string | number;
  themeMode: string;
}

export const WebSandbox = sveltify<WebSandboxProps>(
  ({
    value,
    importMap,
    // template = 'react',
    themeMode,
    showIframeError,
    height = 500,
    className,
    style,
  }) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const divRef = React.useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{
      type: 'compile' | 'render';
      message: string;
    } | null>(null);
    const [parsedValue, setParsedValue] = useState<{
      entryUrl: string;
      styleSheetUrls: string[];
    } | null>(null);
    const [notificationApi, contextHolder] = notification.useNotification({
      getContainer: () => divRef.current || document.body,
    });

    // Build import map (only includes third-party dependencies)
    const resolvedImportMap = useMemo(() => {
      return {
        react: 'https://esm.sh/react',
        'react/': 'https://esm.sh/react/',
        'react-dom': 'https://esm.sh/react-dom',
        'react-dom/': 'https://esm.sh/react-dom/',
        ...importMap,
      };
    }, [importMap]);

    // Process all files and create Blob URLs
    useEffect(() => {
      setLoading(true);
      setError(null);

      try {
        const { styleSheetUrls, entryUrl, cleanup } = new WebSandboxParser({
          files: value || {},
          importMap: resolvedImportMap,
        }).parse();
        // setLoading(false);
        setParsedValue({
          entryUrl,
          styleSheetUrls,
        });
        return () => {
          cleanup();
        };
      } catch (e) {
        setLoading(false);
        let message = '';
        if (e instanceof Error) {
          message = e.message;
        } else if (typeof e === 'string') {
          message = e;
        }
        if (!message) {
          message = 'Compile error.';
        }
        setError({
          type: 'compile',
          message,
        });
      }
    }, [resolvedImportMap, value]);

    // Create iframe HTML content
    const iframeUrl = useMemo(() => {
      if (!parsedValue) return '';

      const stylesheets = parsedValue.styleSheetUrls
        .map((url) => {
          return `<link rel="stylesheet" href="${url}">`;
        })
        .join('\n');

      const html = renderHtmlTemplate(iframeTemplate, {
        importMap: JSON.stringify(resolvedImportMap),
        stylesheet: stylesheets,
        entryFile: parsedValue.entryUrl,
      });

      return URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    }, [parsedValue, resolvedImportMap]);

    useEffect(() => {
      // Update theme mode in iframe
      if (iframeUrl) {
        if (iframeRef.current?.contentWindow) {
          // Inject theme
          (iframeRef.current.contentWindow as any).gradio_theme = themeMode;

          iframeRef.current.contentWindow.postMessage({
            type: 'theme',
            theme: themeMode,
          });
        }
        const iframeMessageListener = (e: MessageEvent) => {
          if (e.source === iframeRef.current?.contentWindow) {
            const data = e.data as
              | { type?: string; message?: string }
              | undefined;
            switch (data?.type) {
              case 'error':
                notificationApi.error({
                  message: 'Render Error',
                  description: data.message,
                });
                break;
              case 'ready':
                setLoading(false);
            }
          }
        };
        window.addEventListener('message', iframeMessageListener);

        return () => {
          window.removeEventListener('message', iframeMessageListener);
        };
      }
    }, [iframeUrl, notificationApi, showIframeError, themeMode]);

    // Clean up iframe url
    useEffect(() => {
      return () => {
        if (iframeUrl) {
          URL.revokeObjectURL(iframeUrl);
        }
      };
    }, [iframeUrl]);

    return (
      <div
        ref={divRef}
        className={className}
        style={{
          height,
          ...style,
        }}
      >
        {error?.type === 'compile' ? (
          <Alert
            message={'Compile Error'}
            description={
              <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
            }
            type="error"
            closable
            showIcon
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <Spin
            spinning={loading}
            tip="Compiling..."
            wrapperClassName="ms-gr-pro-web-sandbox-spin"
          >
            {iframeUrl ? (
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                title="ModelScope Studio Web Sandbox Preview"
                className="ms-gr-pro-web-sandbox-iframe"
              />
            ) : null}
          </Spin>
        )}
        {contextHolder}
      </div>
    );
  }
);
export default WebSandbox;
