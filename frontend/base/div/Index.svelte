<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import type React from 'react';
  import cls from 'classnames';

  const AwaitedDiv = importComponent(() => import('./div'));
  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    value: string;
    elem_style: React.CSSProperties;
    additional_props?: Record<string, any>;
    _internal: {
      layout?: boolean;
    };
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      value,
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
      value,
      visible,
      elem_id,
      elem_classes,
      elem_style,
    };
  });

  const proceedProps = $derived(getProceedProps());
</script>

{#if proceedProps.visible}
  {#await AwaitedDiv then Div}
    <Div
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes)}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={{}}
      value={proceedProps.value}
    >
      {@render children?.()}
    </Div>
  {/await}
{/if}
