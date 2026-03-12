import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';

import type { BaseFileCardProps } from '../../../file-card/base';
import { ItemHandler, type ItemHandlerProps } from '../context';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const FileCardListItem = sveltify<
  BaseFileCardProps & ItemHandlerProps,
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
>(({ imageProps, slots, ...props }) => {
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
    <ItemHandler<['default']>
      {...props}
      slots={{
        ...slots,
        'imageProps.preview.toolbarRender': {
          el: slots['imageProps.preview.toolbarRender'],
          clone: true,
          withParams: true,
        },
        'imageProps.preview.imageRender': {
          el: slots['imageProps.preview.imageRender'],
          clone: true,
          withParams: true,
        },
      }}
      allowedSlots={['default']}
      itemProps={(itemProps) => {
        return {
          ...itemProps,
          imageProps: {
            ...(itemProps?.imageProps || {}),
            preview: supportPreview
              ? (omitUndefinedProps({
                  ...previewConfig,
                  getContainer: getContainerFunction,
                  toolbarRender: previewToolbarRenderFunction,
                  imageRender: previewImageRenderFunction,
                }) as NonNullable<BaseFileCardProps['imageProps']>['preview'])
              : false,
          },
        };
      }}
      itemChildren={(items) => {
        return items.default.length > 0 ? items.default : undefined;
      }}
    />
  );
});

export default FileCardListItem;
