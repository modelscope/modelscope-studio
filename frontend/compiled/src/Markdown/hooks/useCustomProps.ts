import { useMemo } from 'react';

import { getCustomProps } from '../../utils';
import { useMarkdownContext } from '../context';

export function useCustomProps<
  T extends {
    node?: Record<string, any>;
  },
>(nodeProps: T): [T, tagIndex: number] {
  const { text } = useMarkdownContext();
  const tagIndex = useMemo(() => {
    const node = nodeProps.node;
    const matches = text
      ?.slice(0, node?.position?.start?.offset)
      .match(new RegExp(`<${node?.tagName}`, 'g'));
    return matches?.length || 0;
  }, [nodeProps.node, text]);

  return [getCustomProps(nodeProps), tagIndex];
}
