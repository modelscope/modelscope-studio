export function createFunction<T extends (...args: any[]) => any>(
  target: any
): T | undefined {
  try {
    return typeof target == 'string'
      ? (new Function(`return (...args) => (${target})(...args)`)() as T)
      : undefined;
  } catch {
    return undefined;
  }
}
