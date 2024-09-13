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
type ImageProps = GetProps<typeof AImage>;
export const Image = sveltify<
  ImageProps,
  ['placeholder', 'preview.mask', 'preview.closeIcon']
>(({ slots, preview, ...props }) => {
  const previewConfig = getConfig(preview);
  const supportPreview =
    slots['preview.mask'] || slots['preview.closeIcon'] || preview !== false;
  const getContainerFunction = useFunction(previewConfig.getContainer);

  return (
    <AImage
      {...props}
      preview={
        supportPreview
          ? ({
              ...previewConfig,
              getContainer: getContainerFunction,
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
            } as ImageProps['preview'])
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
  );
});

export default Image;
