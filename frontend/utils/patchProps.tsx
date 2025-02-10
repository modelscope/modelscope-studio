import React from 'react';

export function patchProps(props: Record<string, any>) {
  if (props.key) {
    return {
      ...props,
      __internal_key: props.key,
    };
  }
  return props;
}

export function applyPatchToProps(props: Record<string, any>) {
  const { __internal_key, ...rest } = props;
  if (__internal_key) {
    return {
      ...rest,
      key: __internal_key,
    };
  }
  return rest;
}

// ==== SLOT PROPS ====
// eslint-disable-next-line react-refresh/only-export-components
const PatchSlotPropsWrapper: React.FC<{
  children: (props: Record<string, any>) => React.ReactNode;
}> = ({ children, ...args }) => {
  return <>{children(args)}</>;
};
export function patchSlotProps(
  fn: (props: Record<string, any>) => React.ReactNode
): React.ReactElement {
  // eslint-disable-next-line react/no-children-prop
  return React.createElement(PatchSlotPropsWrapper, {
    children: fn,
  });
}
