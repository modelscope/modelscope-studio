import { h } from 'hastscript';
import { visit } from 'unist-util-visit';

const directiveTagsMap: Record<string, string> = {
  'llm-thinking': 'accordion',
  'llm-thinking-title': 'accordion-title',
  accordion: 'accordion',
  'accordion-title': 'accordion-title',
  'flushing-end': 'flushing-end',
};

const transformNodeTree = (tree: any, file: any) =>
  visit(tree, (node) => {
    if (
      node.type === 'containerDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'textDirective'
    ) {
      if (!directiveTagsMap[node.name]) {
        const fileContent: string = file.value;
        node.value = fileContent.slice(
          node.position?.start?.offset,
          node.position?.end?.offset
        );
        node.type = 'text';
        return;
      }

      const data: Record<string, any> = node.data || (node.data = {});
      const hast = h(
        directiveTagsMap[node.name] || node.name,
        node.attributes || {}
      ) as any;
      data.hName = hast.tagName;
      data.hProperties = hast.properties;
    }
  });

const remarkDirectiveRehype = () => transformNodeTree;

export default remarkDirectiveRehype;
