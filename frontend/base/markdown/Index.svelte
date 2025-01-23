<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlots } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedMarkdown = importComponent(() => import('./markdown'));

  export let value: string = '';
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  // gradio properties
  export let gradio: Gradio;
  export let root: string;

  export let visible = true;
  export let _internal: {
    layout?: boolean;
  } = {};

  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  const slots = getSlots();
  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    value,
    as_item,
    visible,
    root,
    elem_id,
    elem_classes,
    elem_style,
    restProps: $$restProps,
  });
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    value,
    root,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedMarkdown then Markdown}
    <Markdown
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes)}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      root={$mergedProps.root}
      themeMode={gradio.theme}
      value={$mergedProps.value}
      slots={$slots}
    >
      <slot />
    </Markdown>
  {/await}
{/if}
