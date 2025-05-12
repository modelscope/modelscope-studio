export function walkHtmlNodes(
  node: Node | null | HTMLElement,
  test: string | string[] | ((node: Node | HTMLElement) => boolean),
  callback: (node: Node | HTMLElement) => void
): void {
  if (
    node &&
    ((typeof test === 'string' && node.nodeName === test) ||
      (Array.isArray(test) && test.includes(node.nodeName)) ||
      (typeof test === 'function' && test(node)))
  ) {
    callback(node);
  }
  const children = node?.childNodes || [];
  for (let i = 0; i < children.length; i++) {
    walkHtmlNodes(children[i], test, callback);
  }
}
