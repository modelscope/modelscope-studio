<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSubIndex } from '@svelte-preprocess-react/svelte-contexts/each.svelte';
  import { getSlotKey } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';

  import EachItem from './EachItem.svelte';

  const AwaitedEach = importComponent(() => import('./each'));
  const AwaitedEachPlaceholder = importComponent(
    () => import('./each.placeholder')
  );
  const props = $props();
  const { gradio, getComponentProps, children } = getProps<{
    context_value?: Record<PropertyKey, any>;
    value?: Record<PropertyKey, any>[];
    _internal: {
      index?: number;
    };
  }>(() => props);

  // if ms.Each inside ms.Each
  const subIndex = getSubIndex();
  const slotKey = getSlotKey();

  const getProceedProps = processProps(
    () => {
      const {
        visible,
        _internal,
        value,
        as_item,
        elem_classes,
        elem_id,
        elem_style,
        context_value,
        ...restProps
      } = getComponentProps();
      return {
        gradio,
        _internal,
        as_item,
        value,
        visible,
        elem_id,
        elem_classes,
        elem_style,
        context_value,
        restProps,
      };
    },
    undefined,
    { shouldResetSlotKey: false }
  );

  const proceedProps = $derived(getProceedProps());

  let merged_value: typeof proceedProps.value = $state([]);
  let merged_context_value: typeof proceedProps.context_value = $state({});
  let force_clone = $state(false);
</script>

{#if proceedProps.visible}
  {#await AwaitedEachPlaceholder then EachPlaceholder}
    <EachPlaceholder
      value={proceedProps.value}
      contextValue={proceedProps.context_value}
      slots={{}}
      {...proceedProps.restProps}
      onChange={(changedValue) => {
        merged_value = changedValue.value || [];
        merged_context_value = changedValue.contextValue || {};
        force_clone = changedValue.forceClone || false;
      }}
    />
    {#if force_clone}
      {#await AwaitedEach then Each}
        <Each
          {...proceedProps.restProps}
          contextValue={proceedProps.context_value}
          value={proceedProps.value}
          __internal_slot_key={slotKey?.value}
          slots={{}}
        >
          {@render children?.()}
        </Each>
      {/await}
    {:else}
      {#each merged_value as item, i (i)}
        <EachItem
          context_value={merged_context_value || {}}
          value={item}
          index={(proceedProps._internal.index || 0) + (subIndex?.value || 0)}
          subIndex={(subIndex?.value || 0) + i}
          gradio={proceedProps.gradio}
        >
          {@render children?.()}
        </EachItem>
      {/each}
    {/if}
  {/await}
{/if}

<style>
  :global(.ms-gr-noop-class) {
    display: none;
  }
</style>
