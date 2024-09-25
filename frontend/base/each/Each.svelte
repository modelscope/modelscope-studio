<svelte:options accessors={true} />

<script lang="ts">
  import { getSetSlotContextFn } from '@svelte-preprocess-react/slot';

  import Fragment from '../fragment/Index.svelte';

  export let context_value: Record<PropertyKey, any>;
  export let index: number;
  export let subIndex: number;
  export let value: Record<PropertyKey, any>;
  const setSlotContext = getSetSlotContextFn();
  setSlotContext({
    ...context_value,
    ...value,
    restProps: $$restProps,
  });
  $: setSlotContext({
    ...context_value,
    ...value,
    restProps: $$restProps,
  });
</script>

<Fragment _internal={{ index, subIndex }}>
  <slot />
</Fragment>
