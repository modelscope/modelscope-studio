import reactIframeTemplate from './react-iframe-template.html?raw';
import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useEffect, useMemo, useState } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { walkHtmlNodes } from '@utils/walkHtmlNodes';
import { Alert, notification, Spin } from 'antd';

import htmlIframeEventListener from './html-iframe-event-listener.js?raw';
import { WebSandboxParser } from './parser';
import {
  getEntryFile,
  getFileCode,
  type InputFileObject,
  renderHtmlTemplate,
} from './utils';

import './web-sandbox.less';

export interface WebSandboxProps {
  value?: Record<string, string | InputFileObject>;
  imports?: Record<string, string>;
  showRenderError?: boolean;
  showCompileError?: boolean;
  template?: 'react' | 'html';
  onCompileError?: (message: string) => void;
  onCompileSuccess?: () => void;
  onRenderError?: (message: string) => void;
  onCustom?: (...args: any[]) => void;
  height?: string | number;
  themeMode: string;
  setSlotParams: SetSlotParams;
  compileErrorRender?: (message: string) => React.ReactNode;
  children?: React.ReactNode;
}

export const WebSandbox = sveltify<WebSandboxProps, ['compileErrorRender']>(
  ({
    children,
    value,
    imports,
    slots,
    setSlotParams,
    template = 'react',
    themeMode,
    showRenderError,
    showCompileError,
    height,
    className,
    style,
    onCompileError,
    onRenderError,
    onCompileSuccess,
    compileErrorRender,
    onCustom,
  }) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const divRef = React.useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [compileError, setCompileError] = useState<string | null>(null);
    const [parsedValue, setParsedValue] = useState<
      | {
          entryUrl: string;
          styleSheetUrls: string[];
        }
      | {
          html: string;
        }
      | null
    >(null);
    const [notificationApi, contextHolder] = notification.useNotification({
      getContainer: () => divRef.current || document.body,
    });
    const compileErrorRenderFunction = useFunction(compileErrorRender);
    const onCompileErrorMemoized = useMemoizedFn(onCompileError);
    const onRenderErrorMemoized = useMemoizedFn(onRenderError);
    const onCompileSuccessMemoized = useMemoizedFn(onCompileSuccess);
    const onCustomMemoized = useMemoizedFn(onCustom);

    // Build import map (only includes third-party dependencies)
    const resolvedImportMap = useMemo(() => {
      return {
        ...(template === 'html'
          ? {}
          : {
              react: 'https://esm.sh/react',
              'react/': 'https://esm.sh/react/',
              'react-dom': 'https://esm.sh/react-dom',
              'react-dom/': 'https://esm.sh/react-dom/',
            }),
        ...imports,
      };
    }, [imports, template]);

    // Process all files and create Blob URLs
    useEffect(() => {
      if (!value) {
        setLoading(false);
        setParsedValue(null);
        setCompileError(null);
        return;
      }
      setLoading(true);
      setCompileError(null);

      try {
        const entryFile = getEntryFile(value, template);
        if (!entryFile) {
          throw new Error('Entry file not found');
        }
        if (template === 'html') {
          const scripts: {
            id: string;
            content: string;
          }[] = [];

          const rootNode = new DOMParser().parseFromString(
            getFileCode(value[entryFile]),
            'text/html'
          );
          walkHtmlNodes(rootNode, ['SCRIPT'], (node) => {
            if (node instanceof HTMLScriptElement) {
              const sandboxScriptId = `sandbox-script-${scripts.length}`;
              node.dataset.sandboxScriptId = sandboxScriptId;
              scripts.push({
                id: sandboxScriptId,
                content: node.innerHTML,
              });
            }
          });
          const parser = new WebSandboxParser({
            files: {
              ...value,
              ...scripts.reduce(
                (acc, script) => {
                  acc[`${script.id}.js`] = script.content;
                  return acc;
                },
                {} as Record<string, string>
              ),
            },
            importMap: resolvedImportMap,
            entryFilePath: '',
          });

          const { styleSheetUrls, normalizedFiles, cleanup } = parser.parse();
          const scriptElements = rootNode.querySelectorAll(
            'script[data-sandbox-script-id]'
          ) as NodeListOf<HTMLScriptElement>;

          scriptElements.forEach((script) => {
            const sandboxScriptId = script.dataset.sandboxScriptId;
            if (sandboxScriptId) {
              script.innerHTML =
                normalizedFiles[`${sandboxScriptId}.js`].transformedCode ||
                script.innerHTML;
              script.removeAttribute('data-sandbox-script-id');
            }
          });

          const fragment = document.createDocumentFragment();
          const importMapScript = document.createElement('script');
          importMapScript.type = 'importmap';
          importMapScript.innerHTML = JSON.stringify({
            imports: resolvedImportMap,
          });

          const eventListenerScript = document.createElement('script');
          eventListenerScript.innerHTML = htmlIframeEventListener;

          fragment.appendChild(importMapScript);
          styleSheetUrls.forEach((url) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            fragment.appendChild(link);
          });

          rootNode.head.appendChild(fragment);
          rootNode.body.appendChild(eventListenerScript);

          setParsedValue({
            html: rootNode.documentElement.outerHTML,
          });
          return () => {
            cleanup();
          };
        } else {
          const parser = new WebSandboxParser({
            files: value,
            importMap: resolvedImportMap,
            entryFilePath: entryFile,
          });

          const { styleSheetUrls, entryUrl, cleanup } = parser.parse();
          setParsedValue({
            entryUrl,
            styleSheetUrls,
          });
          return () => {
            cleanup();
          };
        }
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
        setParsedValue(null);
        onCompileErrorMemoized(message);
        setCompileError(message);
      }
    }, [onCompileErrorMemoized, resolvedImportMap, template, value]);

    // Create iframe HTML content
    const iframeUrl = useMemo(() => {
      if (!parsedValue) return '';
      // Template is html
      if ('html' in parsedValue) {
        return URL.createObjectURL(
          new Blob([parsedValue.html], { type: 'text/html' })
        );
      }
      const stylesheets = parsedValue.styleSheetUrls
        .map((url) => {
          return `<link rel="stylesheet" href="${url}">`;
        })
        .join('\n');

      const html = renderHtmlTemplate(reactIframeTemplate, {
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
          try {
            // Inject theme
            (iframeRef.current.contentWindow as any).gradio_theme = themeMode;
            (iframeRef.current.contentWindow as any).dispatch =
              onCustomMemoized;
          } catch {
            //
          }

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
              case 'sandbox-error':
                if (showRenderError) {
                  notificationApi.error({
                    message: 'Render Error',
                    description: data.message,
                  });
                }
                onRenderErrorMemoized(data.message as string);
                break;
              case 'sandbox-ready':
                onCompileSuccessMemoized();
                setLoading(false);
            }
          }
        };
        window.addEventListener('message', iframeMessageListener);

        return () => {
          window.removeEventListener('message', iframeMessageListener);
        };
      }
    }, [
      iframeUrl,
      notificationApi,
      onCompileSuccessMemoized,
      onCustomMemoized,
      onRenderErrorMemoized,
      showRenderError,
      themeMode,
    ]);

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
        {showCompileError && compileError ? (
          slots.compileErrorRender ? (
            <>
              <div style={{ display: 'none' }}>{children}</div>
              {renderParamsSlot({
                slots,
                setSlotParams,
                key: 'compileErrorRender',
              })?.(compileError)}
            </>
          ) : compileErrorRenderFunction ? (
            compileErrorRenderFunction(compileError)
          ) : (
            <Alert
              message="Compile Error"
              description={
                <pre style={{ whiteSpace: 'pre-wrap' }}>{compileError}</pre>
              }
              type="error"
              closable
              showIcon
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          )
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
