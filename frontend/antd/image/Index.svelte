<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import type { FileData } from '@gradio/client';
  import cls from 'classnames';

  const AwaitedImage = importComponent(() => import('./image'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    value?: string | FileData;

    preview_visible_change?: any;
  }>(() => props);

  const getProceedProps = processProps(
    () => {
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
    },
    {
      preview_visible_change: 'preview_visibleChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const src = $derived.by(() => {
    const val = proceedProps.additionalProps.value ?? proceedProps.value;
    if (typeof val === 'object' && val) {
      return val.url || '';
    }
    return val || '';
  });
</script>

{#if proceedProps.visible}
  {#await AwaitedImage then Image}
    <Image
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-image')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      src={proceedProps.additionalProps.src || src}
    >
      {@render children?.()}
    </Image>
  {/await}
{/if}
