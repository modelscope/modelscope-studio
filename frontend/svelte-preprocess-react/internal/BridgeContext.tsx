import { bindEvents, mapProps } from '@svelte-preprocess-react/component';
import {
  AutoCompleteContext,
  ContextPropsProvider,
  FormItemContext,
  SuggestionContext,
  useContextPropsContext,
} from '@svelte-preprocess-react/context';
import { ensureObjectCtxValue } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { patchProps } from '@utils/patchProps';

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
    __render_slotParamsMappingFn: slotParamsMappingFn,
    __render_as_item: as_item,
    __render_restPropsMapping: restPropsMapping,
    // for events
    __render_eventProps: eventProps,
    ...rest
  } = props || {};
  // for render slot like this: (...args) => React.ReactNode
  const ctxProps = useMemo(() => {
    if (!initial || (!slotParamsMappingFn && !ctx)) {
      return {};
    }
    let value = params ? slotParamsMappingFn?.(...params) : undefined;
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
    const mergedCtxValue = mapProps(
      {
        ...ctxValue,
        ...value,
      },
      restPropsMapping,
      true
    );
    const restProps = patchProps(mergedCtxValue);
    if (!eventProps) {
      return {
        restProps,
        originalRestProps,
      };
    }
    const { __render_eventProps, ...events } = bindEvents(
      {
        ...eventProps.props,
        originalRestProps: {
          ...eventProps.props.originalRestProps,
          ...mergedCtxValue,
        },
      },
      eventProps.eventsMapping
    );
    return {
      restProps,
      events,
      originalRestProps,
    };
  }, [
    initial,
    slotParamsMappingFn,
    ctx,
    params,
    as_item,
    restPropsMapping,
    eventProps,
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
