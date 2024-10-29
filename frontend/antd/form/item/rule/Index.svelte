<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlotKey } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import { createFunction } from '@utils/createFunction';
  import { writable } from 'svelte/store';

  import { getSetRuleItemFn } from '../../context';

  import './global.css';

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
    index?: number;
  } = {};

  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  const slotKey = getSlotKey();
  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    restProps: $$restProps,
  });
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    restProps: $$restProps,
  });
  const setRuleItem = getSetRuleItemFn();
  $: {
    const pattern =
      $mergedProps.props.pattern || $mergedProps.restProps.pattern;
    setRuleItem($slotKey, $mergedProps._internal.index || 0, {
      props: {
        ...$mergedProps.restProps,
        ...$mergedProps.props,
        ...bindEvents($mergedProps),
        pattern: (() => {
          if (typeof pattern === 'string' && pattern.startsWith('/')) {
            const match = pattern.match(/^\/(.+)\/([gimuy]*)$/);
            if (match) {
              const [, regex, flags] = match;
              return new RegExp(regex, flags);
            }
          }
          return new RegExp(pattern);
        })()
          ? new RegExp(pattern)
          : undefined,
        defaultField:
          createFunction(
            $mergedProps.props.defaultField ||
              $mergedProps.restProps.defaultField
          ) ||
          $mergedProps.props.defaultField ||
          $mergedProps.restProps.defaultField,
        transform: createFunction(
          $mergedProps.props.transform || $mergedProps.restProps.transform
        ),
        validator: createFunction(
          $mergedProps.props.validator || $mergedProps.restProps.validator
        ),
      },
      slots: {},
    });
  }
</script>

<style>
</style>
