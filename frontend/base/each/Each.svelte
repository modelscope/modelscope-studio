<svelte:options accessors={true} />

<script lang="ts">
  import { getSetSlotContextFn } from '@svelte-preprocess-react/slot';

  import Fragment from '../fragment/Index.svelte';

  export let index: number;
  export let subIndex: number;
  export let value: any;
  const setSlotContext = getSetSlotContextFn();
  setSlotContext(value);
  $: setSlotContext(value);
</script>

<Fragment _internal={{ index, subIndex }}>
  <slot />
</Fragment>
