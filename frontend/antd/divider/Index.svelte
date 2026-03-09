<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedDivider = importComponent(() => import('./divider'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    value?: string;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      value,
      ...restProps
    } = getComponentProps();
    return {
      gradio,
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      value,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
  const divider_props = $derived({
    style: proceedProps.elem_style,
    className: cls(proceedProps.elem_classes, 'ms-gr-antd-divider'),
    id: proceedProps.elem_id,
    ...proceedProps.restProps,
    ...proceedProps.additionalProps,
    slots: slots.value,
  });
</script>

{#if proceedProps.visible}
  {#await AwaitedDivider then Divider}
    {#if proceedProps._internal.layout}
      <Divider {...divider_props}>
        {@render children?.()}
      </Divider>
    {:else if proceedProps.value}
      <Divider {...divider_props}>
        {proceedProps.value}
      </Divider>
    {:else}
      <Divider {...divider_props} />
    {/if}
  {/await}
{/if}
