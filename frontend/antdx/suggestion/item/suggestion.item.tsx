import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { SuggestionItem as SuggestionItemProps } from '@ant-design/x/es/suggestion';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const SuggestionItem = sveltify<SuggestionItemProps & ItemHandlerProps>(
  (props) => {
    return (
      <ItemHandler<['default']>
        {...props}
        allowedSlots={['default']}
        itemChildren={(items) =>
          items.default.length > 0 ? items.default : undefined
        }
      />
    );
  }
);

export default SuggestionItem;
