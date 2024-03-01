import { createWaterfall } from './createWaterfall';
import { WaterfallOptions } from './layout';

export class Waterfall {
  _layout: ReturnType<typeof createWaterfall>;

  constructor(
    el: HTMLElement,
    options: WaterfallOptions = {
      cols: 2,
      gap: 4,
    }
  ) {
    this._layout = createWaterfall(el, options);
    this._layout.mount();
  }

  unmount() {
    this._layout.unmount();
  }

  render() {
    this._layout.layout();
  }
}
