import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useEffect, useRef } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Modal as AModal, type ModalFuncProps } from 'antd';
import type { ModalFuncWithPromise } from 'antd/es/modal/useModal';

export const ModalStatic = sveltify<
  ModalFuncProps & {
    setSlotParams: SetSlotParams;
    visible?: boolean;
    type?: 'info' | 'success' | 'error' | 'warning' | 'confirm';
    onVisible?: (visible: boolean) => void;
  },
  [
    'cancelButtonProps.icon',
    'cancelText',
    'closable.closeIcon',
    'closeIcon',
    'footer',
    'content',
    'title',
    'okButtonProps.icon',
    'okText',
    'modalRender',
  ]
>(
  ({
    slots,
    afterClose,
    afterOpenChange,
    getContainer,
    children,
    modalRender,
    setSlotParams,
    onVisible,
    onCancel,
    onOk,
    visible,
    type,
    ...props
  }) => {
    const afterOpenChangeFunction = useFunction(afterOpenChange);
    const afterCloseFunction = useFunction(afterClose);
    const getContainerFunction = useFunction(getContainer);
    const modalRenderFunction = useFunction(modalRender);
    const [modalApi, contextHolder] = AModal.useModal();
    const currentModalRef = useRef<ReturnType<ModalFuncWithPromise> | null>(
      null
    );

    useEffect(() => {
      if (visible) {
        currentModalRef.current = modalApi[type || 'info']({
          ...props,
          autoFocusButton:
            props.autoFocusButton === undefined ? null : props.autoFocusButton,
          afterOpenChange: afterOpenChangeFunction,
          afterClose: afterCloseFunction,
          getContainer:
            typeof getContainer === 'string'
              ? getContainerFunction
              : getContainer,
          okText: slots.okText ? (
            <ReactSlot slot={slots.okText} />
          ) : (
            props.okText
          ),
          okButtonProps: {
            ...(props.okButtonProps || {}),
            icon: slots['okButtonProps.icon'] ? (
              <ReactSlot slot={slots['okButtonProps.icon']} />
            ) : (
              props.okButtonProps?.icon
            ),
          },
          cancelText: slots.cancelText ? (
            <ReactSlot slot={slots.cancelText} />
          ) : (
            props.cancelText
          ),
          cancelButtonProps: {
            ...(props.cancelButtonProps || {}),
            icon: slots['cancelButtonProps.icon'] ? (
              <ReactSlot slot={slots['cancelButtonProps.icon']} />
            ) : (
              props.cancelButtonProps?.icon
            ),
          },
          closable: slots['closable.closeIcon']
            ? {
                ...(typeof props.closable === 'object' ? props.closable : {}),
                closeIcon: <ReactSlot slot={slots['closable.closeIcon']} />,
              }
            : props.closable,
          closeIcon: slots.closeIcon ? (
            <ReactSlot slot={slots.closeIcon} />
          ) : (
            props.closeIcon
          ),
          footer: slots.footer
            ? renderParamsSlot({ slots, setSlotParams, key: 'footer' })
            : props.footer,
          title: slots.title ? <ReactSlot slot={slots.title} /> : props.title,
          modalRender: slots.modalRender
            ? renderParamsSlot({ slots, setSlotParams, key: 'modalRender' })
            : modalRenderFunction,
          onCancel(...args) {
            onCancel?.(...args);
            onVisible?.(false);
          },
          onOk(...args) {
            onOk?.(...args);
            onVisible?.(false);
          },
        });
      } else {
        currentModalRef.current?.destroy();
        currentModalRef.current = null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        {contextHolder}
      </>
    );
  }
);

export default ModalStatic;
