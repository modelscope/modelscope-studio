import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { ConversationsProps } from '@ant-design/x';

import { ItemHandler, type ItemHandlerProps } from '../context';

export const ConversationsItem = sveltify<
  Partial<NonNullable<ConversationsProps['items']>[number]> & ItemHandlerProps
>((props) => {
  return <ItemHandler {...props} />;
});

export default ConversationsItem;
