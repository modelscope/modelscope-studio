import { visit } from 'unist-util-visit';

function rehypeInlineCodeProperty() {
  return function (tree: any) {
    visit(tree, function (node, index, parent) {
      if (node.tagName === 'code') {
        if (parent && parent.tagName === 'pre') {
          node.properties.inline = false;
        } else {
          node.properties.inline = true;
        }
      }
    });
  };
}
export default rehypeInlineCodeProperty;
