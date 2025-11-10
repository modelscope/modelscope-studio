import { Editor, type EditorProps } from '@monaco-editor/react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { sveltify } from '@svelte-preprocess-react/sveltify';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { Spin } from 'antd';

import './monaco-editor.less';

export interface MonacoEditorProps extends EditorProps {
  themeMode?: string;
  height?: string | number;
  onValueChange: (value: string | undefined) => void;
  children?: React.ReactNode;
  afterMount?: EditorProps['onMount'];
}

export const MonacoEditor = sveltify<MonacoEditorProps, ['loading']>(
  ({
    height,
    value,
    className,
    style,
    themeMode,
    onValueChange,
    onChange,
    slots,
    beforeMount,
    afterMount,
    children,
    onMount,
    ...props
  }) => {
    const beforeMountFunction = useFunction(beforeMount);
    const afterMountFunction = useFunction(afterMount);

    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <div
          className={className}
          style={{
            ...style,
            height,
          }}
        >
          <Editor
            {...props}
            value={value}
            beforeMount={beforeMountFunction}
            onMount={(...args) => {
              onMount?.(...args);
              afterMountFunction?.(...args);
            }}
            loading={
              slots.loading ? (
                <ReactSlot slot={slots.loading} />
              ) : (
                props.loading || (
                  <Spin
                    tip="Editor is Loading..."
                    wrapperClassName="ms-gr-pro-monaco-editor-spin"
                  >
                    <div />
                  </Spin>
                )
              )
            }
            onChange={(v, ev) => {
              onValueChange(v);
              onChange?.(v, ev);
            }}
            theme={themeMode === 'dark' ? 'vs-dark' : 'light'}
          />
        </div>
      </>
    );
  }
);
export default MonacoEditor;
