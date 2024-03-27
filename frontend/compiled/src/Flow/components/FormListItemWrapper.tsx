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
    <div
      style={{
        display: 'flex',
      }}
    >
      {showRemove && (
        <MinusCircleOutlined
          onClick={() => {
            onRemove();
          }}
        />
      )}
      <div style={{ flex: 1, marginLeft: 8 }}>
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
