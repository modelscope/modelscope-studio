import {
  DiffEditor,
  type DiffEditorProps,
  type OnValidate,
} from '@monaco-editor/react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { sveltify } from '@svelte-preprocess-react/sveltify';
import React, { useEffect, useMemo, useRef } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { Spin } from 'antd';
import { isNumber } from 'lodash-es';
import type { editor, IDisposable } from 'monaco-editor';

import { useValueChange } from '../useValueChange';

import '../monaco-editor.less';

export interface MonacoDiffEditorProps extends DiffEditorProps {
  themeMode?: string;
  height?: string | number;
  children?: React.ReactNode;
  readOnly?: boolean;
  value?: string;
  onValueChange: (value: string | undefined) => void;
  onChange?: (
    value: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => void;
  onValidate?: OnValidate;
  afterMount?: DiffEditorProps['onMount'];
  line?: number;
}

export const MonacoDiffEditor = sveltify<MonacoDiffEditorProps, ['loading']>(
  ({
    height,
    className,
    style,
    themeMode,
    slots,
    beforeMount,
    afterMount,
    children,
    onMount,
    onChange,
    onValueChange,
    onValidate,
    value: valueProp,
    modified,
    options,
    readOnly,
    line,
    ...props
  }) => {
    const beforeMountFunction = useFunction(beforeMount);
    const afterMountFunction = useFunction(afterMount);
    const disposablesRef = useRef<IDisposable[]>([]);
    const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
    const [isEditorReady, setIsEditorReady] = React.useState(false);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: valueProp,
    });
    const onChangeMemoized = useMemoizedFn(onChange);
    const onValidateMemoized = useMemoizedFn(onValidate);
    const handleEditorMount: MonacoDiffEditorProps['onMount'] = (
      editor,
      monaco
    ) => {
      editorRef.current = editor;
      if (isNumber(line)) {
        editor.revealLine(line);
      }
      setIsEditorReady(true);
      const modifiedEditor = editor.getModifiedEditor();
      const mountDisposable = modifiedEditor.onDidChangeModelContent((e) => {
        const newValue = modifiedEditor.getValue();
        setValue(newValue);
        onChangeMemoized(newValue, e);
      });

      const validateDisposable = monaco.editor.onDidChangeMarkers((uris) => {
        const editorUri = modifiedEditor.getModel()?.uri;
        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find(
            (uri) => uri.path === editorUri.path
          );
          if (currentEditorHasMarkerChanges) {
            const markers = monaco.editor.getModelMarkers({
              resource: editorUri,
            });
            onValidateMemoized(markers);
          }
        }
      });
      disposablesRef.current.push(mountDisposable, validateDisposable);
    };

    useEffect(() => {
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        disposablesRef.current.forEach((disposable) => {
          disposable.dispose();
        });
      };
    }, []);

    useEffect(() => {
      if (isEditorReady && isNumber(line)) {
        editorRef.current?.revealLine(line);
      }
    }, [line, isEditorReady]);

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
          <DiffEditor
            {...props}
            options={useMemo(
              () => ({
                readOnly,
                ...(options || {}),
              }),
              [options, readOnly]
            )}
            modified={value || modified}
            beforeMount={beforeMountFunction}
            onMount={(editor, monaco) => {
              handleEditorMount(editor, monaco);
              onMount?.(editor, monaco);
              afterMountFunction?.(editor, monaco);
            }}
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
            theme={themeMode === 'dark' ? 'vs-dark' : 'light'}
          />
        </div>
      </>
    );
  }
);
export default MonacoDiffEditor;
