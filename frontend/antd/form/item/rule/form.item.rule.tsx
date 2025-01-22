import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import type { Rule } from 'antd/es/form';

import { type ItemHandlerProps, RuleItemHandler } from '../../context';

export const FormItemRule = sveltify<Rule & ItemHandlerProps>((props) => {
  return <RuleItemHandler {...props} />;
});

export default FormItemRule;
