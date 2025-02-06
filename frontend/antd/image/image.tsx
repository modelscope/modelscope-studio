import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Image as AImage } from 'antd';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}
type ImageProps = GetProps<typeof AImage>;
export const Image = sveltify<
  ImageProps & {
    setSlotParams: SetSlotParams;
  },
  [
    'placeholder',
    'preview.mask',
    'preview.closeIcon',
    'preview.toolbarRender',
    'preview.imageRender',
  ]
>(({ slots, preview, setSlotParams, children, ...props }) => {
  const previewConfig = getConfig(preview);
  const supportPreview =
    slots['preview.mask'] ||
    slots['preview.closeIcon'] ||
    slots['preview.toolbarRender'] ||
    slots['preview.imageRender'] ||
    preview !== false;
  const getContainerFunction = useFunction(previewConfig.getContainer);
  const previewToolbarRenderFunction = useFunction(previewConfig.toolbarRender);
  const previewImageRenderFunction = useFunction(previewConfig.imageRender);

  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <AImage
        {...props}
        preview={
          supportPreview
            ? (omitUndefinedProps({
                ...previewConfig,
                getContainer: getContainerFunction,
                toolbarRender: slots['preview.toolbarRender']
                  ? renderParamsSlot({
                      slots,
                      setSlotParams,
                      key: 'preview.toolbarRender',
                    })
                  : previewToolbarRenderFunction,
                imageRender: slots['preview.imageRender']
                  ? renderParamsSlot({
                      slots,
                      setSlotParams,
                      key: 'preview.imageRender',
                    })
                  : previewImageRenderFunction,

                ...(slots['preview.mask'] || Reflect.has(previewConfig, 'mask')
                  ? {
                      mask: slots['preview.mask'] ? (
                        <ReactSlot slot={slots['preview.mask']} />
                      ) : (
                        previewConfig.mask
                      ),
                    }
                  : {}),
                closeIcon: slots['preview.closeIcon'] ? (
                  <ReactSlot slot={slots['preview.closeIcon']} />
                ) : (
                  previewConfig.closeIcon
                ),
              }) as ImageProps['preview'])
            : false
        }
        placeholder={
          slots.placeholder ? (
            <ReactSlot slot={slots.placeholder} />
          ) : (
            props.placeholder
          )
        }
      />
    </>
  );
});

export default Image;
