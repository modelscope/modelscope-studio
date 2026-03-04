import {
  mapComponentProps,
  processEvents,
} from '@svelte-preprocess-react/component';
import {
  AutoCompleteContext,
  ContextPropsProvider,
  FormItemContext,
  SuggestionContext,
  useContextPropsContext,
} from '@svelte-preprocess-react/react-contexts';
import React, { useMemo } from 'react';
import { patchProps } from '@utils/patchProps';
import { isUndefined } from 'lodash-es';

function ensureObjectCtxValue(ctxValue: any) {
  if (isUndefined(ctxValue)) {
    return {};
  }

  return typeof ctxValue === 'object' && !Array.isArray(ctxValue)
    ? ctxValue
    : { value: ctxValue };
}
export interface BridgeContextProps {
  reactComponent: React.ComponentType<any>;
  props: Record<string, any>;
  children?: React.ReactNode[];
}

export const BridgeContext: React.FC<BridgeContextProps> = ({
  reactComponent,
  props,
  children,
}) => {
  const propsContext = useContextPropsContext();
  const { params, ctx, initial } = propsContext;
  const {
    // for params
    __render_slotParamsMapping: slotParamsMapping,
    __render_as_item: as_item,
    __render_restPropsMapping: restPropsMapping,
    __render_eventsRestProps: eventsRestProps,
    ...rest
  } = props || {};
  // for render slot like this: (...args) => React.ReactNode
  const ctxProps = useMemo(() => {
    if (!initial || (!slotParamsMapping && !ctx)) {
      return {};
    }
    let value = params ? slotParamsMapping?.(...params) : undefined;
    let ctxValue = ctx;

    const merged_as_item = ctx?.as_item ?? as_item;
    // The first element in the context will be computed once for slotParamsMapping.
    const originalRestProps = {
      ...ensureObjectCtxValue(ctxValue),
      ...ensureObjectCtxValue(value),
    };

    if (merged_as_item) {
      value = value?.[merged_as_item] || {};
      ctxValue = ctx?.[merged_as_item] || {};
    }
    ctxValue = ensureObjectCtxValue(ctxValue);
    value = ensureObjectCtxValue(value);
    const mergedCtxValue = mapComponentProps(
      {
        ...ctxValue,
        ...value,
      },
      restPropsMapping,
      true
    );
    const restProps = patchProps(mergedCtxValue);
    if (!eventsRestProps) {
      return {
        restProps,
        originalRestProps,
      };
    }
    const events = processEvents(
      {
        ...eventsRestProps,
        ...mergedCtxValue,
      },
      restPropsMapping
    );
    return {
      restProps,
      events,
      originalRestProps,
    };
  }, [
    initial,
    slotParamsMapping,
    ctx,
    params,
    as_item,
    restPropsMapping,
    eventsRestProps,
  ]);
  return (
    <FormItemContext.Provider value={null}>
      <SuggestionContext.Provider value={null}>
        <AutoCompleteContext.Provider value={null}>
          <ContextPropsProvider
            {...propsContext}
            ctx={ctxProps.originalRestProps}
          >
            {/* eslint-disable-next-line react/no-children-prop */}
            {React.createElement(reactComponent, {
              ...rest,
              ...ctxProps.restProps,
              ...ctxProps.events,
              children,
            })}
          </ContextPropsProvider>
        </AutoCompleteContext.Provider>
      </SuggestionContext.Provider>
    </FormItemContext.Provider>
  );
};
