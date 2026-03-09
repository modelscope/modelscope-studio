<script lang="ts">
  import type { Snippet } from 'svelte';

  import Base from './Base.svelte';

  const {
    children,
    ...props
  }: {
    children: Snippet;
  } = $props();
</script>

<Base {...props} component="layout">{@render children?.()}</Base>

<style>
</style>
