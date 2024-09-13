import { createItemsContext } from '@utils/createItemsContext';

const { getItems: getRuleItems, getSetItemFn: getSetRuleItemFn } =
  createItemsContext('form-item-rule');

export { getRuleItems, getSetRuleItemFn };
export * from '@utils/createItemsContext';
