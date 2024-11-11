import React from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';

export interface FormListItemWrapperProps {
  children: React.ReactNode;
  onRemove: () => void;
  showRemove?: boolean;
  index: number;
  [key: string]: any;
}

export const FormListItemWrapper: React.FC<FormListItemWrapperProps> = ({
  index,
  children,
  onRemove,
  showRemove,
  ...args
}) => {
  return (
    <div className="ms-flow-node-form-list-item">
      {showRemove && (
        <MinusCircleOutlined
          onClick={() => {
            onRemove();
          }}
        />
      )}
      <div className="ms-flow-node-form-list-item-content">
        {React.isValidElement(children)
          ? React.cloneElement(children, {
              index,
              ...children.props,
              ...args,
            })
          : children}
      </div>
    </div>
  );
};
