<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import {
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedFileCardListItem = importComponent(
    () => import('./file-card.list.item')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    _internal: {};
    filename?: string;
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
      filename,
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
      name: filename,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#await AwaitedFileCardListItem then FileCardListItem}
  <FileCardListItem
    style={proceedProps.elem_style}
    className={cls(
      proceedProps.elem_classes,
      'ms-gr-antdx-file-card-list-item'
    )}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    slots={slots.value}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
    name={proceedProps.additionalProps.name || proceedProps.name || ''}
    rootUrl={proceedProps.gradio.shared.root}
    apiPrefix={proceedProps.gradio.shared.api_prefix}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </FileCardListItem>
{/await}
