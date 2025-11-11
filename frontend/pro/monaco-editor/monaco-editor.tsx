import { Editor, type EditorProps } from '@monaco-editor/react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { sveltify } from '@svelte-preprocess-react/sveltify';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { Spin } from 'antd';

import { useValueChange } from './useValueChange';

import './monaco-editor.less';

export interface MonacoEditorProps extends EditorProps {
  themeMode?: string;
  height?: string | number;
  readOnly?: boolean;
  onValueChange: (value: string | undefined) => void;
  children?: React.ReactNode;
  afterMount?: EditorProps['onMount'];
}

export const MonacoEditor = sveltify<MonacoEditorProps, ['loading']>(
  ({
    height,
    value: valueProp,
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
    options,
    readOnly,
    ...props
  }) => {
    const beforeMountFunction = useFunction(beforeMount);
    const afterMountFunction = useFunction(afterMount);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: valueProp,
    });

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
            options={useMemo(
              () => ({
                readOnly,
                ...(options || {}),
              }),
              [options, readOnly]
            )}
            loading={
              slots.loading ? (
                <ReactSlot slot={slots.loading} />
              ) : (
                <Spin
                  tip={props.loading}
                  wrapperClassName="ms-gr-pro-monaco-editor-spin"
                >
                  <div />
                </Spin>
              )
            }
            onChange={(v, ev) => {
              setValue(v);
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
