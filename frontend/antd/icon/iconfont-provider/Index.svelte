<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';

  const AwaitIconFontProvider = importComponent(
    () => import('./iconfont-provider')
  );
  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additionalProps: Record<string, any>;
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
</script>

{#if proceedProps.visible}
  {#await AwaitIconFontProvider then IconFontProvider}
    <IconFontProvider
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={{}}
    >
      {@render children?.()}
    </IconFontProvider>
  {/await}
{/if}
