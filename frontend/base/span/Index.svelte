<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import cls from 'classnames';

  const AwaitedSpan = importComponent(() => import('./span'));
  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    value: string;

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
  {#await AwaitedSpan then Span}
    <Span
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes)}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={{}}
      value={proceedProps.value}
    >
      {@render children?.()}
    </Span>
  {/await}
{/if}
