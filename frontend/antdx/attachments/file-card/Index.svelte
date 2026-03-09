<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots, getSlotKey } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedFileCard = importComponent(
    () => import('./attachments.file-card')
  );

  const props = $props();
  const { getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
      index?: number;
    };
  }>(() => props);

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

  const slots = getSlots();
  const slotKey = getSlotKey();
</script>

{#if proceedProps.visible}
  {#await AwaitedFileCard then FileCard}
    <FileCard
      style={proceedProps.elem_style}
      className={cls(
        proceedProps.elem_classes,
        'ms-gr-antdx-attachments-file-card'
      )}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      itemIndex={proceedProps._internal.index || 0}
      itemSlotKey={slotKey?.value}
    >
      {@render children()}
    </FileCard>
  {/await}
{/if}
