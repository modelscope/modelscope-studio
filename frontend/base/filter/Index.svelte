<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';

  const AwaitedFilter = importComponent(() => import('./filter'));

  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    params_mapping: string;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const { visible, _internal, as_item, params_mapping, ...restProps } =
      getComponentProps();
    return {
      gradio,
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      visible,
      params_mapping,
    };
  });

  const proceedProps = $derived(getProceedProps());
</script>

{#if proceedProps.visible}
  {#await AwaitedFilter then Filter}
    <Filter
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      paramsMapping={proceedProps.params_mapping}
      slots={{}}
      asItem={proceedProps.as_item}
    >
      {@render children?.()}
    </Filter>
  {/await}
{/if}

<style>
  :global(.ms-gr-noop-class) {
    display: none;
  }
</style>
