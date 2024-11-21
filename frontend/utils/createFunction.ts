export function createFunction<T extends (...args: any[]) => any>(
  target: any
): T | undefined {
  try {
    if (typeof target == 'string') {
      let formattedStr = target.trim();
      if (formattedStr.startsWith(';')) {
        formattedStr = formattedStr.slice(1);
      }
      if (formattedStr.endsWith(';')) {
        formattedStr = formattedStr.slice(0, -1);
      }

      return new Function(
        `return (...args) => (${formattedStr})(...args)`
      )() as T;
    }
    return undefined;
  } catch {
    return undefined;
  }
}
