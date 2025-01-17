export function convertToCamelCase(str: string) {
  return str.replace(/(^|_)(\w)/g, (_match, _separator, char, index) => {
    if (index === 0) {
      return char.toLowerCase();
    } else {
      return char.toUpperCase();
    }
  });
}
