<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedWatermark = importComponent(() => import('./watermark'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {};
    content?: string;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      content,
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
      content,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedWatermark then Watermark}
    <Watermark
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-watermark')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      content={proceedProps.additionalProps.content ?? proceedProps.content}
    >
      {@render children?.()}
    </Watermark>
  {/await}
{/if}
