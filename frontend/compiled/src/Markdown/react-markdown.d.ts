import {
  AccordionProps,
  AccordionTitleProps,
} from './components/custom/Accordion';
import { FileProps } from './components/custom/File';
import { FlushingEndProps } from './components/custom/FlushingEnd';
import { SelectBoxProps } from './components/custom/SelectBox';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      file: FileProps;
      'select-box': SelectBoxProps;
      accordion: AccordionProps;
      'accordion-title': AccordionTitleProps;
      'flushing-end': FlushingEndProps;
    }
  }
}
