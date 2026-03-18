<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  import type { SegmentedProps } from './segmented';

  const AwaitedSegmented = importComponent(() => import('./segmented'));

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;

    _internal: {
      layout?: boolean;
    };
    value?: number | string;
    form_name?: string;
    options?: SegmentedProps['options'];
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
      form_name: 'name',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const options = $derived(
    proceedProps.additionalProps.options ?? proceedProps.restProps.options ?? []
  );
</script>

{#if proceedProps.visible}
  {#await AwaitedSegmented then Segmented}
    <Segmented
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-segmented')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      {options}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
    >
      {@render children?.()}
    </Segmented>
  {/await}
{/if}
