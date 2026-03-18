<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getConfigType } from '@svelte-preprocess-react/svelte-contexts/config.svelte';
  import { getLoadingStatus } from '@svelte-preprocess-react/svelte-contexts/loading-status.svelte';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedAutoLoading = importComponent(() => import('./auto-loading'));
  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additionalProps: Record<string, any>;
    generating: boolean;
    showError: boolean;
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
        generating,
        showError,
        ...restProps
      } = getComponentProps();
      return {
        gradio,
        additionalProps: getAdditionalProps(),
        restProps,
        _internal,
        as_item,
        visible,
        elem_id,
        elem_classes,
        elem_style,
        generating,
        showError,
      };
    },
    undefined,
    {
      shouldSetLoadingStatus: false,
    }
  );

  const proceedProps = $derived(getProceedProps());

  const configType = getConfigType();
  const slots = getSlots();

  const loadingStatus = getLoadingStatus(() => ({
    generating: proceedProps.generating,
    error: proceedProps.showError,
  }));
</script>

{#if proceedProps.visible}
  {#await AwaitedAutoLoading then AutoLoading}
    <AutoLoading
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-auto-loading')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      configType={configType.value}
      loadingStatus={loadingStatus.value}
    >
      {@render children?.()}
    </AutoLoading>
  {/await}
{/if}
