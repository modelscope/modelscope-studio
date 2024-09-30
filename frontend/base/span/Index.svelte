<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import { getSlotContext } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import { styleObject2String } from '@utils/styleObject2String';
  import { writable } from 'svelte/store';

  import ShowFragment from '../fragment/ShowFragment.svelte';

  export let value: string = '';
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  // gradio properties
  export let gradio: Gradio;

  export let visible = true;
  export let _internal: {
    layout?: boolean;
    fragment?: boolean;
  } = {};

  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties | string = {};

  let el: HTMLSpanElement | undefined;

  const [mergedProps, update] = getSlotContext(
    {
      gradio,
      props: $updatedProps,
      _internal,
      value,
      as_item,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      restProps: $$restProps,
    },
    undefined,
    { shouldRestSlotKey: !_internal.fragment }
  );
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    value,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    restProps: $$restProps,
  });
  let events: { event: string; handler: (...args: any[]) => any }[] = [];

  $: {
    const reactEvents = bindEvents($mergedProps);
    events.forEach(({ event, handler }) => {
      el?.removeEventListener(event, handler);
    });
    events = Object.keys(reactEvents).reduce(
      (acc, prop) => {
        const event = prop.replace(/^on(.+)/, (_, replaceValue: string) => {
          return replaceValue[0].toLowerCase() + replaceValue.slice(1);
        });
        const handler = reactEvents[prop];
        el?.addEventListener(event, handler);
        acc.push({
          event,
          handler,
        });
        return acc;
      },
      [] as typeof events
    );
  }
</script>

{#if $mergedProps.visible}
  <ShowFragment {...$$props} show={$mergedProps._internal.fragment}>
    <span
      bind:this={el}
      style={typeof $mergedProps.elem_style === 'object'
        ? styleObject2String($mergedProps.elem_style)
        : $mergedProps.elem_style}
      class={$mergedProps.elem_classes.join(' ')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
    >
      {#if $mergedProps._internal.layout}
        <slot></slot>
      {:else}
        {$mergedProps.value}
      {/if}
    </span>
  </ShowFragment>
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
