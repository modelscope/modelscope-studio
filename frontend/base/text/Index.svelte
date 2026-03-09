<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';

  const AwaitedText = importComponent(() => import('./text'));
  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps } = getProps<{
    value?: string;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const { visible, _internal, value, as_item, ...restProps } =
      getComponentProps();
    return {
      gradio,
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      value,
      visible,
    };
  });

  const proceedProps = $derived(getProceedProps());
</script>

{#if proceedProps.visible}
  {#await AwaitedText then Text}
    <Text
      value={proceedProps.value}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={{}}
    />
  {/await}
{/if}
