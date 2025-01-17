<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import { getSlotContext } from '@svelte-preprocess-react/slot';

  import EachItem from './EachItem.svelte';

  const AwaitedEach = importComponent(() => import('./each'));
  const AwaitedEachPlaceholder = importComponent(
    () => import('./each.placeholder')
  );
  export let context_value: Record<PropertyKey, any>;
  export let value: Record<PropertyKey, any>[] = [];
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let _internal: {
    index?: number;
  } = {};

  const [mergedProps, update] = getSlotContext({
    _internal,
    value,
    as_item,
    visible,
    restProps: $$restProps,
    context_value,
  });
  $: update({
    _internal,
    value,
    as_item,
    visible,
    restProps: $$restProps,
    context_value,
  });
  let merged_value: typeof value = [];
  let merged_context_value: typeof context_value;
  let force_clone = false;
</script>

{#if $mergedProps.visible}
  {#await AwaitedEachPlaceholder then EachPlaceholder}
    <EachPlaceholder
      value={$mergedProps.value}
      contextValue={$mergedProps.context_value}
      slots={{}}
      {...$mergedProps.restProps}
      onChange={(props) => {
        merged_value = props.value || [];
        merged_context_value = props.contextValue || {};
        force_clone = props.forceClone || false;
      }}
    />
    {#if force_clone}
      {#await AwaitedEach then Each}
        <Each
          {...$mergedProps.restProps}
          contextValue={$mergedProps.context_value}
          value={$mergedProps.value}
          slots={{}}
        >
          <slot />
        </Each>
      {/await}
    {:else}
      {#each merged_value as item, i}
        <EachItem
          context_value={merged_context_value}
          value={item}
          index={$mergedProps._internal.index || 0}
          subIndex={i}
        >
          <slot />
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
