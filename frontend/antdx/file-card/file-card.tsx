import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderParamsSlot } from '@utils/renderParamsSlot';

import { BaseFileCard, type BaseFileCardProps } from './base';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

// sync with FileCardListItem
export const FileCard = sveltify<
  BaseFileCardProps & {
    children?: React.ReactNode;
  },
  [
    'imageProps.placeholder',
    'imageProps.preview.mask',
    'imageProps.preview.closeIcon',
    'imageProps.preview.toolbarRender',
    'imageProps.preview.imageRender',
    'description',
    'icon',
    'mask',
    'spinProps.icon',
    'spinProps.description',
    'spinProps.indicator',
  ]
>(({ imageProps, slots, children, ...props }) => {
  const previewConfig = getConfig(imageProps?.preview);
  const supportPreview =
    slots['imageProps.preview.mask'] ||
    slots['imageProps.preview.closeIcon'] ||
    slots['imageProps.preview.toolbarRender'] ||
    slots['imageProps.preview.imageRender'] ||
    imageProps?.preview !== false;
  const getContainerFunction = useFunction(previewConfig.getContainer);
  const previewToolbarRenderFunction = useFunction(previewConfig.toolbarRender);
  const previewImageRenderFunction = useFunction(previewConfig.imageRender);

  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <BaseFileCard
        {...props}
        icon={slots.icon ? <ReactSlot slot={slots.icon} /> : props.icon}
        description={
          slots.description ? (
            <ReactSlot slot={slots.description} />
          ) : (
            props.description
          )
        }
        mask={slots.mask ? <ReactSlot slot={slots.mask} /> : props.mask}
        spinProps={{
          ...props.spinProps,
          size: props.spinProps?.size || 'default',
          icon: slots['spinProps.icon'] ? (
            <ReactSlot slot={slots['spinProps.icon']} />
          ) : (
            props.spinProps?.icon
          ),
          description: slots['spinProps.description'] ? (
            <ReactSlot slot={slots['spinProps.description']} />
          ) : (
            props.spinProps?.description
          ),
          indicator: slots['spinProps.indicator'] ? (
            <ReactSlot slot={slots['spinProps.indicator']} />
          ) : (
            props.spinProps?.indicator
          ),
        }}
        imageProps={{
          ...imageProps,
          preview: supportPreview
            ? (omitUndefinedProps({
                ...previewConfig,
                getContainer: getContainerFunction,
                toolbarRender: slots['imageProps.preview.toolbarRender']
                  ? renderParamsSlot({
                      slots,
                      key: 'imageProps.preview.toolbarRender',
                    })
                  : previewToolbarRenderFunction,
                imageRender: slots['imageProps.preview.imageRender']
                  ? renderParamsSlot({
                      slots,
                      key: 'imageProps.preview.imageRender',
                    })
                  : previewImageRenderFunction,

                ...(slots['imageProps.preview.mask'] ||
                Reflect.has(previewConfig, 'mask')
                  ? {
                      mask: slots['imageProps.preview.mask'] ? (
                        <ReactSlot slot={slots['imageProps.preview.mask']} />
                      ) : (
                        previewConfig.mask
                      ),
                    }
                  : {}),
                closeIcon: slots['imageProps.preview.closeIcon'] ? (
                  <ReactSlot slot={slots['imageProps.preview.closeIcon']} />
                ) : (
                  previewConfig.closeIcon
                ),
              }) as NonNullable<BaseFileCardProps['imageProps']>['preview'])
            : false,
          placeholder: slots['imageProps.placeholder'] ? (
            <ReactSlot slot={slots['imageProps.placeholder']} />
          ) : (
            imageProps?.placeholder
          ),
        }}
      />
    </>
  );
});

export default FileCard;
