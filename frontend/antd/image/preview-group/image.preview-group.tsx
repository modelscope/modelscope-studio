import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Image as AImage } from 'antd';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

type ImagePreviewGroupProps = GetProps<typeof AImage.PreviewGroup>;

export const ImagePreviewGroup = sveltify<
  GetProps<typeof AImage.PreviewGroup>,
  ['preview.mask', 'preview.closeIcon']
>(({ slots, preview, ...props }) => {
  const previewConfig = getConfig(preview);
  const supportPreview =
    slots['preview.mask'] || slots['preview.closeIcon'] || preview !== false;
  const getContainerFunction = useFunction(previewConfig.getContainer);
  return (
    <AImage.PreviewGroup
      {...props}
      preview={
        supportPreview
          ? ({
              ...previewConfig,
              getContainer: getContainerFunction,
              ...{
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
              },
            } as ImagePreviewGroupProps['preview'])
          : false
      }
    />
  );
});

export default ImagePreviewGroup;
