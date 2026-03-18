<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedFileCardList = importComponent(() => import('./file-card.list'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {};
    items?: any[];
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

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedFileCardList then FileCardList}
    <FileCardList
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antdx-file-card-list')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      items={proceedProps.additionalProps.items ||
        proceedProps.restProps.items ||
        []}
      rootUrl={proceedProps.gradio.shared.root}
      apiPrefix={proceedProps.gradio.shared.api_prefix}
      slots={slots.value}
    >
      {@render children?.()}
    </FileCardList>
  {/await}
{/if}
