import { createItemsContext } from '@utils/createItemsContext2';

export const {
  withItemsContextProvider: withRuleItemsContextProvider,
  useItems: useRuleItems,
  ItemHandler: RuleItemHandler,
} = createItemsContext();

export * from '@utils/createItemsContext2';
