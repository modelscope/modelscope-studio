import { createItemsContext } from '@utils/createItemsContext';

export const {
  withItemsContextProvider: withRuleItemsContextProvider,
  useItems: useRuleItems,
  ItemHandler: RuleItemHandler,
} = createItemsContext('antd-form-item-rules');

export * from '@utils/createItemsContext';
