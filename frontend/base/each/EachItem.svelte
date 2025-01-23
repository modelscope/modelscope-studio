<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  // import { getSetSlotContextFn } from '@svelte-preprocess-react/slot';
  import { merge } from 'lodash-es';

  import Fragment from '../fragment/Index.svelte';

  const AwaitedEachItem = importComponent(() => import('./each.item'));
  export let context_value: Record<PropertyKey, any>;
  export let index: number;
  export let subIndex: number;
  export let value: Record<PropertyKey, any>;
  // const setSlotContext = getSetSlotContextFn();

  $: resolved_value =
    typeof value !== 'object' || Array.isArray(value) ? { value } : value;
  $: merged_value = merge({}, context_value, resolved_value);
  // use lodash to deep merge
  // setSlotContext(merged_value);
  // $: setSlotContext(merged_value);
</script>

<Fragment _internal={{ index, subIndex: index + subIndex }}>
  {#await AwaitedEachItem then EachItem}
    <EachItem __internal_value={merged_value} slots={{}}>
      <slot />
    </EachItem>
  {/await}
</Fragment>
