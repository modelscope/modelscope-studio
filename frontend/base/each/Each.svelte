<svelte:options accessors={true} />

<script lang="ts">
  import { getSetSlotContextFn } from '@svelte-preprocess-react/slot';
  import { merge } from 'lodash-es';

  import Fragment from '../fragment/Index.svelte';

  export let context_value: Record<PropertyKey, any>;
  export let index: number;
  export let subIndex: number;
  export let value: Record<PropertyKey, any>;
  const setSlotContext = getSetSlotContextFn();

  // 如果是 array 呢
  $: resolved_value =
    typeof value !== 'object' || Array.isArray(value) ? { value } : value;

  // use lodash to deep merge
  setSlotContext(merge(context_value, resolved_value));
  $: setSlotContext(merge(context_value, resolved_value));
</script>

<Fragment _internal={{ index, subIndex }}>
  <slot />
</Fragment>
