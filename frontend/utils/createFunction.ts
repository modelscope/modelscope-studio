function isFunctionString(str: string): boolean {
  const funcRegex =
    /^(?:async\s+)?(?:function\s*(?:\w*\s*)?\(|\([\w\s,=]*\)\s*=>|\(\{[\w\s,=]*\}\)\s*=>|function\s*\*\s*\w*\s*\()/i;

  return funcRegex.test(str.trim());
}

export function createFunction<T extends (...args: any[]) => any>(
  target: any,
  plainText = false
): T | undefined {
  try {
    if (plainText && !isFunctionString(target)) {
      return undefined;
    }
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
