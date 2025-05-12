import { walkHtmlNodes } from '@utils/walkHtmlNodes';
import Amuchina from 'amuchina';

const is_external_url = (link: string | null, root: string): boolean => {
  try {
    return !!link && new URL(link).origin !== new URL(root).origin;
  } catch {
    return false;
  }
};

export function sanitize(source: string, root: string): string {
  const amuchina = new Amuchina();
  const rootNode = new DOMParser().parseFromString(source, 'text/html');
  walkHtmlNodes(rootNode.body, 'A', (node) => {
    if (node instanceof HTMLElement && 'target' in node) {
      if (is_external_url(node.getAttribute('href'), root)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  return amuchina.sanitize(rootNode).body.innerHTML;
}
