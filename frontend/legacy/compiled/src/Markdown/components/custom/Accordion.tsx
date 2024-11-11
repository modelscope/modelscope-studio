import React, { useEffect, useState } from 'react';
import type { Components } from 'react-markdown';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import cls from 'classnames';

import { useMarkdownContext } from '../../context';
import { useCustomProps } from '../../hooks/useCustomProps';

export interface AccordionProps {
  children?: React.ReactNode[];
  title?: string;
  node: {
    tagName: string;
  };
}

export interface AccordionTitleProps extends AccordionProps {
  onClick: () => void;
}

export const AccordionTitle: Components['accordion-title'] = ({
  children,
  onClick,
}) => {
  const childrenCount = React.Children.count(children);
  const lastInnerElementString =
    typeof React.Children.toArray(children)[childrenCount - 1] === 'string';
  return (
    <div
      onClick={onClick}
      className={cls(
        'ms-markdown-accordion-title',
        lastInnerElementString && 'ms-markdown-accordion-title-typing-string'
      )}
    >
      {children}
    </div>
  );
};

export const AccordionBody: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const childrenCount = React.Children.count(children);
  const lastInnerElementString =
    typeof React.Children.toArray(children)[childrenCount - 1] === 'string';
  return (
    <div
      className={cls(
        'ms-markdown-accordion-body',
        lastInnerElementString && 'ms-markdown-accordion-body-typing-string'
      )}
    >
      {children}
    </div>
  );
};

export const Accordion: Components['accordion'] = (nodeProps) => {
  const { flushing, end, last_flushing_end_index } = useMarkdownContext();
  const [{ children, title, node }, { tagEnd }] = useCustomProps(nodeProps);
  const textEnd =
    typeof end === 'boolean'
      ? (last_flushing_end_index || 0) > (node.position?.end.offset || 0) || end
      : true;
  const flushingEnd = flushing ? tagEnd : true;

  const hasEnd = flushingEnd && textEnd;
  const [open, setOpen] = useState(!hasEnd);
  let renderTitle: React.ReactNode = null;
  const renderBodyChildrenArray: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<AccordionTitleProps>(child) &&
      child.props?.node?.tagName === 'accordion-title'
    ) {
      renderTitle = child;
      return;
    }

    renderBodyChildrenArray.push(child);
  });
  const renderBody = <AccordionBody>{renderBodyChildrenArray}</AccordionBody>;
  useEffect(() => {
    setOpen(!hasEnd);
  }, [hasEnd]);

  return (
    <div
      className={cls(
        'ms-markdown-accordion',
        !flushingEnd && 'ms-markdown-accordion-typing'
      )}
    >
      <Collapse
        onChange={() => {
          setOpen(!open);
        }}
        activeKey={open ? ['default'] : []}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Collapse.Panel header={renderTitle || title} key="default">
          {renderBody}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
