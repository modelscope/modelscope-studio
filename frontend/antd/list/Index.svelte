<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedList = importComponent(() => import('./list'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: Record<string, any>;

    pagination_show_size_change?: any;
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
    },
    {
      pagination_show_size_change: 'pagination_showSizeChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

<!-- $slots.default and slot fallbacks are not working in gradio -->
{#if proceedProps.visible}
  {#await AwaitedList then List}
    <List
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-list')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
    >
      {@render children?.()}
    </List>
  {/await}
{/if}
