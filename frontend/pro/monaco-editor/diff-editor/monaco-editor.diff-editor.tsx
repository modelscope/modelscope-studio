import {
  DiffEditor,
  type DiffEditorProps,
  type OnValidate,
} from '@monaco-editor/react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { sveltify } from '@svelte-preprocess-react/sveltify';
import React, { useEffect } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { Spin } from 'antd';
import type { editor, IDisposable } from 'monaco-editor';

import '../monaco-editor.less';

export interface MonacoDiffEditorProps extends DiffEditorProps {
  themeMode?: string;
  height?: string | number;
  children?: React.ReactNode;
  value?: string;
  onValueChange: (value: string | undefined) => void;
  onChange?: (
    value: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => void;
  onValidate?: OnValidate;
  afterMount?: DiffEditorProps['onMount'];
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
    value,
    modified,
    ...props
  }) => {
    const beforeMountFunction = useFunction(beforeMount);
    const afterMountFunction = useFunction(afterMount);
    const disposablesRef = React.useRef<IDisposable[]>([]);

    const handleEditorMount: MonacoDiffEditorProps['onMount'] = (
      editor,
      monaco
    ) => {
      const modifiedEditor = editor.getModifiedEditor();
      const mountDisposable = modifiedEditor.onDidChangeModelContent((e) => {
        const newValue = modifiedEditor.getValue();
        onValueChange(newValue);
        onChange?.(newValue, e);
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
            onValidate?.(markers);
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
            theme={themeMode === 'dark' ? 'vs-dark' : 'light'}
          />
        </div>
      </>
    );
  }
);
export default MonacoDiffEditor;
