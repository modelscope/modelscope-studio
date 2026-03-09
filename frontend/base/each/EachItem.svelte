<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import { merge } from 'lodash-es';
  import type { Snippet } from 'svelte';

  import Fragment from '../fragment/Index.svelte';

  const AwaitedEachItem = importComponent(() => import('./each.item'));
  const {
    context_value,
    index,
    subIndex,
    value,
    children,
  }: {
    context_value: Record<PropertyKey, any>;
    index: number;
    subIndex: number;
    value: Record<PropertyKey, any>;
    children: Snippet;
  } = $props();

  const resolved_value = $derived(
    typeof value !== 'object' || Array.isArray(value) ? { value } : value
  );

  const merged_value = $derived(merge({}, context_value, resolved_value));
</script>

<Fragment _internal={{ index, subIndex: index + subIndex }}>
  {#await AwaitedEachItem then EachItem}
    <EachItem __internal_value={merged_value} slots={{}}>
      {@render children()}
    </EachItem>
  {/await}
</Fragment>
