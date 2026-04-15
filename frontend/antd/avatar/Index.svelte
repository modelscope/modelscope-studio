<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import type { FileData } from '@gradio/client';
  import cls from 'classnames';

  const AwaitedAvatar = importComponent(() => import('./avatar'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    value: string | FileData;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      value,
      elem_classes,
      elem_id,
      elem_style,
      ...restProps
    } = getComponentProps();
    return {
      gradio,
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      value,
      visible,
      elem_id,
      elem_classes,
      elem_style,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const src = $derived.by(() => {
    if (typeof proceedProps.value === 'object' && proceedProps.value) {
      return proceedProps.value.url || '';
    }
    return proceedProps.value;
  });
</script>

<!-- $slots.default and slot fallbacks are not working in gradio -->
{#if proceedProps.visible}
  {#await AwaitedAvatar then Avatar}
    <Avatar
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-avatar')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      src={proceedProps.additionalProps.src || src}
    >
      {@render children?.()}
    </Avatar>
  {/await}
{/if}

<style>
</style>
