import { useMemo } from 'react';

import { getCustomProps } from '../../utils';
import { useMarkdownContext } from '../context';

export function useCustomProps<
  T extends {
    node?: Record<string, any>;
  },
>(
  nodeProps: T
): [
  T,
  {
    tagIndex: number;
    tagEnd: boolean;
  },
] {
  const { text } = useMarkdownContext();
  const tagProps = useMemo(() => {
    const node = nodeProps.node;
    const matches = text
      ?.slice(0, node?.position?.start?.offset)
      .match(new RegExp(`<${node?.tagName}`, 'g'));
    return {
      tagIndex: matches?.length || 0,
      tagEnd:
        typeof text[node?.position?.end.offset || 0] === 'string' ||
        text.endsWith(`</${node?.tagName}>`),
    };
  }, [nodeProps.node, text]);

  return [getCustomProps(nodeProps), tagProps];
}
