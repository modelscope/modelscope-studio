<script lang="ts">
  import { getProps, processProps } from '@svelte-preprocess-react/component';
  import {
    getSetSlot,
    setSlotKey,
    setSlotParamsMapping,
  } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import { createFunction } from '@utils/createFunction';

  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    value: string;
    params_mapping: string;
  }>(() => props, { i18n: false });

  const getProceedProps = processProps(() => {
    const { value, visible, as_item, _internal, params_mapping } =
      getComponentProps();
    return {
      gradio,
      restProps: {},
      additionalProps: getAdditionalProps(),
      value,
      visible,
      as_item,
      _internal,
      params_mapping,
    };
  });

  const proceedProps = $derived(getProceedProps());
  const setSlot = getSetSlot();

  let slot = $state<HTMLElement>();
  // svelte-ignore state_referenced_locally
  let currentValue = $state(proceedProps.value);
  let prevValue = $state<typeof currentValue>();

  const paramsMapping = $derived(createFunction(proceedProps.params_mapping));

  $effect(() => {
    if (
      slot &&
      proceedProps.value &&
      (prevValue !== currentValue || !currentValue)
    ) {
      currentValue = proceedProps.value;
      setSlot(prevValue || '', currentValue, slot);
      prevValue = currentValue;
    }
  });

  setSlotKey(() => currentValue);
  setSlotParamsMapping(() => paramsMapping);
</script>

{#if proceedProps.visible}
  <svelte-slot bind:this={slot}>
    {@render children?.()}
  </svelte-slot>
{/if}

<style>
  svelte-slot {
    display: none;
  }
</style>
