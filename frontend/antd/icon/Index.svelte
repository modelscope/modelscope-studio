<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedIcon = importComponent(() => import('./icon'));
  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
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
  const value = $derived(
    proceedProps.additionalProps.value || proceedProps.value || ''
  );
</script>

{#if proceedProps.visible}
  {#await AwaitedIcon then Icon}
    <Icon
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-icon')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      {value}
      slots={slots.value}
    >
      {@render children?.()}
    </Icon>
  {/await}
{/if}
