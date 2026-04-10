<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';

  const AwaitedFragment = importComponent(() => import('./fragment'));

  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } =
    getProps<{}>(() => props);

  const getProceedProps = processProps(
    () => {
      const { visible, _internal, as_item, ...restProps } = getComponentProps();

      return {
        gradio,
        additionalProps: getAdditionalProps(),
        _internal,
        as_item,
        restProps,
        visible,
      };
    },
    undefined,
    {
      shouldResetSlotKey: false,
    }
  );

  const proceedProps = $derived(getProceedProps());
</script>

{#if proceedProps.visible}
  {#await AwaitedFragment then Fragment}
    <Fragment
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={{}}
    >
      {@render children?.()}
    </Fragment>
  {/await}
{/if}
