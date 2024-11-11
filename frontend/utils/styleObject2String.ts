import type React from 'react';

const NO_UNIT_PROP = [
  'animationIterationCount',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowStart',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
];
export function styleObject2String(styleObj: React.CSSProperties) {
  if (!styleObj) {
    return '';
  }
  return Object.entries(styleObj).reduce((acc, [propName, propValue]) => {
    // Convert camelCase to kebab-case and add the value
    acc += `${propName.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()}: ${typeof propValue === 'number' && !NO_UNIT_PROP.includes(propName) ? propValue + 'px' : propValue};`;
    return acc;
  }, '');
}

export function styleObject2HtmlStyle(styleObj: React.CSSProperties) {
  if (!styleObj) {
    return {};
  }
  return Object.keys(styleObj).reduce(
    (acc, next) => {
      const value = styleObj[next as keyof React.CSSProperties];
      if (typeof value === 'number' && !NO_UNIT_PROP.includes(next)) {
        acc[next] = value + 'px';
      } else {
        acc[next] = value;
      }
      return acc;
    },
    {} as Record<string, any>
  );
}
