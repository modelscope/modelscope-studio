<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlotKey } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';

  const AwaitedFormItemRule = importComponent(() => import('./form.item.rule'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string;
    _internal: {
      layout?: boolean;
      index?: number;
    };
  }>(() => props);
  const slotKey = getSlotKey();

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
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
      visible,
      elem_id,
      elem_classes,
      elem_style,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const itemProps = $derived({
    props: {
      ...proceedProps.restProps,
      ...proceedProps.additionalProps,
    },
    slots: {},
  });
</script>

{#await AwaitedFormItemRule then FormItemRule}
  <FormItemRule
    {...itemProps.props}
    slots={itemProps.slots}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </FormItemRule>
{/await}
