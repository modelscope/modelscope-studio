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
