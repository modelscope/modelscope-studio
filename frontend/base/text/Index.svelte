<svelte:options accessors={true} />

<script lang="ts">
  import { getSlotContext } from '@svelte-preprocess-react/slot';

  import ShowFragment from '../fragment/ShowFragment.svelte';

  import './global.css';

  export let value: string = '';
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let _internal: {
    fragment?: boolean;
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
  <ShowFragment {...$$props} show={$mergedProps._internal.fragment}>
    {$mergedProps.value}
  </ShowFragment>
{/if}
