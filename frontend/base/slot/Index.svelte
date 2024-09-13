<svelte:options accessors={true} />

<script lang="ts">
  import {
    getSetSlotContextFn,
    getSetSlotFn,
    getSlotContext,
    getSlotParams,
    setSlotKey,
  } from '@svelte-preprocess-react/slot';
  import { createFunction } from '@utils/createFunction';
  import { type Writable, writable } from 'svelte/store';

  export let params_mapping: string;
  export let value: string = '';
  export let visible = true;
  export let as_item: string | undefined;
  export let _internal = {};
  export let skip_context_value = true;

  const slotParams = getSlotParams();

  const [mergedProps, update] = getSlotContext({
    _internal,
    value,
    visible,
    as_item,
    params_mapping,
    skip_context_value,
  });
  $: update({
    _internal,
    value,
    visible,
    as_item,
    params_mapping,
    skip_context_value,
  });
  const slot: Writable<HTMLElement> = writable();
  const setSlot = getSetSlotFn();
  let prevValue: string | undefined;
  let currentValue: string = value;
  $: paramsMapping = $mergedProps.params_mapping;
  $: paramsMappingFn = createFunction(paramsMapping);

  $: {
    if ($slot && $mergedProps.value) {
      currentValue = $mergedProps.skip_context_value
        ? value
        : $mergedProps.value;
      setSlot(prevValue || '', currentValue, $slot);
      prevValue = currentValue;
    }
  }

  const slotKey = setSlotKey(currentValue);
  $: slotKey.set(currentValue);

  const setSlotContext = getSetSlotContextFn();
  $: {
    if ($slotParams && $slotParams[currentValue]) {
      if (paramsMappingFn) {
        setSlotContext(paramsMappingFn(...$slotParams[currentValue]));
      }
    }
  }
</script>

{#if $mergedProps.visible}
  <svelte-slot bind:this={$slot}><slot /></svelte-slot>
{/if}

<style>
  svelte-slot {
    display: none;
  }
</style>
