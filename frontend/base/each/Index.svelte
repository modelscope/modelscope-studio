<svelte:options accessors={true} />

<script lang="ts">
  import { getSlotContext } from '@svelte-preprocess-react/slot';

  import Each from './Each.svelte';

  export let value: any[] = [];
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
  });
  $: update({
    _internal,
    value,
    as_item,
    visible,
  });
</script>

{#if $mergedProps.visible}
  {#each $mergedProps.value as item, i}
    <Each value={item} index={$mergedProps._internal.index || 0} subIndex={i}>
      <slot />
    </Each>
  {/each}
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
