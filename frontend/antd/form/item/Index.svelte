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

  import { getRuleItems } from '../context';

  const AwaitedFormItem = importComponent(() => import('./form.item'));
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};
  export let label: string;
  export let form_name: string | number | (string | number)[];
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    label,
    form_name,
  });
  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    label,
    form_name,
  });
  const { rules: ruleItems } = getRuleItems(['rules']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedFormItem then FormItem}
    <FormItem
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-form-item')}
      id={$mergedProps.elem_id}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      name={$mergedProps.props.name ?? $mergedProps.form_name}
      label={$mergedProps.props.label ?? $mergedProps.label}
      slots={$slots}
      ruleItems={$ruleItems}
    >
      <slot />
    </FormItem>
  {/await}
{/if}

<style>
</style>
