import Ajv, { ErrorObject, Schema as JSONSchema } from 'ajv';
import localize from 'ajv-i18n/localize/zh';
import ELK from 'elkjs/lib/elk.bundled';

import type { FlowNode } from './type';

const elk = new ELK();

const ajv = new Ajv();

export const attrMatcher = /attr\((\w+)\)/;
export const attrItemMatcher = /attr_item\((\w+)\)/;

// ***** validation *****

const ajvLocales: Record<string, typeof localize> = {
  'zh-CN': localize,
};

export function compileValidationSchema(schema: JSONSchema) {
  try {
    return ajv.compile(schema);
  } catch (error) {
    return null;
  }
}

export function getValidationErrorMessage(
  errors:
    | ErrorObject<string, Record<string, any>, unknown>[]
    | null
    | undefined,
  locale?: string
) {
  if (locale && ajvLocales[locale]) {
    ajvLocales[locale](errors);
  }
  return ajv.errorsText(errors, { separator: '\n' });
}

// ***** validation *****

export function updateNodeAttrs(
  node: FlowNode,
  attrs: Record<string, any>,
  replace = false
): FlowNode {
  return {
    ...node,
    data: {
      ...node.data,
      attrs: replace
        ? attrs
        : {
            ...(
              node.data as {
                attrs: Record<string, any>;
              }
            ).attrs,
            ...attrs,
          },
    },
  };
}

export function createId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 12);
  return timestamp + randomPart;
}
