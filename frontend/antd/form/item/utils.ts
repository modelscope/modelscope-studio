import { createFunction } from '@utils/createFunction';
import type { Rule } from 'antd/es/form';

export function createRule(rule: Record<string, any>): Rule {
  const pattern = rule.pattern;

  return {
    ...rule,
    pattern: (() => {
      if (typeof pattern === 'string' && pattern.startsWith('/')) {
        const match = pattern.match(/^\/(.+)\/([gimuy]*)$/);
        if (match) {
          const [, regex, flags] = match;
          return new RegExp(regex, flags);
        }
      }
      return typeof pattern === 'string' ? new RegExp(pattern) : undefined;
    })()
      ? new RegExp(pattern)
      : undefined,
    defaultField: createFunction(rule.defaultField) || rule.defaultField,
    transform: createFunction(rule.transform),
    validator: createFunction(rule.validator),
  };
}
