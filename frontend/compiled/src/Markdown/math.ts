// override from https://github.com/KaTeX/KaTeX/blob/main/contrib/auto-render/splitAtDelimiters.js

export interface RenderMathInElementSpecificOptionsDelimiters {
  /**
   * A string which starts the math expression (i.e. the left delimiter)
   */
  left: string;
  /**
   * A string which ends the math expression (i.e. the right delimiter)
   */
  right: string;
  /**
   * A boolean of whether the math in the expression should be rendered in display mode or not
   */
  display: boolean;

  inline?: boolean;
}

const findEndOfMath = function (
  delimiter: string,
  text: string,
  startIndex: number
) {
  // Adapted from
  // https://github.com/Khan/perseus/blob/master/src/perseus-markdown.jsx
  let index = startIndex;
  let braceLevel = 0;

  const delimLength = delimiter.length;

  while (index < text.length) {
    const character = text[index];

    if (
      braceLevel <= 0 &&
      text.slice(index, index + delimLength) === delimiter
    ) {
      return index;
    } else if (character === '\\') {
      index++;
    } else if (character === '{') {
      braceLevel++;
    } else if (character === '}') {
      braceLevel--;
    }

    index++;
  }

  return -1;
};

const escapeRegex = function (string: string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const amsRegex = /^\\begin{/;

export const resolveDelimiters = function (
  text: string,
  delimiters: RenderMathInElementSpecificOptionsDelimiters[] = []
) {
  if (delimiters.length === 0) {
    return text;
  }
  let index: number;
  let result = '';

  const regexLeft = new RegExp(
    '(' + delimiters.map((x) => escapeRegex(x.left)).join('|') + ')'
  );

  while (true) {
    index = text.search(regexLeft);
    if (index === -1) {
      break;
    }
    if (index > 0) {
      result += text.slice(0, index);
      text = text.slice(index); // now text starts with delimiter
    }
    // ... so this always succeeds:
    const i = delimiters.findIndex((delim) => text.startsWith(delim.left));
    index = findEndOfMath(delimiters[i].right, text, delimiters[i].left.length);
    if (index === -1) {
      break;
    }
    const rawData = text.slice(0, index + delimiters[i].right.length);
    const math = amsRegex.test(rawData)
      ? rawData
      : text.slice(delimiters[i].left.length, index);

    text = text.slice(index + delimiters[i].right.length);
    if (delimiters[i].display) {
      const symbol = delimiters[i].inline ? '$' : '$$';
      result += symbol + math + symbol;
    } else {
      result += math;
    }
  }

  if (text !== '') {
    result += text;
  }

  return result;
};
