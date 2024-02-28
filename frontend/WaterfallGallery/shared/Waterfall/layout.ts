export function minIndex(arr: number[]) {
  let acc = 0;
  for (let i = 0; i < arr.length; i++) acc = arr[acc] <= arr[i] ? acc : i;
  return acc;
}

export interface WaterfallOptions {
  cols: number;
  gap: number | [width: number, height: number];
}

export interface WaterfallEvents<T> {
  // w
  getWidth(el: T): number;
  setWidth(el: T, v: number): void;
  // h
  getHeight(el: T): number;
  setHeight(el: T, v: number): void;
  // padding
  getPadding(el: T): [number, number, number, number];
  // xy
  setX(el: T, v: number): void;
  setY(el: T, v: number): void;
  // children
  getChildren(el: T): T[];
}

export function waterfall_layout<T>(
  container: T,
  {
    getWidth,
    setWidth,
    getHeight,
    setHeight,
    getPadding,
    setX,
    setY,
    getChildren,
  }: WaterfallEvents<T>,
  { cols, gap }: WaterfallOptions
) {
  const [pt, pr, pb, pl] = getPadding(container);
  const children = getChildren(container);
  const len = children.length;
  const [widthGap, heightGap] = Array.isArray(gap) ? gap : [gap, gap];

  if (len) {
    const width =
      (getWidth(container) - widthGap * (cols - 1) - (pl + pr)) / cols;
    children.forEach((el) => {
      setWidth(el, width);
    });

    const childrenHeights = children.map((el) => getHeight(el));

    const stack = Array(cols).fill(pt);

    for (let i = 0; i < len; i++) {
      const el = children[i];
      const col = minIndex(stack);
      setY(el, stack[col]);
      setX(el, pl + (width + widthGap) * col);
      stack[col] += childrenHeights[i] + heightGap;
    }

    setHeight(container, Math.max(...stack) - heightGap + pb);
  } else {
    setHeight(container, pt + pb);
  }
}
