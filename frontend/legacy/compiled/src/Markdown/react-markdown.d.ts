import type {
  AccordionProps,
  AccordionTitleProps,
} from './components/custom/Accordion';
import type { ChartProps } from './components/custom/Chart';
import type { FileProps } from './components/custom/File';
import type { FlushingEndProps } from './components/custom/FlushingEnd';
import type { SelectBoxProps } from './components/custom/SelectBox';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      file: FileProps;
      'select-box': SelectBoxProps;
      accordion: AccordionProps;
      'accordion-title': AccordionTitleProps;
      'flushing-end': FlushingEndProps;
      chart: ChartProps;
    }
  }
}
